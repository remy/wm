const parse = require('url').parse;
const hosts = require(__dirname + '/../generated/hosts.json');
const wm = require('./wm-endpoint');

async function main(urls, progress = () => {}) {
  const unique = new Set(
    urls.map(_ => {
      const parsed = parse(_);
      return parsed.protocol + '//' + parsed.hostname;
    })
  );

  progress('log', 'Unique hosts: ' + Array.from(unique.values()));
  progress('progress-update', { type: 'endpoints', value: unique.size });

  return Promise.all(
    Array.from(unique, source => {
      const endpoint = hosts[parse(source).hostname];
      if (endpoint !== undefined) {
        progress('log', 'Cached endpoint found for ' + source);
        progress('progress-update', { type: 'endpoints-resolved', value: 1 });
        return { source, endpoint };
      }

      return wm(source)
        .catch(() => {
          return { source, endpoint: null };
        })
        .then(res => {
          progress('progress-update', { type: 'endpoints-resolved', value: 1 });
          return res;
        });
    })
  )
    .then(res => {
      return urls.map(url => {
        return Object.assign(
          { url },
          res.find(({ source }) => url.startsWith(source))
        );
      });
    })
    .then(res => res.filter(_ => _.endpoint));
}

module.exports = main;
