import '@remy/envy';
import ms from 'ms';
import { parse } from 'url';
import Webmention from '../../shared/lib/webmention.js';
import sendMention from '../../shared/lib/send/index.js';
import db from '../../shared/lib/db.js';

const rateWindow = 1000 * 60; // * 60 * 4; // 4 hours

async function handleRequest(req) {
  let { url, token, limit = 10 } = req.query;
  const method = req.method.toLowerCase();

  const now = new Date();

  // Server-Timing: miss, db;dur=53, app;dur=47.2 (ms)
  const timings = {
    db: 0,
    webmention: 0,
    send: 0,
  };

  if (!url) {
    return; // just render the get
  }

  if (!url.startsWith('http')) {
    url = `http://${url}`;
  }

  // ensure the url is properly encoded
  url = parse(url).href;

  const { origin = '', referer = '' } = req.headers;

  if (origin.includes('localhost') || referer.includes('webmention.app')) {
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
        return {
          statusCode: 429,
          json: {
            error: true,
            message: `Too many requests in time window. Try again in ${ms(
              delta * -1,
              { long: true }
            )}, or use a free token for no rate limits: https://webmention.app/token`,
          },
        };
      }
    }
  }

  return new Promise((resolve) => {
    const dbUpdate = db
      .updateRequestCount(url)
      .then(() => {
        timings.db = Date.now() - now.getTime();
      })
      .catch((e) => console.log(e));

    const send = (data) => {
      data.url = url;
      return dbUpdate
        .then(() => {
          return {
            json: data,
          };
        })
        .catch((e) => {
          return {
            json: { error: true, message: e.message },
          };
        })
        .then((reply) => resolve(reply));
    };

    console.log('>> %s %s', method === 'post' ? 'SEND' : 'QUERY', url);

    const wm = new Webmention({ limit });
    wm.on('error', (e) => {
      send({ error: true, message: e.message });
    });

    // wm.on('log', (a) => console.log(a));
    // wm.on('progress', (e) => {
    //   const [[key, value]] = Object.entries(e);
    //   console.log('progress', key, value);
    // });

    wm.on('endpoints', (urls) => {
      timings.webmention = Date.now() - now.getTime();

      if (method === 'post') {
        return Promise.all(urls.map(sendMention)).then((reply) => {
          if (reply.length)
            db.updateRequestCount(
              '__sent',
              reply.filter((_) => _.status < 400).length
            ).catch((E) => console.log('error updating __sent count', E));
          timings.send = Date.now() - now.getTime();
          return send({ urls: reply });
        });
      }

      if (urls.length === 0 && wm.mentions.length > 0) {
        return send({
          error: true,
          message: `No webmention endpoints found in the links of the ${
            wm.mentions.length
          } content ${wm.mentions.length === 1 ? 'entry' : 'entries'}`,
        });
      }

      send({ urls });
    });

    wm.fetch(url);
  });
}

export const get = handleRequest;
export const post = handleRequest;
