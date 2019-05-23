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

  const reply = {
    status: res.status,
    url: res.url,
    headers: res.headers.get(),
  };
  console.log(JSON.stringify(reply));

  return reply;
}

module.exports = main;
