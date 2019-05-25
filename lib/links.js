const request = require('./request');
const dom = require('./html/dom');
const smellsLikeRSS = require('./rss/is');
const rss = require('./rss/dom');
const resolve = require('url').resolve;

function links({ $, base, url = '', rss = false }) {
  let baseHref = $('base').attr('href') || url;

  console.log({ rss, url });

  return base
    .map((i, element) => {
      const $$ = $(element);

      const permalink = resolve(
        baseHref,
        (rss ? element.link : $$.find('.u-url').attr('href')) || ''
      );

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

function getLinksFromHTML({ html, url }) {
  return links({ ...dom(html), url });
}

async function getLinksFromFeed({ xml }) {
  const res = await rss(xml);

  return links({ ...res, rss: true });
}

async function get(url) {
  const content = await request(url);

  if (smellsLikeRSS(content)) {
    return getLinksFromFeed({ xml: content, url });
  }

  // else: html
  return getLinksFromHTML({ html: content, url });
}

module.exports = {
  getLinksFromHTML,
  get,
};
