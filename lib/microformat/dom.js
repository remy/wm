const microformats = require('microformat-node');
const cheerio = require('cheerio');

async function dom(html, { url, limit }) {
  const mf = await microformats.getAsync({ html });

  let entries = mf.items.filter(_ => _.type.includes('h-entry'));
  if (limit) {
    entries = entries.slice(0, limit);
  }

  if (!url) {
    if (mf.rels.canonical) {
      url = mf.rels.canonical[0];
    } else if (entries[0].properties.url) {
      url = entries[0].properties.url[0];
    }
  }

  const base = {
    length: entries.length,
    map: callback => {
      const res = entries.map((item, i) => {
        item.link = item.properties.url ? item.properties.url[0] : url;
        return callback(i, item);
      });

      return {
        get: () => res,
      };
    },
  };

  const $ = element => {
    if (typeof element === 'string') {
      return {
        attr: () => null,
      };
    }

    if (element.properties) {
      // try encoded content first
      return cheerio.load(element.properties.content[0].html)(':root');
    }

    return cheerio.load(element)(':root');
  };

  return { base, $, url };
}

module.exports = dom;
