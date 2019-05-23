console.clear();

const html = require('fs')
  .readFileSync(__dirname + '/sample.html')
  .toString();

const dom = require('../lib/dom');
const links = require('../lib/links');
const getEndpoints = require('../lib/get-wm-endpoints');

async function main() {
  const url = 'https://adactio.com';
  const host = url;
  const ignoreOwn = url => {
    if (url.includes(host) || url.includes(host + '/')) {
      return false;
    }

    return true;
  };

  const urls = await Promise.all(
    links({ ...dom(html), url }).map(async ({ permalink, links }) => {
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
    })
  );

  return [].concat(...urls.filter(Boolean));
}

main();
