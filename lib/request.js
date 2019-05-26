const http = require('follow-redirects').http;
const https = require('follow-redirects').https;

function main(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('http:') ? http : https;

    client.get(url, res => {
      if (res.statusCode < 200 || res.statusCode >= 400) {
        reject(new Error(`Bad response ${res.statusCode}`));
        return;
      }

      let reply = '';

      res.on('data', chunk => (reply += chunk));
      res.on('end', () => {
        resolve(reply);
      });

      res.on('error', reject);
    });
  });
}

module.exports = main;
