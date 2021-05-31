const { authenticate } = require('@feathersjs/authentication').hooks;
const moment = require('moment')
const assignCreatedBy = require('../../hooks/created-by')
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym
const logger = require('../../logger')
const uuid = require('uuid')
const AWS = require('aws-sdk')

const WAIVER_S3_BUCKET = process.env.WAIVER_S3_BUCKET || 'com.matpilot.production.waivers'

function addUrlForEach(input) {
  if (input && input.waiverUrl) {
    logger.info(input)
    let key = input.waiverUrl
    let bucket = WAIVER_S3_BUCKET
    if (input.waiverUrl.startsWith('https')) {
      let regex = /.*?([^/]*)$/
      let match = input.waiverUrl.match(regex)
      key = match[1]
    } else {
      let regex = /^(.*?)\/([^/]*)$/
      let match = input.waiverUrl.match(regex)
      bucket = match[1]
      key = match[2]
    }
    if (key) {
      const params = {
        Bucket: bucket,
        Key: key,
        Expires: 60 * 60 // expires in 1 hour
      }
      input.waiverSignedUrl = new AWS.S3({apiVersion: '2006-03-01'}).getSignedUrl('getObject', params)
    }
  }
}
function addUrlForWaiver() {
  return function(hook) {
    const input = hook.result
    input.data.forEach(addUrlForEach)
    console.log('addUrlForWaiver', hook.result.data)
    return hook
  }
}
function writeWaiverSignatureToS3() {
  return async function(hook) {
    if (hook.data.waiverSignature) {

      const memberId = hook.data.memberId
      logger.info('Writing waiver to S3, gym, member %s, %s, %s', hook.data.gymId, hook.data.lastName, memberId)

      let buf = null
      try {
        // I'm not sure why this is required. It's like we are getting a string (the try case) when we are adding
        // a waiver to an existing member.
        // When we are creating a member, this fails, but the buffer works fine.
        buf = new Buffer.from(hook.data.waiverSignature.replace(/^data:image\/\w+;base64,/, ''), 'base64')
      } catch(err) {
        buf = Buffer.from(hook.data.waiverSignature,'base64')
      }

      // TODO: property name
      let keyName = 'gym_'  + hook.data.gymId + '_' + memberId + '_' + hook.data.gymWaiverId + '_' +  uuid.v4() + '.png'
      const objectParams = {
        Bucket: WAIVER_S3_BUCKET,
        Key: keyName,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/png'
      }

      delete hook.data.waiverSignature

      try {
        const data = await new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise()
        logger.info('Successfully uploaded data to ' + WAIVER_S3_BUCKET + '/' + keyName, data)
        hook.data.waiverUrl = WAIVER_S3_BUCKET + '/' + keyName

        logger.info('Finished initial processing of waiver for member %s ', memberId)
      } catch (error) {
        logger.error('Failed to upload to s3', error)
      }
      return hook


    } else {
      logger.info('No need to write waiver to S3 %s, member: %s', hook.data.gymId, hook.data.id)
    }
  }
}


module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym()],
    find: [],
    get: [],
    create: [assignCreatedBy, writeWaiverSignatureToS3()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [addUrlForWaiver()],
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
};
