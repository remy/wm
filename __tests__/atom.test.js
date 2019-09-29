const tap = require('tap');
const fs = require('fs');
const read = f => fs.readFileSync(__dirname + f, 'utf8');
const parse = require('../lib/rss/dom');
const { links } = require('../lib/links');

tap.test('compile dom for atom', async t => {
  t.plan(1);

  const xml = read('/fixtures/summary.atom');
  links(await parse(xml, 10));
  t.pass('worked');
});
