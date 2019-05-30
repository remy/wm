const cheerio = require('cheerio');

function main(html) {
  const $ = cheerio.load(html.toString());

  let base = $('.h-entry, .hentry');

  if (base.length === 0) {
    base = $('html');
  }

  return { base, $ };
}

module.exports = main;
