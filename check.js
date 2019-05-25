const load = require('./lib/get-links-from-url');
const wmSend = require('./lib/send');

exports.handler = async function(event, context, callback) {
  let { url, send = false } = event.queryStringParameters;

  if (!url) {
    return callback(new Error('bad request'));
  }

  if (!url.startsWith('http')) {
    url = `http://${url}`;
  }

  console.log('>> ' + url);

  const urls = await load(url);

  if (send) {
    return Promise.all(urls.map(wmSend))
      .then(reply => {
        callback(null, { status: 200, body: JSON.stringify(reply) });
      })
      .catch(e => callback(e));
  }

  callback(null, { status: 200, body: JSON.stringify(urls) });
};
