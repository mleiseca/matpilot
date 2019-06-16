const { get, set, isUndefined } = require('lodash');
const errors = require('@feathersjs/errors');

const defaults = {
  idField: '_id',
  as: 'userId',
  expandPaths: true
};

function queryWithCurrentUser(options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'queryWithCurrentUser' hook should only be used as a 'before' hook.`);
    }

    options = Object.assign({}, defaults, hook.app.get('authentication'), options);
    const userEntity = hook.params[options.entity || 'user'];

    if (!userEntity) {
      if (!hook.params.provider) {
        return hook;
      }

      throw new Error('There is no current user to associate.');
    }

    const id = get(userEntity, options.idField);

    if (id === undefined) {
      throw new Error(`Current user is missing '${options.idField}' field.`);
    }

    if (options.expandPaths) {
      set(hook.params, `query.${options.as}`, id);
    } else {
      hook.params.query[options.as] = id;
    }
    return hook
  };
}


const restrictAccessForGymDefaults = {
  gymIdField: 'gymId',
  as: 'gymId'
};

function fetchUserGymIds(app, userId) {
  const userGymRoleModel = app.services['user-gym-role'].Model
  return userGymRoleModel.findAll({
    where: {
      userId: userId
    }
  }).then(function (gymRoles) {
    const gymIds = new Set();

    gymRoles.forEach(userGymRole => {
      gymIds.add(userGymRole.gymId)
    });

    return gymIds
  });
}

function addGymIdParameter(hook, options) {

  return fetchUserGymIds(hook.app, hook.params.user.id).then(function (gymIds) {

    let explicitGymId = get(hook.params.query, options.gymIdField)

    console.log("Found explicitGymId: ", explicitGymId)

    if (isUndefined(explicitGymId )) {
      set(hook.params, `query.${options.gymIdField}`, Array.from(gymIds));
    } else {
      explicitGymId = parseInt(explicitGymId, 10)
      if (!gymIds.has(explicitGymId)) {
        console.log("Permission denied, gymIds is", gymIds, "query wanted ", explicitGymId);
        throw new errors.Forbidden('You do not have the permissions to access this.');
      }
    }
    return hook
  })
}

function verifyGymIdParameter(hook, options) {
  return fetchUserGymIds(hook.app, hook.params.user.id).then(function (gymIds) {
    let explicitGymId = get(hook.data, options.gymIdField)

    // console.log("Found explicitGymId: ", explicitGymId, hook)
    explicitGymId = parseInt(explicitGymId, 10)
    if (!gymIds.has(explicitGymId)) {
      console.log("Permission denied, gymIds is", gymIds, "query wanted ", explicitGymId);
      throw new errors.Forbidden('You do not have the permissions to access this.');
    }
    return hook
  })
}

function restrictAccessForGym(options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'restrictAccessForGym' hook should only be used as a 'before' hook.`);
    }

    options = Object.assign({}, restrictAccessForGymDefaults, options);

    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }

    if (hook.method === 'create') {
      return verifyGymIdParameter(hook, options);
    }

    if (hook.method === 'find' || hook.id === null) {
      return addGymIdParameter(hook, options);
    }

    // Check hook is being called on an allowable method
    if (!(hook.method === 'get' || hook.method === 'update' || hook.method === 'patch' || hook.method === 'remove')) {
      throw new errors.MethodNotAllowed(`The 'restrictAccessForGym' hook should only be used on the 'get', 'update', 'patch' and 'remove' service methods...not ${hook.method}`);
    }

    // look up the document and throw a Forbidden error if the user is not an owner
    // Set provider as undefined so we avoid an infinite loop if this hook is
    // set on the resource we are requesting.
    const params = Object.assign({}, hook.params, { provider: undefined });

    return hook.service.get(hook.id, params).then(data => {
      console.log("running restrictAccessForGym...found some data....", data)

      return fetchUserGymIds(hook.app, hook.params.user.id).then(function (gymIds) {

        console.log("Checking GYMID: ", get(data, options.gymIdField))
        if (!gymIds.has(get(data, options.gymIdField)) ) {
          console.log("Permission denied, gymIds is", gymIds);
          throw new errors.Forbidden('You do not have the permissions to access this.');
        }

      });
    });
  };
}


// return hook.service.get(hook.id, hook.params).then(data => {
//
//   console.log(hook)
//
//   if (hook.method === 'find' || hook.id === null) {
//     return queryWithCurrentUser({
//       idField: options.idField,
//       as: options.ownerField,
//       expandPaths: options.expandPaths
//     })(hook);
//   }
//   console.log(data)
//
//   return hook
//   // if (data.toJSON) {
//   //   data = data.toJSON();
//   // } else if (data.toObject) {
//   //   data = data.toObject();
//   // }
//   //
//   // let field = get(data, options.ownerField);
//   //
//   // // Handle nested Sequelize or Mongoose models
//   // if (isPlainObject(field)) {
//   //   field = field[options.idField];
//   // }
//   //
//   // if (Array.isArray(field)) {
//   //   const fieldArray = field.map(idValue => idValue.toString());
//   //   if (fieldArray.length === 0 || fieldArray.indexOf(id.toString()) < 0) {
//   //     throw new errors.Forbidden('You do not have the permissions to access this.');
//   //   }
//   // } else if (field === undefined || field.toString() !== id.toString()) {
//   //   throw new errors.Forbidden('You do not have the permissions to access this.');
//   // }
//   //
//   // return hook;
// });

module.exports = {
  restrictAccessForGym,
  queryWithCurrentUser
};
