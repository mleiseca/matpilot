const { authenticate } = require('@feathersjs/authentication').hooks;
const assignCreatedBy = require('../../hooks/created-by')

// function rawFalse(context) {
//   if (!context.params.sequelize) context.params.sequelize = {}
//   Object.assign(context.params.sequelize, { raw: false })
// }

async function createUserGym(context) {
  // https://github.com/feathersjs-ecosystem/feathers-sequelize/issues/230
  // await context.result.addUser(parseInt(context.params.user.id, 10))

  const userGymRoleModel = context.app.services['user-gym-role'].Model

  userGymRoleModel.create({userId: parseInt(context.params.user.id, 10), gymId: context.result.id, role: 'OWNER'})
    .then((userGymRole) => {
      console.log(userGymRole.get({
        plain: true
      }))
    })
}

async function printParams(context) {
  console.log(context.params)

  // await sequelizeClient.query("SELECT 'gymId' FROM user_gyms WHERE 'userId' = $1",
  //   { bind: [parseInt(context.params.user.id, 10)], type: sequelizeClient.QueryTypes.SELECT }
  // ).then(gymIds => {
  //   console.log('Found these gymIds: ', gymIds)
  // })

  // const currUserId = context.params.user.id;
  // const userModel = context.app.services.users.Model
  //
  // // if (context.params.query.include) {
  //
  // console.log("USER MODEL", userModel)
  //
  //   context.params.sequelize = {
  //     include: [{
  //       model: userModel,
  //       through: {
  //         where: {'userId': currUserId}
  //       }}
  //     ]
  //   };
    // delete any special query params so they are not used
    // in the WHERE clause in the db query.
  //   delete context.params.query.include;
  // }


}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [printParams],
    get: [],
    create: [assignCreatedBy],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createUserGym],
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
