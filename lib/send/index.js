const webmention = require('./webmention');
const pingback = require('./pingback');

async function main({ source, target, endpoint }) {
  if (endpoint.type === 'webmention') {
    return webmention({ source, target, endpoint: endpoint.url });
  }

  if (endpoint.type === 'pingback') {
    return pingback({ source, target, endpoint: endpoint.url });
  }
}

module.exports = main;
