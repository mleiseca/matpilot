const assert = require('assert')
const app = require('../../src/app')

describe('\'scheduledEvents\' service', () => {
  it('registered the service', () => {
    const service = app.service('scheduled-events')

    assert.ok(service, 'Registered the service')
  })
})
