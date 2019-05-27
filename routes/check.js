const qs = require('../lib/query-string');
const load = require('../lib/get-webmentions');
const send = require('../lib/send');

module.exports = async (req, res) => {
  let { url } = qs(req);

  if (!url) {
    // res.writeHead(500);
    return res.end('Bad request');
  }

  if (!url.startsWith('http')) {
    url = `http://${url}`;
  }

  console.log('>> ' + url);

  const urls = await load(url);

  if (req.method === 'post') {
    return Promise.all(urls.map(send)).then(reply => {
      res.end(JSON.stringify(reply));
    });
  }

  res.end(JSON.stringify(urls));
};
