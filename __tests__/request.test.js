const tap = require('tap');
const request = require('../lib/request');

tap.test('request a slow domain', t => {
  t.plan(2);
  const timeout = 2000;
  const now = Date.now();
  request('https://httpstat.us/200?sleep=5000', timeout)
    .then(() => {
      t.fail('should not resolve');
    })
    .catch(e => {
      const duration = Date.now() - now;
      t.ok(duration > timeout);
      t.ok(duration < timeout + 1000);
    });
});
