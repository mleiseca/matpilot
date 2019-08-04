import io from 'socket.io-client'
import { EventBus } from './../event-bus.js'

export const host = process.env.VUE_APP_API_HOST || 'https://www.matpilot.com'

const socket = io(host, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
})

socket.on('connect', () => {
  EventBus.$emit('socket-status', { disconnected: socket.disconnected })
})

socket.on('disconnect', () => {
  EventBus.$emit('socket-status', { disconnected: socket.disconnected })
})

export default socket
