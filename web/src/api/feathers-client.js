import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

export const host = process.env.VUE_APP_API_HOST || 'https://www.matpilot.com'

const socket = io(host, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax : 5000,
  reconnectionAttempts: Infinity
})

const feathersClient = feathers()
  .configure(socketio(socket, {
    timeout: 5000
  }))
  .configure(auth({ storage: window.localStorage }))

export default feathersClient
