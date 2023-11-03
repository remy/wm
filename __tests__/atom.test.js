const tap = require('tap');
const fs = require('fs');
const read = (f) => fs.readFileSync(__dirname + f, 'utf8');
const parse = require('../shared/lib/rss/dom');
const { links } = require('../shared/lib/links');

tap.test('compile dom for atom', async (t) => {
  t.plan(1);

  const xml = read('/fixtures/summary.atom');
  links(await parse(xml, 10));
  t.pass('worked');
});

tap.test('detected escaped links in atom', async (t) => {
  t.plan(2);

  const xml = read('/fixtures/summary.atom');
  const dom = await parse(xml, 10);

  const [res] = links(dom);
  t.same(res.links.length, 1, 'finds example.com');
  t.same(res.links[0], 'https://example.com/marker', 'finds example.com');
});
