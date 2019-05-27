const links = require('./links');
const getEndpoints = require('./get-wm-endpoints');
const parse = require('url').parse;

async function main(url, limit, mentions = links.get(url, limit)) {
  const ignoreOwn = permalink => curr => {
    if (!url) return true;
    const host = parse(url).hostname;
    if (curr.includes(host) || curr.includes(host + '/')) {
      return false;
    }

    if (curr === permalink) {
      return false;
    }

    return true;
  };

  const urls = await mentions.then(mentions =>
    Promise.all(
      mentions.map(async ({ permalink, links }) => {
        const endpoints = await getEndpoints(
          links.filter(ignoreOwn(permalink))
        );

        if (endpoints.length === 0) return false;

        return endpoints.map(({ url: target, endpoint }) => {
          return {
            endpoint,
            source: permalink,
            target,
          };
        });
      })
    )
  );

  return [].concat(...urls.filter(Boolean));
}

module.exports = main;
