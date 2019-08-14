const { authenticate } = require('@feathersjs/authentication').hooks
const assignCreatedBy = require('../../hooks/created-by')
const { fastJoin, makeCallingParams } = require('feathers-hooks-common')
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym
const logger = require('../../logger')
const moment = require('moment')
const commonHooks = require('feathers-hooks-common')

const BatchLoader = require('@feathers-plus/batch-loader')
const { getResultsByKey, getUniqueKeys } = BatchLoader
const uuid = require('uuid')
const AWS = require('aws-sdk')


const { paramsFromClient } = require('feathers-hooks-common')

const WAIVER_S3_BUCKET = process.env.WAIVER_S3_BUCKET || 'com.matpilot.production.waivers'

const memberResolvers = {
  before: context => {
    context._loaders = { event_attendance: {} }
    context._loaders.event_attendance.event_id = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('event-member-attendance').find(makeCallingParams(
        context, {
          memberId: { $in: getUniqueKeys(keys) },
          eventId: context.params.populate.id
        }, undefined, { paginate: false }
      ))
      logger.info(result)
      return getResultsByKey(keys, result, attendance => attendance.memberId, '!')
    },
    { context }
    )
  },
  joins: {
    attendance: () => async (member, context) => {
      // context.params.populate: { entity: 'event-member-attendance', id: '31' } }
      if (context.params.populate && context.params.populate.entity === 'event-member-attendance') {
        member.attendance = await context._loaders.event_attendance.event_id.load(member.id)
      }
    }

    // Just in case this is helpful...
    // attendance: (...args) => async (member, context) => {
    //   if (context.params.populate && context.params.populate.entity === 'event-member-attendance') {
    //     member.attendance = (await context.app.service('event-member-attendance').find({
    //       query: {
    //         memberId: member.id,
    //         eventId: context.params.populate.id
    //       }
    //     }))
    //   }
    // },
  }
}

function addUrlForWaiver() {
  return function(hook) {
    const member = hook.result

    if (member && member.waiverUrl) {
      logger.info(member)
      let key = member.waiverUrl
      let bucket = WAIVER_S3_BUCKET
      if (member.waiverUrl.startsWith('https')) {
        let regex = /.*?([^/]*)$/
        let match = member.waiverUrl.match(regex)
        key = match[1]
      } else {
        let regex = /^(.*?)\/([^/]*)$/
        let match = member.waiverUrl.match(regex)
        bucket = match[1]
        key = match[2]
      }
      if (key) {
        const params = {
          Bucket: bucket,
          Key: key,
          Expires: 60 * 60 // expires in 1 hour
        }
        member.waiverSignedUrl = new AWS.S3({apiVersion: '2006-03-01'}).getSignedUrl('getObject', params)
      }
    }
  }
}
function writeWaiverSignatureToS3() {
  return function(hook) {
    if (hook.data.waiverSignature) {
      logger.info('Writing waiver to S3, gym, member %s, %s', hook.data.gymId, hook.data.lastName)
      let buf = new Buffer(hook.data.waiverSignature.replace(/^data:image\/\w+;base64,/, ''),'base64')

      // TODO: property name
      let keyName = 'gym_'  + hook.data.gymId + '_' +  uuid.v4() + '.png'
      const objectParams = {
        Bucket: WAIVER_S3_BUCKET,
        Key: keyName,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/png'
      }

      // console.log(objectParams)
      return new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise()
        .then(function(data) {
          delete hook.data.waiverSignature
          logger.info('Successfully uploaded data to ' + WAIVER_S3_BUCKET + '/' + keyName, data)
          // https://s3.amazonaws.com/com.matpilot.development.waivers/waiver_ea5ad235-ce8b-43c4-a497-8565a0041dc0.png
          hook.data.waiverUrl = WAIVER_S3_BUCKET + '/' + keyName
          hook.data.waiverSignedDate = moment()
        })
    } else {
      logger.info('No need to write waiver to S3 %s, %s', hook.data.gymId, hook.data.userId)
    }
  }
}

function createLowerName() {
  return function(hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'createLowerName\' hook should only be used as a \'before\' hook.')
    }

    if (!(hook.method === 'update' || hook.method === 'patch' || hook.method === 'create')) {
      throw new errors.MethodNotAllowed(`The 'createLowerName' hook should only be used on the 'update', 'patch' and 'create' service methods...not ${hook.method}`)
    }

    delete hook.data.lowerFirstName
    delete hook.data.lowerLastName


    if (hook.data.firstName) {
      hook.data.lowerFirstName = hook.data.firstName.toLowerCase()
    }
    if (hook.data.lastName) {
      hook.data.lowerLastName = hook.data.lastName.toLowerCase()
    }
  }
}

// This comes from https://stackoverflow.com/questions/48602085/using-feathers-client-and-sequelize-many-to-many-relation
function include(hook) {
  const { $include } = hook.params.query;

  if (!$include) {
    Promise.resolve(hook)
    return
  }
  // Remove from the query so that it doesn't get included
  // in the actual database query
  console.log("Moving around incldue... Here is the raw query", hook.params.query)
  delete hook.params.query.$include;

  hook.params.sequelize = {
    include: []
  };

  if(Array.isArray($include)) {
    $include.forEach(inc => {
      hook.params.sequelize.include.push({
        // https://sequelize.readthedocs.io/en/latest/api/model/#findalloptions-promisearrayinstance
        model: hook.app.services[inc.model].Model,
        where: inc.where,
        required: true
      });
    });
  }
  console.log("Final include: ", hook.params.sequelize.include)
  return Promise.resolve(hook);
}

module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym()],
    find: [paramsFromClient('populate'), include],
    get: [],
    create: [
      commonHooks.lowerCase('email'),
      assignCreatedBy,
      writeWaiverSignatureToS3(),
      createLowerName()

    ],
    update: [commonHooks.lowerCase('email'), writeWaiverSignatureToS3(), createLowerName()],
    patch: [
      // commonHooks.iff(
      //   commonHooks.isProvider('external'),
      //   commonHooks.preventChanges(true,
      //     ['waiverSignedDate'])),
      commonHooks.lowerCase('email'),
      writeWaiverSignatureToS3(),
      createLowerName()
    ],
    remove: []
  },

  after: {
    all: [ fastJoin(memberResolvers) ],
    find: [],
    get: [addUrlForWaiver()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
