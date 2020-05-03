const request = require('./request');
const dom = require('./html/dom');
const smellsLikeRSS = require('./rss/is');
const rss = require('./rss/dom');
const resolve = require('url').resolve;
const parse = require('url').parse;

module.exports.links = function links({ $, base, url = '' }) {
  let baseHref = $('base, link[rel~="canonical"]').attr('href') || url;
  const hostname = parse(baseHref).hostname;

  return base
    .map((i, element) => {
      const $$ = $(element);

      let permalink = resolve(
        baseHref,
        $$.find('.u-url').attr('href') || element.link || ''
      );

      if (!permalink.includes(hostname) && base.length === 1) {
        // it's probably bad, so let's reset it
        permalink = baseHref;
      }

      const anchors = $$.find('a[href^="http:"], a[href^="https:"]')
        .map((i, el) => $(el).attr('href'))
        .get();

      try {
        // extraLinks can sometimes return structured microformats, so make
        // sure to flatten that into an array of strings
        let more = base.extraLinks().map(_ => {
          if (typeof _ === 'string') {
            return _;
          }

          if (_.value) {
            return _.value;
          }

          if (_.properties) {
            return _.properties.urls[0];
          }
        });

        anchors.push(...more);
      } catch (e) {
        // noop
      }

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

      // note: fragment identifiers on the URL are considered part of the target
      // that should be sent.
      return {
        permalink,
        links: []
          .concat(anchors, images, media)
          .filter(url => url.startsWith('http'))
          .filter(url => url !== permalink)
          .filter((curr, i, self) => self.indexOf(curr) === i), // unique
      };
    })
    .get();
};

module.exports.getLinksFromHTML = function getLinksFromHTML({ html, url }) {
  return links({ ...dom(html), url });
};

async function getLinksFromFeed({ xml, limit }) {
  const res = await rss(xml, limit);

  return links({ ...res, rss: true });
}

module.exports.getFromContent = function getFromContent(content, url, limit) {
  if (smellsLikeRSS(content)) {
    return getLinksFromFeed({ xml: content, limit });
  }

  // else: html
  return getLinksFromHTML({ html: content, url });
};

module.exports.get = async function get(url, limit) {
  const content = await request(url);
  return getFromContent(content, url, limit);
};
