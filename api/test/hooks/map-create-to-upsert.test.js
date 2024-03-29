const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const mapCreateToUpsert = require('../../src/hooks/map-create-to-upsert') /* eslint-disable-line */

describe('\'map-create-to-upsert\' hook', () => {
  let app

  beforeEach(() => {
    app = feathers()

    app.use('/dummy', {
      async get(id) {
        return { id }
      }
    })

    app.service('dummy').hooks({

    })
  })

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test')

    assert.deepEqual(result, { id: 'test' })
  })
})
