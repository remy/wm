const qs = require('../lib/query-string');
const load = require('../lib/get-links-from-url');
const wmSend = require('../lib/send');

module.exports = async (req, res) => {
  let { url, send = false } = qs(req);

  if (!url) {
    // res.writeHead(500);
    return res.end('Bad request');
  }

  if (!url.startsWith('http')) {
    url = `http://${url}`;
  }

  console.log('>> ' + url);

  const urls = await load(url);

  if (send) {
    return Promise.all(urls.map(wmSend)).then(reply => {
      res.end(JSON.stringify(reply));
    });
  }

  res.end(JSON.stringify(urls));
};
