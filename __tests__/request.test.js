const tap = require('tap');
const request = require('../lib/request');

tap.test('request a duff domain', t => {
  t.plan(1);
  const timeout = 2000;
  const now = Date.now();
  request('http://www.communitymx.com', timeout)
    .then(() => {
      t.fail('should not resolve');
    })
    .catch(e => {
      t.ok(Date.now() - now < timeout + 1000);
    });
});
