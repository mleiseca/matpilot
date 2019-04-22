const assert = require('assert');
const app = require('../../src/app');

describe('\'UserGymRole\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-gym-role');

    assert.ok(service, 'Registered the service');
  });
});
