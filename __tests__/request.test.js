const tap = require('tap');
const request = require('../lib/request');

tap.test('request a duff domain', (t) => {
  t.plan(1);
  const timeout = 2000;
  const now = Date.now();
  request('http://www.this_url_should_not_resolve.com', timeout)
    .then(() => {
      t.fail('should not resolve');
    })
    .catch(() => {
      t.ok(Date.now() - now < timeout + 1000);
    });
});
