const microformats = require('microformat-node');
const cheerio = require('cheerio');

function findEntries(mf) {
  if (Array.isArray(mf)) {
    return mf.reduce((acc, curr) => {
      const found = findEntries(curr);
      if (Array.isArray(found)) {
        acc.push(...found);
      } else if (found) {
        acc.push(found);
      }

      return acc;
    }, []);
  }

  if (mf.type.includes('h-entry')) {
    if (mf.value) {
      return mf;
    }
    if (mf.properties && mf.properties.content) {
      return mf;
    }

    return null;
  }

  if (mf.children) {
    return findEntries(mf.children);
  }
}

async function dom(html, { url, limit }) {
  const mf = await microformats.getAsync({ html, filter: ['h-entry'] });

  let entries = findEntries(mf.items);

  if (limit) {
    entries = entries.slice(0, limit);
  }

  if (!url) {
    if (mf.rels.canonical) {
      url = mf.rels.canonical[0];
    } else if (entries.length && entries[0].properties.url) {
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
    extraLinks: () => {
      const res = [];

      const types = [
        'in-reply-to',
        'like-of',
        'repost-of',
        'bookmark-of',
        'mention-of',
        'rsvp',
      ];

      types.forEach(type => {
        if (!Array.isArray(entries[0].properties[type])) {
          return;
        }

        const urls = entries[0].properties[type].map(value => {
          if (typeof value === 'string') {
            return value;
          }

          if (value.properties.url) {
            return value.properties.url[0];
          }
        });

        res.push(...urls);
      });

      if (entries[0].properties.url) {
        res.push(...entries[0].properties.url);
      }
      return res;
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
      const content = element.properties.content
        ? element.properties.content[0].html
        : element.value;

      // wrapping in a div ensures there's a selectable dom
      return cheerio.load(`<div>${content}</div>`)(':root');
    }

    return cheerio.load(element)(':root');
  };

  return { base, $, url };
}

module.exports = dom;
module.exports.findEntries = findEntries;
