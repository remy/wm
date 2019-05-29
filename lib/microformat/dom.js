const microformats = require('microformat-node');
const cheerio = require('cheerio');

async function dom(html, { url, limit }) {
  const mf = await microformats.getAsync({ html });

  const entries = mf.items
    .filter(_ => _.type.includes('h-entry'))
    .slice(0, limit);

  const base = {
    length: entries.length,
    map: callback => {
      const res = entries.map((item, i) => {
        item.link = item.url ? item.url[0] : url;
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
