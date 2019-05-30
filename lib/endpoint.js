// const lookup = require('get-webmention-url');
const { http, https } = require('follow-redirects');
const li = require('li');
const cheerio = require('cheerio');
const url = require('url');
const version = require('../package.json').version;

const cache = new Map();

const main = async source =>
  new Promise((resolve, reject) => {
    if (cache.has(source)) {
      return resolve({ source, endpoint: cache.get(source) });
    }
    getWebmentionUrl(source, (err, endpoint) => {
      cache.set(source, endpoint || null);
      if (err) return reject(err);
      resolve({ source, endpoint });
    });
  });

module.exports = main;

function getWebmentionUrl(opts, callback) {
  var parsed;
  if (typeof opts === 'string') {
    parsed = url.parse(opts);
  } else if (opts.url) {
    parsed = url.parse(opts.url);
  } else {
    parsed = opts;
  }

  parsed.headers = {
    'user-agent': 'webmention.app@' + version,
  };

  var client = parsed.protocol === 'http:' ? http : https;

  var req = client.get(parsed, function(res) {
    if (res.statusCode < 200 || res.statusCode >= 400) {
      callback();
      return;
    }

    if (res.headers['x-pingback']) {
      callback(undefined, { url: res.headers['x-pingback'], type: 'pingback' });
      return;
    }

    if (res.headers.link) {
      const links = li.parse(res.headers.link);
      const endpoint = links.webmention || links['http://webmention.org/'];

      if (endpoint) {
        callback(undefined, {
          url: url.resolve(res.responseUrl, endpoint),
          type: 'webmention',
        });
        return;
      }
    }

    var callbackFired = false;
    var buf = '';

    res.on('data', chunk => (buf += chunk));
    res.on('end', () => {
      var $ = cheerio.load(buf.toString());

      $('link, a').each(function(idx, el) {
        const rels = (el.attribs.rel || '').split(' ').filter(Boolean);

        if (
          (rels.includes('webmention') || rels.includes('pingback')) &&
          // We explicitly check for undefined because we want to catch empty strings, but those are falsy
          typeof el.attribs.href !== 'undefined' &&
          !callbackFired
        ) {
          callbackFired = true;
          callback(undefined, {
            url: url.resolve(res.responseUrl, el.attribs.href),
            type: rels.includes('webmention') ? 'webmention' : 'pingback',
          });
          return;
        }
      });

      if (!callbackFired) callback();
    });
  });

  req.on('error', callback);
}
