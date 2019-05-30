const parse = require('url').parse;
const hosts = require(__dirname + '/../generated/hosts.json');
const wm = require('./endpoint');

async function main(urls, progress = () => {}) {
  const unique = new Set(
    urls.map(_ => {
      const parsed = parse(_);
      return parsed.protocol + '//' + parsed.hostname;
    })
  );

  progress('log', 'URLs to check: ' + urls.length);
  progress('progress-update', { type: 'endpoints', value: unique.size });

  return Promise.all(
    urls
      .filter(source => {
        const hostname = parse(source).hostname;
        const endpointURL = hosts[hostname];
        if (endpointURL === null) {
          return false;
        }

        return true;
      })
      .map(source => {
        const endpointURL = hosts[parse(source).hostname];
        if (endpointURL !== undefined) {
          const endpoint = endpointURL
            ? { type: 'webmention', url: endpointURL }
            : null;
          progress('log', 'Cached endpoint found for ' + source);
          progress('progress-update', {
            type: 'endpoints-resolved',
            value: 1,
            data: { source, endpoint },
          });
          return { source, endpoint };
        }

        return wm(source)
          .catch(() => {
            return { source, endpoint: null };
          })
          .then(res => {
            progress('progress-update', {
              type: 'endpoints-resolved',
              value: 1,
              data: { source, endpoint: res.endpoint },
            });
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
