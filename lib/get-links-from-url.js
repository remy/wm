const links = require('./links');
const getEndpoints = require('./get-wm-endpoints');
const parse = require('url').parse;

async function main(url) {
  const host = parse(url).hostname;

  const ignoreOwn = permalink => url => {
    if (url.includes(host) || url.includes(host + '/')) {
      return false;
    }

    if (url === permalink) {
      return false;
    }

    return true;
  };

  const urls = await Promise.all(
    (await links.get(url)).map(async ({ permalink, links }) => {
      const endpoints = await getEndpoints(links.filter(ignoreOwn(permalink)));

      if (endpoints.length === 0) return false;

      return endpoints.map(({ url: target, endpoint }) => {
        return {
          endpoint,
          source: permalink,
          target,
        };
      });
    })
  );

  return [].concat(...urls.filter(Boolean));
}

module.exports = main;
