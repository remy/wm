const fetch = require('node-fetch');

const xml = ({ source, target }) => `<?xml version="1.0"?>
<methodCall>
  <methodName>pingback.ping</methodName>
  <params>
    <param><value><string>${source}</string></value></param>
    <param><value><string>${target}</string></value></param>
  </params>
</methodCall>`;

async function main({ source, target, endpoint }) {
  const xmlBody = xml({ source, target });

  const res = await fetch(endpoint, {
    method: 'POST',
    body: xmlBody,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

  const body = await res.text();

  if (body.includes('fault')) {
    const fault = new Error('Undefined XML RPC error');
    const code = body.match(
      /<int>([^<]+)<\/int>[\s\S]+?<string>([^<]+)<\/string>/i
    );

    if (code) {
      if (code[2]) fault.message = code[2];
      fault.code = code[1];
    }

    return {
      status: 400,
      target: res.url,
      source: target,
      error: fault.message,
    };
  }

  return {
    source,
    status: res.status,
    target: res.url,
  };
}

module.exports = main;
