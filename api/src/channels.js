const lookupUserGyms = require('./services/users/lookupUserMemberGyms')

module.exports = function(app) {
  if(typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return
  }

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult, { connection }) => {


    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if(connection) {
      // Obtain the logged in user from the connection
      const user = connection.user

      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection)

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection)

      // Subscribe to gyms where I am admin/staff
      const userGymRoleModel = app.services['user-gym-role'].Model

      userGymRoleModel.findAll({
        where: {
          userId: user.id
        }
      }).then(function(gymRoles) {
        // console.log(gymRoles)
        gymRoles.forEach(userGymRole => {
          app.channel(`gyms/${userGymRole.gymId}`).join(connection)
        })
      })

      // Subscribe to gyms where I am member
      lookupUserGyms(app.get('sequelizeClient'), user).then(function(membersGroupedByGym) {
        membersGroupedByGym.forEach(memberList => {
          app.channel(`gyms/${memberList.gymId}`).join(connection)
        })
      })

      // Get updates about this user
      app.channel(`/users/${user.id}`).join(connection)


      // Channels can be named anything and joined on any condition

      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms
      // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(channel));

      // Easily organize users by email and userid for things like messaging
      // app.channel(`emails/${user.email}`).join(channel);
      // app.channel(`userIds/$(user.id}`).join(channel);
    }
  })

  // eslint-disable-next-line no-unused-vars
  // app.publish((data, hook) => {
  //   // Here you can add event publishers to channels set up in `channels.js`
  //   // To publish only for a specific event use `app.publish(eventname, () => {})`
  //
  //   console.log('Publishing all events to all authenticated users. See `channels.js` and https://docs.feathersjs.com/api/channels.html for more information.'); // eslint-disable-line
  //
  //   // e.g. to publish all service events to all authenticated users use
  //   return app.channel('authenticated');
  // });


  // TODO: maybe 'user-gym-role', members, member-rank-history, 'event-member-attendance', should only be for admin users?
  const servicesWithGymId = ['event-member-attendance', 'event-member-registration', 'events', 'gyms', 'members', 'member-rank-history', 'scheduled-events', 'user-gym-role', 'gym-waivers']

  servicesWithGymId.forEach(function(service) {
    app.service(service).publish((data) => {
      // TODO - there should be admin vs non-admin channels here - otherwise we are sending a bunch of stuff to anyone at the gym
      return app.channel(`gyms/${data.gymId}`)
    })
  })

  // User needs updates when their things change. Maybe just every service with a user id?
  // users
  // user-gym-role
  // associated members ??!!
  app.service('users').publish((user) => app.channel(`/users/${user.id}`))

  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));

  // With the userid and email organization from above you can easily select involved users

  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // });
}
