const qs = require('../lib/query-string');
const Webmention = require('../lib/webmention');
const sendMention = require('../lib/send');
const db = require('../lib/db');
const ms = require('ms');
const parse = require('url').parse;

const rateWindow = 1000 * 60; // * 60 * 4; // 4 hours

module.exports = async (req, res) => {
  let { url, token, limit } = qs(req);
  const method = req.method.toLowerCase();

  const now = new Date();

  // Server-Timing: miss, db;dur=53, app;dur=47.2 (ms)
  const timings = {
    db: 0,
    webmention: 0,
    send: 0,
  };

  if (!url) {
    res.writeHead(412);
    return res.end(
      JSON.stringify({
        error: true,
        message: 'A valid URL is required to test against.',
      })
    );
  }

  if (!url.startsWith('http')) {
    url = `http://${url}`;
  }

  // ensure the url is properly encoded
  url = parse(url).href;

  const { origin = '', referer = '' } = req.headers;

  if (
    origin.includes('localhost') ||
    referer.includes('webmention.app') ||
    referer.includes('wm.rem.now.sh')
  ) {
    // note that this token is rotated on a random basis, if you want to pinch
    // it, you can, but don't trust it'll continue to work.
    if (!token) token = '089edc08-9677-48fd-947c-06f9e2d90148-site';
  }

  const validToken = token ? await db.updateTokenRequestCount(token) : null;

  if (!validToken) {
    // only allow one hit a day
    const data = await db.getRequestCount(url);

    if (data) {
      const delta =
        now.getTime() - rateWindow - new Date(data.lastRequested).getTime();

      if (delta < 0) {
        res.writeHead(429);
        return res.end(
          JSON.stringify({
            error: true,
            message: `Too many requests in time window. Try again in ${ms(
              delta * -1,
              { long: true }
            )}, or use a free token for no rate limits: https://webmention.app/token`,
          })
        );
      }
    }
  }

  const dbUpdate = db
    .updateRequestCount(url)
    .then(() => {
      timings.db = Date.now() - now.getTime();
    })
    .catch(e => console.log(e));

  const send = data => {
    dbUpdate
      .then(() => {
        res.setHeader(
          'Server-Timing',
          Object.keys(timings).map(key => {
            return `${key};dur=${timings[key].toFixed(2)}`;
          })
        );
        res.end(data);
      })
      .catch(e => {
        res.end({ error: true, message: e.message });
      });
  };

  console.log('>> %s %s', method === 'post' ? 'SEND' : 'QUERY', url);

  const wm = new Webmention({ limit });
  wm.on('error', e => {
    send(JSON.stringify({ error: true, message: e.message }));
  });

  wm.on('endpoints', urls => {
    timings.webmention = Date.now() - now.getTime();

    if (method === 'post') {
      return Promise.all(urls.map(sendMention)).then(reply => {
        if (reply.length)
          db.updateRequestCount(
            '__sent',
            reply.filter(_ => _.status < 400).length
          ).catch(E => console.log('error updating __sent count', E));
        timings.send = Date.now() - now.getTime();
        send(JSON.stringify({ urls: reply }));
      });
    }

    if (urls.length === 0 && wm.mentions.length > 0) {
      return send(
        JSON.stringify({
          error: true,
          message: `No webmention endpoints found in the ${
            wm.mentions.length
          } content ${wm.mentions.length === 1 ? 'entry' : 'entries'}`,
        })
      );
    }

    send(JSON.stringify({ urls }));
  });

  wm.fetch(url);
};
