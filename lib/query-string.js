const url = require('url');
const qsParser = require('querystring').parse;
const decodeUriComponent = require('decodeuricomponent');

module.exports = req =>
  qsParser(url.parse(req.url).query, null, null, {
    decodeURIComponent: decodeUriComponent,
  });
