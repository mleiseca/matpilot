const assert = require('assert')
const app = require('../../src/app')

describe('\'UserGyms\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-gyms')

    assert.ok(service, 'Registered the service')
  })
})
