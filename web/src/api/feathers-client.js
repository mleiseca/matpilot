import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import socket from './socket'

const feathersClient = feathers()
  .configure(socketio(socket, {
    timeout: 30000
  }))
  .configure(auth({ storage: window.localStorage }))

export default feathersClient
