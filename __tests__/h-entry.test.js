const tap = require('tap');
const { findEntries } = require('../shared/lib/microformat/dom');

const fixture = {
  items: [
    {
      type: ['h-entry'],
      properties: {
        name: [
          'Indie Map is a public IndieWeb social graph and dataset.\n\n\n\n2300 sites, 5.7M pages, 380GB HTML with microformats2.\nSocial graph API and interactive map: 631M links, 706K relationships.\nSQL queryable dataset, stats, raw crawl data.\n\n\nLearn more ➜',
        ],
      },
    },
  ],
  rels: {
    stylesheet: ['style.css'],
  },
  'rel-urls': {
    'style.css': {
      type: 'text/css',
      rels: ['stylesheet'],
    },
  },
};

tap.test('empty h-entry', (t) => {
  const res = findEntries(fixture.items);

  t.equal(res.length, 0);
  t.end();
});
