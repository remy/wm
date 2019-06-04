const fetch = require('node-fetch');

const xml = ({ source, target }) => `<?xml version="1.0"?>
<methodCall>
  <methodName>pingback.ping</methodName>
  <params>
    <param><value><string>${escape(source)}</string></value></param>
    <param><value><string>${escape(target)}</string></value></param>
  </params>
</methodCall>`;

async function main({ source, target, endpoint }) {
  const res = await fetch(endpoint, {
    method: 'post',
    body: xml({ source, target }),
    headers: {
      'content-type': 'application/xml; charset=utf-8',
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
