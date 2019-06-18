const { http, https } = require('follow-redirects');

// by default timeout at 5 seconds
function main(url, timeout = 1000 * 5) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('http:') ? http : https;

    const req = client.request(url, { timeout }, res => {
      if (res.statusCode < 200 || res.statusCode >= 400) {
        reject(new Error(`Bad response ${res.statusCode} on ${url}`));
        return;
      }

      let reply = '';

      res.on('data', chunk => (reply += chunk));
      res.on('end', () => {
        resolve({ content: reply, responseUrl: res.responseUrl });
      });

      res.on('error', reject);
    });
    req.on('timeout', () => req.abort());
    req.on('error', err => reject(err));
    req.end();
  });
}

module.exports = main;
