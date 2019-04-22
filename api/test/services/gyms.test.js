const assert = require('assert');
const app = require('../../src/app');

describe('\'gyms\' service', () => {
  it('registered the service', () => {
    const service = app.service('gyms');

    assert.ok(service, 'Registered the service');
  });
});
