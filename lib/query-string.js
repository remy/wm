const url = require('url');
const qsParser = require('querystring').parse;

module.exports = req => qsParser(url.parse(req.url).query);
