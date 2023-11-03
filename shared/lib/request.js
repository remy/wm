const { http, https } = require('follow-redirects');
const headers = { 'User-Agent': 'webmention.app' };

// by default timeout at 5 seconds
function main(url, timeout = 500) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('http:') ? http : https;
    let timer = null;
    const req = client.request(url, { timeout, headers }, (res) => {
      clearTimeout(timer);
      if (res.statusCode < 200 || res.statusCode >= 400) {
        reject(new Error(`Bad response ${res.statusCode} on ${url}`));
        return;
      }

      let reply = '';

      res.on('data', (chunk) => (reply += chunk));
      res.on('end', () => {
        resolve({ content: reply, responseUrl: res.responseUrl });
      });

      res.on('error', reject);
    });
    req.on('timeout', () => {
      req.abort();
      reject(new Error('Timeout'));
    });
    req.on('error', (err) => reject(err));
    timer = setTimeout(() => {
      req.abort();
      reject(new Error('Timeout'));
    }, timeout);
    req.end();
  });
}

module.exports = main;
