const lookup = require('get-webmention-url');

const cache = new Map();

const main = async source =>
  new Promise((resolve, reject) => {
    if (cache.has(source)) {
      return resolve({ source, endpoint: cache.get(source) });
    }
    lookup(source, (err, endpoint) => {
      cache.set(source, endpoint || null);
      if (err) return reject(err);
      resolve({ source, endpoint });
    });
  });

module.exports = main;
