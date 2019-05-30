const Parser = require('rss-parser');
const cheerio = require('cheerio');

async function main(xml, limit = 10) {
  xml = xml.toString();
  const rss = await new Parser({
    customFields: {
      item: ['summary'],
    },
  }).parseString(xml);
  const dollar = cheerio.load(xml);

  const url = rss.link;

  let items = rss.items;
  if (limit) {
    items = items.slice(0, limit);
  }

  const base = {
    map: callback => {
      const res = items.map((item, i) => {
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

    if (element.summary) {
      return dollar(element.summary._);
    }

    if (element.content) {
      // try encoded content first
      return dollar(element['content:encoded'] || element.content);
    }

    return dollar(element);
  };

  return { base, $, url, rss: { items } };
}

module.exports = main;
