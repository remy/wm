const tap = require('tap');
const fs = require('fs');
const read = (f) => fs.readFileSync(__dirname + f, 'utf8');
const endpoint = require('../shared/lib/endpoint');

tap.test('atom', (t) => {
  const source = read('/fixtures/pingback-first.html');

  const res = endpoint.findEndpoints(source, 'https://www.w3.org/TR/websub/');
  t.equal(res.type, 'webmention');
  t.end();
});

tap.test('endpoint main', async (t) => {
  const res = await endpoint({ url: 'https://remysharp.com/' });

  t.equal(res.endpoint.type, 'webmention');
  t.end();
});
