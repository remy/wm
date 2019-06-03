const qs = require('../lib/query-string');
const Webmention = require('../lib/webmention');
const sendMention = require('../lib/send');
const db = require('../lib/db');
const ms = require('ms');

const rateWindow = 1000 * 60 * 60 * 4; // 4 hours

module.exports = async (req, res) => {
  let { url, token } = qs(req);

  const now = new Date();

  // Server-Timing: miss, db;dur=53, app;dur=47.2 (ms)
  const timings = {
    db: 0,
    webmention: 0,
    send: 0,
  };

  if (!url) {
    return res.end('Bad request');
  }

  if (!url.startsWith('http')) {
    url = `http://${url}`;
  }

  const validToken = token ? await db.updateTokenRequestCount(token) : null;

  if (!validToken) {
    // only allow one hit a day
    const data = await db.getRequestCount(url);

    const delta =
      now.getTime() - rateWindow - new Date(data.lastRequested).getTime();

    if (delta < 0) {
      res.writeHead(429);
      return res.end(
        JSON.stringify({
          error: 'Too many requests',
          message: `Too many requests in time window. Try again in ${ms(
            delta * -1,
            { long: true }
          )}.`,
        })
      );
    }
  }

  const dbUpdate = db
    .updateRequestCount(url)
    .then(() => {
      console.log('db count ok');

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
        res.end(e.message);
      });
  };

  console.log('>> ' + url);

  const wm = new Webmention();
  wm.on('error', e => {
    send(JSON.stringify({ error: true, message: e.message }));
  });

  wm.on('endpoints', urls => {
    timings.webmention = Date.now() - now.getTime();
    if (req.method === 'post') {
      return Promise.all(urls.map(sendMention)).then(reply => {
        timings.send = Date.now() - now.getTime();
        send(JSON.stringify(reply));
      });
    }

    send(JSON.stringify(urls));
  });

  wm.fetch(url);
};
