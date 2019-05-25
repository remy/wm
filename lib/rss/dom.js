const Parser = require('rss-parser');
const cheerio = require('cheerio');

async function main(xml) {
  const rss = await new Parser().parseString(xml.toString());
  const dollar = cheerio.load(xml.toString());

  const url = rss.link;

  const base = {
    map: callback => {
      const res = rss.items.map((item, i) => {
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

    return dollar(element.content ? element.content : element);
  };

  return { base, $, url };
}

module.exports = main;
