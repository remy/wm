const tap = require('tap');
const fs = require('fs');
const Webmention = require('../shared/lib/webmention');
const read = (f) => fs.readFileSync(__dirname + f, 'utf8');

tap.test('atom', (t) => {
  t.plan(1);
  const wm = new Webmention({ limit: 2 });
  wm.on('end', () => {
    t.not(wm.mentions.length, 0);
    t.end();
  });
  wm.load(read('/fixtures/simon-links-atom.xml'));
});

tap.test('xml', (t) => {
  t.plan(1);
  const wm = new Webmention({ limit: 2 });
  wm.on('end', () => {
    t.not(wm.mentions.length, 0);
    t.end();
  });
  wm.load(read('/fixtures/fsis.xml'));
});

// tap.test('local html', t => {
//   t.plan(2);
//   const wm = new Webmention();
//   wm.on('end', () => {
//     const found = wm.endpoints.find(_ => _.source.includes('remysharp'));
//     if (!found) {
//       t.fail('endpoints missing');
//       console.warn(wm.mentions);
//     } else {
//       t.equal(found.endpoint.type, 'pingback');
//       t.equal(found.endpoint.url, 'https://rems.life/xmlrpc.php');
//     }
//     t.end();
//   });
//   wm.load(read('/fixtures/but.html'));
// });

tap.test('local rss', (t) => {
  t.plan(3);
  const wm = new Webmention();
  wm.on('end', () => {
    t.equal(wm.mentions.length, 10);
    const found = wm.endpoints.find((_) =>
      _.target.includes('paulrobertlloyd')
    );
    t.equal(found.endpoint.type, 'webmention');
    t.equal(
      found.endpoint.url,
      'https://webmention.io/paulrobertlloyd.com/webmention'
    );

    t.end();
  });
  wm.load(read('/fixtures/jeremy.xml'));
});

// tap.test('local non-h-entry', t => {
//   t.plan(1);
//   const wm = new Webmention();
//   wm.on('endpoints', e => {
//     t.equal(e.length, 2);
//     t.end();
//   });
//   wm.load(read('/fixtures/alt-but.html'));
// });

tap.test('local h-feed nested', (t) => {
  t.plan(1);
  const wm = new Webmention();
  wm.on('endpoints', (endpoints) => {
    t.equal(endpoints.length, 10);
    t.end();
  });
  wm.load(read('/fixtures/snarfed.html'));
});
