const pingback = require('../shared/lib/send/pingback');
const tap = require('tap');

tap.test('pingback', (t) => {
  const endpoint = 'https://bavatuesdays.com/xmlrpc.php';
  const source = 'https://remy.jsbin.me/icy-feather-c76/';
  const target = 'https://bavatuesdays.com/hello-world/';
  return pingback({ source, target, endpoint })
    .then(() => {
      t.pass('worked');
    })
    .catch((e) => {
      t.failed(e);
    });
});
