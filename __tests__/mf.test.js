const tap = require('tap');
const fs = require('fs');
const Webmention = require('../lib/webmention');
const read = f => fs.readFileSync(__dirname + f, 'utf8');

tap.test('microformat', t => {
  t.plan(2);
  const wm = new Webmention();
  wm.on('endpoints', endpoints => {
    t.ok(endpoints[0].source.includes('adactio.com'));
    t.ok(endpoints[0].target.includes('remysharp.com'));
    t.end();
  });
  wm.load(read('/fixtures/adactio-link.html'));
});

tap.test('microformat missing', t => {
  t.plan(1);
  const wm = new Webmention();
  wm.on('endpoints', endpoints => {
    t.equal(endpoints.length, 3);
    t.end();
  });
  wm.load(read('/fixtures/mf-missing.html'));
});

tap.test('check for links', t => {
  t.plan(1);
  const wm = new Webmention();
  wm.on('endpoints', endpoints => {
    t.equal(endpoints.length, 4);
    t.end();
  });
  wm.load(read('/fixtures/all-links.html'));
});