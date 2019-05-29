const request = require('./request');
const dom = require('./html/dom');
const smellsLikeRSS = require('./rss/is');
const rss = require('./rss/dom');
const resolve = require('url').resolve;

function links({ $, base, url = '' }) {
  let baseHref = $('base').attr('href') || url;

  return base
    .map((i, element) => {
      const $$ = $(element);

      const permalink = resolve(
        baseHref,
        element.link || $$.find('.u-url').attr('href') || ''
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

      // return permalink and links - that start with http, hash striped and unique
      return {
        permalink,
        links: []
          .concat(anchors, images, media)
          .filter(_ => _.startsWith('http'))
          .map(_ => _.replace(/#.*$/, ''))
          .reduce(
            (acc, curr) => (!acc.includes(curr) ? [...acc, curr] : acc),
            []
          ),
      };
    })
    .get();
}

function getLinksFromHTML({ html, url }) {
  return links({ ...dom(html), url });
}

async function getLinksFromFeed({ xml, limit }) {
  const res = await rss(xml, limit);

  return links({ ...res, rss: true });
}

function getFromContent(content, url, limit) {
  if (smellsLikeRSS(content)) {
    return getLinksFromFeed({ xml: content, limit });
  }

  // else: html
  return getLinksFromHTML({ html: content, url });
}

async function get(url, limit) {
  const content = await request(url);
  return getFromContent(content, url, limit);
}

module.exports = {
  links,
  getFromContent,
  getLinksFromHTML,
  get,
};
