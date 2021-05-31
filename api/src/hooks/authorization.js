const { get, set, isUndefined } = require('lodash')
const errors = require('@feathersjs/errors')
const logger = require('../logger')

const restrictAccessForGymDefaults = {
  gymIdField: 'gymId',
  as: 'gymId',
  role: null
}

const restrictAccessForMemberDefaults = {
  memberIdField: 'memberId',
  gymIdField: 'gymId', // used to plug user gymIds into the query if there's no memberid
  as: 'memberId'
}

const userRolesQuery = `select "gymId", role from user_gym_role where "userId" = $userId
    union
    select "gymId", 'MEMBER' as role from members where email in (select email from users where id = $userId and "isVerified" = true)`

const userMemberQuery =
  `select id from members where "gymId" in
  (select "gymId" from user_gym_role where "userId" = $userId
  union
  select "gymId" from members where email in (select email from users where id = $userId and "isVerified" = true));
  `

function fetchUserGymIds(app, userId, optionalRequiredRoles) {
  const sequelize = app.get('sequelizeClient')
  return sequelize.query(userRolesQuery,
    {
      raw: true,
      bind: {
        userId: userId
      }
    })
    .then(results => {
      const gymIds = new Set()

      results[0].forEach(userGymRole => {
        if (isUndefined(optionalRequiredRoles) || optionalRequiredRoles === null) {
          gymIds.add(userGymRole.gymId)
        } else if (optionalRequiredRoles.includes(userGymRole.role)) {
          gymIds.add(userGymRole.gymId)
        }
      })

      return gymIds
    })
}

function fetchMemberIds(app, userId) {
  const sequelize = app.get('sequelizeClient')
  return sequelize.query(userMemberQuery,
    {
      raw: true,
      bind: {
        userId: userId
      }
    })
    .then(results => {
      const memberIds = new Set()

      results[0].forEach(member => {
        memberIds.add(member.id)
      })

      return memberIds
    })
}

function addGymIdParameter(hook, options) {

  return fetchUserGymIds(hook.app, hook.params.user.id).then(function (gymIds) {

    let explicitGymId = extractGymId(hook.params.query, options);

    if (isUndefined(explicitGymId )) {

      logger.info('%s - %s: No explicitGymId in %s. Adding ids %s', hook.path, hook.method, hook.params.query, Array.from(gymIds))
      set(hook.params, `query.${options.gymIdField}`, Array.from(gymIds))
    } else {
      logger.info('%s - %s: Found explicitGymId in %s: %s', hook.path, hook.method, hook.params.query, explicitGymId)

      explicitGymId = parseInt(explicitGymId, 10)
      if (!gymIds.has(explicitGymId)) {
        logger.info('Permission denied, gymIds is [%s] query wanted %s', Array.from(gymIds).join(','), explicitGymId)
        throw new errors.Forbidden('You do not have the permissions to access this.')
      }
    }
    return hook
  })
}

function extractCustomQueryParams(customQuery) {
  if ('bind' in customQuery) {
    return customQuery.bind
  } else if ('replacements' in customQuery) {
    return customQuery.replacements
  } else {
    logger.error("Unable to parse custom query %o", customQuery)
  }
}

function extractMemberId(dataOrQuery, options) {
  let explicitMemberId = get(dataOrQuery, options.memberIdField)

  if (!isUndefined(explicitMemberId)) {
    explicitMemberId = parseInt(explicitMemberId, 10)
    if (isNaN(explicitMemberId)) {
      explicitMemberId = undefined
    }
  }
  if (isUndefined(explicitMemberId)) {
    const customQuery = get(dataOrQuery, '$customQuery')
    // TODO: for custom query, we should probably throw an exception if id is not defined
    // logger.info('checking %s for customquery %o for memberid:', dataOrQuery, customQuery)

    if (!isUndefined(customQuery)) {
      explicitMemberId = get(extractCustomQueryParams(customQuery), options.memberIdField)
      logger.info("Found custom query params: %o", extractCustomQueryParams(customQuery))
      explicitMemberId = parseInt(explicitMemberId, 10)
      if (isNaN(explicitMemberId)) {
        explicitMemberId = undefined
      }
      logger.debug('....Found memberid: ', explicitMemberId)
    }
  }
  return explicitMemberId;
}

function extractGymId(dataOrQuery, options) {
  let explicitGymId = get(dataOrQuery, options.gymIdField)

  if (isUndefined(explicitGymId)) {
    const customQuery = get(dataOrQuery, '$customQuery')
    logger.debug('checking customquery for gymId:', dataOrQuery, customQuery)
    // TODO: for custom query, we should probably throw an exception if id is not defined
    if (!isUndefined(customQuery)) {
      explicitGymId = get(extractCustomQueryParams(customQuery), options.memberIdField)
      explicitGymId = parseInt(explicitGymId, 10)
      if (isNaN(explicitGymId)) {
        explicitGymId = undefined
      }
      logger.debug('....Found explicitGymId: ', explicitGymId)
    }
  }
  return explicitGymId;
}

async function addMemberIdParameter(hook, options) {

  const memberIds = await fetchMemberIds(hook.app, hook.params.user.id)

  let explicitMemberId = extractMemberId(hook.params.query, options);

  if (isUndefined(explicitMemberId)) {

    const userGymIds = await fetchUserGymIds(hook.app, hook.params.user.id)
    // logger.info('%s - %s: No explicitMemberId in %s. Adding ids %s', hook.path, hook.method, hook.params.query, Array.from(memberIds))
    logger.info('%s - %s: No explicitMemberId in %s. Adding GYM ids %s', hook.path, hook.method, hook.params.query, Array.from(userGymIds))
    set(hook.params, `query.${options.gymIdField}`, Array.from(userGymIds))
    // set(hook.params, `query.${options.memberIdField}`, Array.from(memberIds))
  } else {
    logger.info('%s - %s: Found explicitMemberId: %s', hook.path, hook.method, explicitMemberId)
    if (!memberIds.has(explicitMemberId)) {
      logger.info('Permission denied, memberIds is [%s] query wanted %s', Array.from(memberIds).join(','), explicitMemberId)
      throw new errors.Forbidden('You do not have the permissions to access this.')
    }
  }
  return hook
}


function verifyGymIdParameter(hook, options, optionalRequiredRoles) {
  return fetchUserGymIds(hook.app, hook.params.user.id, optionalRequiredRoles).then(function (gymIds) {
    let explicitGymId = extractGymId(hook.data, options);
    explicitGymId = parseInt(explicitGymId, 10)
    if (!gymIds.has(explicitGymId)) {
      logger.info('Permission denied, gymIds is [%s] query wanted %s',Array.from(gymIds).join(','), explicitGymId)
      throw new errors.Forbidden('You do not have the permissions to access this.')
    }
    return hook
  })
}

function verifyMemberIdParameter(hook, options) {
  return fetchMemberIds(hook.app, hook.params.user.id).then(function (memberIds) {
    let explicitMemberId = extractMemberId(hook.data, options);


    explicitMemberId = parseInt(explicitMemberId, 10)
    logger.info('%s - %s: Found explicitMemberId: %s', hook.path, hook.method, explicitMemberId)
    if (!memberIds.has(explicitMemberId)) {
      logger.info('Permission denied, memberIds is [%s] query wanted %s',Array.from(memberIds).join(','), explicitMemberId)
      throw new errors.Forbidden('You do not have the permissions to access this.')
    }
    return hook
  })
}


function restrictAccessForMember(options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'restrictAccessForMember\' hook should only be used as a \'before\' hook.')
    }
    const { query = {} } = hook.params;
    // console.log(query)

    options = Object.assign({}, restrictAccessForMemberDefaults, options)

    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook
    }

    if (hook.method === 'create') {
      return verifyMemberIdParameter(hook, options, options.role)
    }

    if (hook.method === 'find' || hook.id === null) {
      return addMemberIdParameter(hook, options)
    }

    // Check hook is being called on an allowable method
    if (!(hook.method === 'get' || hook.method === 'update' || hook.method === 'patch' || hook.method === 'remove')) {
      throw new errors.MethodNotAllowed(`The 'restrictAccessForMember' hook should only be used on the 'get', 'update', 'patch' and 'remove' service methods...not ${hook.method}`)
    }

    // look up the document and throw a Forbidden error if the user is not an owner
    // Set provider as undefined so we avoid an infinite loop if this hook is
    // set on the resource we are requesting.
    const params = Object.assign({}, hook.params, { provider: undefined })

    return hook.service.get(hook.id, params).then(data => {
      return fetchMemberIds(hook.app, hook.params.user.id).then(function (memberIds) {
        let memberIdParam = get(data, options.memberIdField);
        logger.info('Checking MemberId: %s', memberIdParam)
        if (!memberIds.has(memberIdParam) ) {
          logger.info('Permission denied, memberIdParam: %s, memberIdField is %o', memberIdParam, memberIds)
          throw new errors.Forbidden('You do not have the permissions to access this.')
        }

      })
    })
  }
}

function restrictAccessForGym(options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'restrictAccessForGym\' hook should only be used as a \'before\' hook.')
    }

    options = Object.assign({}, restrictAccessForGymDefaults, options)

    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook
    }

    if (hook.method === 'create') {
      return verifyGymIdParameter(hook, options, options.role)
    }

    if (hook.method === 'find' || hook.id === null) {
      return addGymIdParameter(hook, options)
    }

    // Check hook is being called on an allowable method
    if (!(hook.method === 'get' || hook.method === 'update' || hook.method === 'patch' || hook.method === 'remove')) {
      throw new errors.MethodNotAllowed(`The 'restrictAccessForGym' hook should only be used on the 'get', 'update', 'patch' and 'remove' service methods...not ${hook.method}`)
    }

    // look up the document and throw a Forbidden error if the user is not an owner
    // Set provider as undefined so we avoid an infinite loop if this hook is
    // set on the resource we are requesting.
    const params = Object.assign({}, hook.params, { provider: undefined })

    return hook.service.get(hook.id, params).then(data => {
      // logger.info('running restrictAccessForGym...found some data....%o', data)

      return fetchUserGymIds(hook.app, hook.params.user.id, options.role).then(function (gymIds) {

        let gymIdParam = get(data, options.gymIdField);
        logger.info('%s - %s: Checking gym %s', hook.path, hook.method, gymIdParam)
        if (!gymIds.has(gymIdParam) ) {
          logger.info('Permission denied, gymIdParam is %s, gymIds is %o', gymIdParam, gymIds)
          throw new errors.Forbidden('You do not have the permissions to access this.')
        }

      })
    })
  }
}

module.exports = {
  restrictAccessForGym,
  restrictAccessForMember,
  restrictAccessForGymWorkers: function() { return restrictAccessForGym({role: ['STAFF', 'OWNER', 'ADMIN']})}
}
