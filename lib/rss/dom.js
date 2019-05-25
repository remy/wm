const Parser = require('rss-parser');
const cheerio = require('cheerio');

async function main(xml) {
  const rss = await new Parser().parseString(xml.toString());
  const dollar = cheerio.load(xml.toString());

  const url = rss.link;

  const base = {
    map: callback => {
      const res = rss.items.slice(0, 10).map((item, i) => {
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

    if (element.content) {
      // try encoded content first
      return dollar(element['content:encoded'] || element.content);
    }

    return dollar(element);
  };

  return { base, $, url };
}

module.exports = main;
