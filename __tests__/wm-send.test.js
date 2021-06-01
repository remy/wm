const fs = require('fs')
const path = require('path')
const tap = require('tap');
const read = f => fs.readFileSync(__dirname + f, 'utf8');
const Webmention = tap.mock('../lib/webmention', {
  'node-fetch': async () => ({ status: 200, text: async () => 'server response' })
})

tap.test('endpoint response data', t => {
  t.plan(1);
  const wm = new Webmention({ send: true });
  wm.on('sent', reply => {
    t.equal(reply.response, 'server response')
    t.end()
  });
  wm.load(read('/fixtures/adactio-link.html'));
});
