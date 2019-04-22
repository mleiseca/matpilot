const assert = require('assert');
const app = require('../../src/app');

describe('\'eventMemberAttendance\' service', () => {
  it('registered the service', () => {
    const service = app.service('event-member-attendance');

    assert.ok(service, 'Registered the service');
  });
});
