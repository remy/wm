const resolve = require('url').resolve;

function main({ $, base, url = '' }) {
  let baseHref = $('base').attr('href') || url;

  return base
    .map((i, hEntry) => {
      const $$ = $(hEntry);

      const permalink = resolve(baseHref, $$.find('.u-url').attr('href') || '');

      console.log({ permalink, baseHref });

      const anchors = $$.find('a[href^="http"]')
        .map((i, el) => $(el).attr('href'))
        .get();

      // leaving <picture> for the time being
      const images = $$.find('img[src^="http"]')
        .map((i, el) => $(el).attr('src'))
        .get();

      const media = [];
      $$.find('video, audio').each((i, el) => {
        const sources = $(el).find('source');
        if (sources.length) {
          sources.each((i, el) => media.push($(el).attr('src')));
        } else {
          media.push($(el).attr('src'));
        }
      });

      return {
        permalink,
        links: []
          .concat(anchors, images, media)
          .filter(_ => _.startsWith('http')),
      };
    })
    .get();
}

module.exports = main;
