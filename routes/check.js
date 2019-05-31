const parse = require('url').parse;
const qs = require('../lib/query-string');
const Webmention = require('../lib/webmention');
const send = require('../lib/send');
const db = require('../lib/db');

module.exports = async (req, res) => {
  let { url } = qs(req);

  if (!url) {
    return res.end('Bad request');
  }

  if (!url.startsWith('http')) {
    url = `http://${url}`;
  }

  console.log('>> ' + url);

  const last = new Date().toJSON();

  db.ref(`jobs/${parse(url).hostname.replace(/\./g, '-')}`).transaction(
    value => {
      if (!value) {
        return { count: 0, last };
      }
      return { count: value.count + 1, last };
    }
  );

  // get token and validate

  // if no token, then check if this url has been requested recently
  // and if so, return 429 - too many requests

  const wm = new Webmention();
  wm.on('error', e => {
    res.end(JSON.stringify({ error: true, message: e.message }));
  });

  wm.on('endpoints', urls => {
    if (req.method === 'post') {
      return Promise.all(urls.map(send)).then(reply => {
        res.end(JSON.stringify(reply));
      });
    }

    res.end(JSON.stringify(urls));
  });

  wm.fetch(url);
};
