const tap = require('tap');
const fs = require('fs');
const Webmention = require('../lib/webmention');

tap.test('atom', t => {
  t.plan(1);
  const wm = new Webmention({ limit: 2 });
  wm.on('end', () => {
    t.ok(wm.mentions.length);

    t.end();
  });
  wm.load(fs.readFileSync(__dirname + '/fixtures/simon-all-atom.xml', 'utf8'));
});

tap.test('local html', t => {
  t.plan(2);
  const wm = new Webmention();
  wm.on('end', () => {
    const found = wm.endpoints.find(_ => _.source.includes('remysharp'));
    if (!found) {
      t.fail('endpoints missing');
      console.warn(wm.mentions);
    } else {
      t.equal(found.endpoint.type, 'pingback');
      t.equal(found.endpoint.url, 'https://rems.life/xmlrpc.php');
    }
    t.end();
  });
  wm.load(fs.readFileSync(__dirname + '/fixtures/but.html', 'utf8'));
});

tap.skip('local rss', t => {
  t.plan(3);
  const wm = new Webmention();
  wm.on('end', () => {
    t.equal(wm.mentions.length, 10);
    const found = wm.endpoints.find(_ => _.source.includes('paulrobertlloyd'));
    t.equal(found.endpoint.type, 'webmention');
    t.equal(
      found.endpoint.url,
      'https://webmention.io/paulrobertlloyd.com/webmention'
    );

    t.end();
  });
  wm.load(fs.readFileSync(__dirname + '/fixtures/jeremy.xml', 'utf8'));
});

tap.skip('local non-h-entry', t => {
  t.plan(1);
  const wm = new Webmention();
  wm.on('end', () => {
    console.warn(wm.mentions);

    t.equal(wm.mentions.length, 10);

    t.end();
  });
  wm.load(__dirname + '/fixtures/alt-but.html');
});
