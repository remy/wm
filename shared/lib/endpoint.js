// @ts-check
const { http, https } = require('follow-redirects');
const li = require('li');
const cheerio = require('cheerio');
const url = require('url');

const cache = new Map();

/**
 * @param {string} source
 * @returns {Promise<WebMention>}
 */
const main = (source) =>
  new Promise((resolve, reject) => {
    if (cache.has(source)) {
      return resolve({ source, endpoint: cache.get(source) });
    }
    getWebmentionUrl(source, (err, endpoint) => {
      if (err) {
        return reject(err);
      }

      cache.set(source, endpoint || null);
      resolve({ source, endpoint });
    });
  });

/**
 *
 * @param {string} html
 * @param {string} baseUrl
 * @returns {{url: string, type: string} | undefined}
 */
function findEndpoints(html, baseUrl) {
  const $ = cheerio.load(html);

  const res = $('link, a')
    .map(function (idx, el) {
      const rels = (el.attribs.rel || '').split(' ').filter(Boolean);

      if (
        (rels.includes('webmention') || rels.includes('pingback')) &&
        // We explicitly check for undefined because we want to catch empty strings, but those are falsy
        typeof el.attribs.href !== 'undefined'
      ) {
        return {
          url: url.resolve(baseUrl, el.attribs.href),
          type: rels.includes('webmention') ? 'webmention' : 'pingback',
        };
      }

      return null;
    })
    .get()
    .filter(Boolean);

  const webmention = res.find((_) => _.type === 'webmention');
  return webmention || res[0];
}

module.exports = main;

module.exports.findEndpoints = findEndpoints;

/**
 *
 * @param {object|string} opts
 * @param {EndpointCallback} callback
 */
function getWebmentionUrl(opts, realCallback) {
  var parsed;
  if (typeof opts === 'string') {
    parsed = url.parse(opts);
  } else if (opts.url) {
    parsed = url.parse(opts.url);
  } else {
    parsed = opts;
  }

  parsed.headers = {
    'user-agent': 'webmention.app',
  };

  parsed.timeout = 5 * 1000;

  const client = parsed.protocol === 'http:' ? http : https;

  let complete = false;
  const callback = (err, res) => {
    if (complete) return;
    complete = true;
    realCallback(err, res);
  };

  const req = client.request(parsed, function (res) {
    if (res.statusCode < 200 || res.statusCode >= 400) {
      callback();
    }

    if (res.headers['x-pingback']) {
      callback(undefined, { url: res.headers['x-pingback'], type: 'pingback' });
    }

    if (res.headers.link) {
      const links = li.parse(res.headers.link);
      const endpoint = links.webmention || links['http://webmention.org/'];

      if (endpoint) {
        callback(undefined, {
          url: url.resolve(res.responseUrl, endpoint),
          type: 'webmention',
        });
      }
    }

    // don't try to parse non-text (i.e. mp3s!)
    if (
      !res.headers['content-type'] ||
      !res.headers['content-type'].startsWith('text/')
    ) {
      callback();
    }
    var buf = '';

    res.on('data', (chunk) => (buf += chunk.toString()));
    res.on('end', () => {
      callback(null, findEndpoints(buf.toString(), res.responseUrl));
    });
  });

  req.on('error', callback);

  req.on('timeout', () => {
    req.abort();
    callback(new Error(`Timeout`));
  });

  req.end();
}
