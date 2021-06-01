const path = require('path')
const tap = require('tap');
const sendWebmention = tap.mock('../lib/send/webmention', {
  'node-fetch': async () => ({ status: 200, text: async () => 'server response' })
})

tap.test('receive endpoint response data', async t => {
  t.plan(1);
  
  const reply = await sendWebmention({ source: '', target: '', endpoint: '' })
  t.equal(reply.response, 'server response')
  t.end()
})