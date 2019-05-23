const cheerio = require('cheerio');

function main(html) {
  const base = cheerio.load(html.toString());

  // FIXME: this doesn't handle multiple entries
  let $ = base('.h-entry');

  if ($.length === 0) {
    $ = base;
  } else {
    $ = $.find.bind($);
  }

  return $;
}

module.exports = main;
