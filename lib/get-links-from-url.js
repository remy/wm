const html = require('../lib/html');
const dom = require('../lib/dom');
const links = require('../lib/links');
const getEndpoints = require('./get-wm-endpoints');
const parse = require('url').parse;

async function main(url) {
  const host = parse(url).hostname;

  const ignoreOwn = url => {
    if (url.includes(`/${host}/`) || url.endsWith(`/${host}`)) {
      return false;
    }

    return true;
  };

  const urls = links(dom(await html(url))).filter(ignoreOwn);
  const endpoints = await getEndpoints(urls);

  // this is a bit confusing…maybe refactor?
  return endpoints.map(({ url: target, endpoint }) => {
    return {
      endpoint,
      source: url,
      target,
    };
  });
}

module.exports = main;
