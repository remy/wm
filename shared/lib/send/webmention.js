const fetch = require('node-fetch');

async function main({ source, target, endpoint }) {
  const res = await fetch(endpoint, {
    method: 'post',
    body: `source=${encodeURIComponent(source)}&target=${encodeURIComponent(
      target
    )}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

  let error = null;

  if (res.status >= 400) {
    error = await res.text();
  }

  const reply = {
    status: res.status,
    error,
    source: target, // this is confusing, but works in the output
    target: res.url,
  };

  return reply;
}

module.exports = main;
