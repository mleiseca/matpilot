const { authenticate } = require('@feathersjs/authentication').hooks
const assignCreatedBy = require('../../hooks/created-by')
const { fastJoin, makeCallingParams } = require('feathers-hooks-common')
const customQuery = require('../../hooks/custom-query').customQuery
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym
const logger = require('../../logger')
const moment = require('moment')
const commonHooks = require('feathers-hooks-common')

const BatchLoader = require('@feathers-plus/batch-loader')
const { getResultsByKey, getUniqueKeys } = BatchLoader
const uuid = require('uuid')
const AWS = require('aws-sdk')

const errors = require('@feathersjs/errors')

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

      const MembersModel = hook.app.get('sequelizeClient').models['members']
      const memberId = hook.data.id
      logger.info('Writing waiver to S3, gym, member %s, %s, %s', hook.data.gymId, hook.data.lastName, memberId)
      let buf = new Buffer.from(hook.data.waiverSignature.replace(/^data:image\/\w+;base64,/, ''),'base64')

      // TODO: property name
      let keyName = 'gym_'  + hook.data.gymId + '_' + hook.data.id + '_' +  uuid.v4() + '.png'
      const objectParams = {
        Bucket: WAIVER_S3_BUCKET,
        Key: keyName,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/png'
      }

      delete hook.data.waiverSignature

      new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise()
        .then(function(data) {
          logger.info('Successfully uploaded data to ' + WAIVER_S3_BUCKET + '/' + keyName, data)

          MembersModel.update(
            {
              // https://s3.amazonaws.com/com.matpilot.development.waivers/waiver_ea5ad235-ce8b-43c4-a497-8565a0041dc0.png
              waiverUrl: WAIVER_S3_BUCKET + '/' + keyName,
              waiverSignedDate: moment()
            },
            {returning: true, where: {id: memberId} },
            {
              where: { id: memberId }
            }
          ).then(function() {
            logger.info('Saved waiver data of memberId ' + memberId)
          })
        })
        .catch((error) => {
          logger.error('Failed to upload to s3', error)
        })

      logger.info('Finished initial processing of waiver for member ' + memberId)
      return hook
    } else {
      logger.info('No need to write waiver to S3 %s, member: %s', hook.data.gymId, hook.data.id)
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
    delete hook.data.lowerNickname
    delete hook.data.lowerLastName


    if (hook.data.firstName) {
      hook.data.lowerFirstName = hook.data.firstName.toLowerCase()
    }
    if (hook.data.nickname) {
      hook.data.lowerNickname = hook.data.nickname.toLowerCase()
    } else {
      hook.data.lowerNickname = null
    }
    if (hook.data.lastName) {
      hook.data.lowerLastName = hook.data.lastName.toLowerCase()
    }
  }
}

const queries = {
  'SUGGESTED_ATTENDEES': 'select members.* from members\n' +
    'where\n' +
    '  id in (\n' +
    '   select ema."memberId" from events e, events sc, event_member_attendance ema where ' +
    '   e."startDateTime" > $attendedAfter and ' +
    '   e."scheduledEventId" = sc."scheduledEventId" AND ' +
    '    e.id <> sc.id AND\n' +
    '   ema."eventId" = e.id and ' +
    '      sc.id = $currentEventId) ' +
    '  order by members."lowerFirstName" , members."lowerLastName" desc'
}


// This comes from https://stackoverflow.com/questions/48602085/using-feathers-client-and-sequelize-many-to-many-relation
function include(hook) {
  const { $include } = hook.params.query

  if (!$include) {
    Promise.resolve(hook)
    return
  }
  // Remove from the query so that it doesn't get included
  // in the actual database query
  delete hook.params.query.$include

  hook.params.sequelize = {
    include: []
  }

  if(Array.isArray($include)) {
    $include.forEach(inc => {
      hook.params.sequelize.include.push({
        // https://sequelize.readthedocs.io/en/latest/api/model/#findalloptions-promisearrayinstance
        model: hook.app.services[inc.model].Model,
        where: inc.where,
        required: true
      })
    })
  }
  return Promise.resolve(hook)
}

module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym()],
    find: [customQuery({queries: queries, model: 'members'}), include],
    get: [],
    create: [
      commonHooks.lowerCase('email'),
      assignCreatedBy,
      createLowerName()

    ],
    update: [
      commonHooks.discard('rank', 'rankAwardDate'),
      commonHooks.lowerCase('email'),
      writeWaiverSignatureToS3(),
      createLowerName()],
    patch: [
      // commonHooks.iff(
      //   commonHooks.isProvider('external'),
      //   commonHooks.preventChanges(true,
      //     ['waiverSignedDate'])),
      commonHooks.discard('rank', 'rankAwardDate'),
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
