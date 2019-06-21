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

function writeWaiverSignatureToS3() {
  return function(hook) {
    if (hook.data.waiverSignature) {
      logger.info('Writing waiver to S3, gym, member', hook.data.gymId, hook.data.lastName)
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
          hook.data.waiverUrl = 'https://s3.amazonaws.com/' + WAIVER_S3_BUCKET + '/' + keyName
          hook.data.waiverSignedDate = moment()
        })
    } else {
      logger.info('No need to write waiver to S3', hook.data.gymId, hook.data.userId)
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

module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym()],
    find: [paramsFromClient('populate')],
    get: [],
    create: [
      assignCreatedBy,
      writeWaiverSignatureToS3(),
      createLowerName()

    ],
    update: [writeWaiverSignatureToS3(), createLowerName()],
    patch: [
      // commonHooks.iff(
      //   commonHooks.isProvider('external'),
      //   commonHooks.preventChanges(true,
      //     ['waiverSignedDate'])),
      writeWaiverSignatureToS3(),
      createLowerName()
    ],
    remove: []
  },

  after: {
    all: [ fastJoin(memberResolvers) ],
    find: [],
    get: [],
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
