#!/usr/bin/env node
// const source = require('fs')
//   .readFileSync(process.argv[2])
//   .toString();
const url = process.argv[2]; // OR?

const links = require('../lib/links');
const getEndpoints = require('../lib/get-wm-endpoints');

async function main() {
  const host = url;
  const ignoreOwn = url => {
    if (url.includes(host) || url.includes(host + '/')) {
      return false;
    }
    return true;
  };

  const urls = await Promise.all(
    (await links.get(url)).map(async ({ permalink, links }) => {
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

main()
  .then(res => console.log(JSON.stringify(res, 0, 2)))
  .catch(e => console.log(e));
