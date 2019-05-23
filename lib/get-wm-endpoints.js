const parse = require('url').parse;
const hosts = require(__dirname + '/../generated/hosts.json');
const wm = require('./wm-endpoint');

async function main(urls) {
  const unique = new Set(
    urls.map(_ => {
      const parsed = parse(_);
      return parsed.protocol + '//' + parsed.hostname;
    })
  );

  return Promise.all(
    Array.from(unique, source => {
      const endpoint = hosts[parse(source).hostname];
      if (endpoint !== undefined) {
        return { source, endpoint };
      }
      console.log('- %s', source);

      return wm(source).catch(() => {
        return { source, endpoint: null };
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
