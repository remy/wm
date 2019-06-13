const tap = require('tap');
const fs = require('fs');
const read = f => fs.readFileSync(__dirname + f, 'utf8');
const { findEndpoints } = require('../lib/endpoint');

tap.test('atom', t => {
  const source = read('/fixtures/pingback-first.html');

  const endpoint = findEndpoints(source, 'https://www.w3.org/TR/websub/');
  t.equal(endpoint.type, 'webmention');
  t.end();
});
