const qs = require('../lib/query-string');
const Webmention = require('../lib/webmention');
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

if (!module.parent) {
  require('http')
    .createServer(module.exports)
    .listen(3000);
}
