const assert = require('assert')
const app = require('../../src/app')

describe('\'member-rank-history\' service', () => {
  it('registered the service', () => {
    const service = app.service('member-rank-history')

    assert.ok(service, 'Registered the service')
  })
})
