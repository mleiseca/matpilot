import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '../api/feathers-client'
import modules from './modules'

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, { idField: 'id' })

Vue.use(Vuex)
Vue.use(FeathersVuex)

// TODO: remove
Vue.config.devtools = true

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    service('gyms'),
    service('members'),
    service('events'),
    service('event-member-attendance'),
    service('scheduled-events'),
    service('users'),
    service('user-gym-role'),
    service('authManagement'),

    // // Specify custom options per service
    // service('/v1/tasks', {
    //   idField: '_id', // The field in each record that will contain the id
    //   nameStyle: 'path', // Use the full service path as the Vuex module name, instead of just the last section
    //   namespace: 'custom-namespace', // Customize the Vuex module name.  Overrides nameStyle.
    //   autoRemove: true, // Automatically remove records missing from responses (only use with feathers-rest)
    //   enableEvents: false, // Turn off socket event listeners. It's true by default
    //   addOnUpsert: true, // Add new records pushed by 'updated/patched' socketio events into store, instead of discarding them. It's false by default
    //   skipRequestIfExists: true, // For get action, if the record already exists in store, skip the remote request. It's false by default
    //   modelName: 'OldTask' // Default modelName would have been 'Task'
    // })
    //
    // // Add custom state, getters, mutations, or actions, if needed.  See example in another section, below.
    // service('things', {
    //   state: {},
    //   getters: {},
    //   mutations: {},
    //   actions: {}
    // })
    //
    // // Setup a service with defaults for Model instances
    // service('manufacturers', {
    //   instanceDefaults: {
    //     name: ''
    //   }
    // })
    // // Setup a service with light-weight relational data
    // service('models', {
    //   instanceDefaults: {
    //     name: '',
    //     manufacturerId: '',
    //     manufacturer: 'Manufacturer' // Refers to data (populated on the server) that gets put in the `manufacturers` vuex store.
    //   }
    // })

    // Setup the auth plugin.
    auth({ userService: 'users' })
  ],
  modules
})
