const html = require('../lib/html');
const dom = require('../lib/dom');
const links = require('../lib/links');
const getEndpoints = require('./get-wm-endpoints');
const parse = require('url').parse;

async function main(url) {
  const host = parse(url).hostname;

  const ignoreOwn = url => {
    if (url.includes(host) || url.includes(host + '/')) {
      return false;
    }
    return true;
  };

  const urls = await Promise.all(
    links({ ...dom(await html(url)), url }).map(
      async ({ permalink, links }) => {
        const endpoints = await getEndpoints(links.filter(ignoreOwn));

        if (endpoints.length === 0) return false;

        // this is a bit confusing…maybe refactor?
        return endpoints.map(({ url: target, endpoint }) => {
          return {
            endpoint,
            source: permalink,
            target,
          };
        });
      }
    )
  );

  return [].concat(...urls.filter(Boolean));
}

module.exports = main;
