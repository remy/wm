const lookup = require('get-webmention-url');

const main = async source =>
  new Promise((resolve, reject) => {
    lookup(source, (err, endpoint) => {
      if (err) return reject(err);
      resolve({ source, endpoint });
    });
  });

module.exports = main;
