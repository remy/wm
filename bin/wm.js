#!/usr/bin/env node
const opts = require('optimist')
  .usage('Parse and send webmentions\n\n$0 <url|file>')
  .default('limit', 10)
  .default('send', false);

const argv = opts.argv;

if (argv._.length == 0) {
  opts.showHelp();
  process.exit(1);
}

const existsSync = require('fs').existsSync;
const readFileSync = require('fs').readFileSync;
const target = argv._[0]; // OR?
const load = require('../lib/get-webmentions');

if (existsSync(target)) {
  const p = require('../lib/links').getFromContent(
    readFileSync(argv._[0], 'utf8'),
    null,
    argv.limit
  );
  load(null, argv.limit, p)
    .then(res => console.log(JSON.stringify(res, 0, 2)))
    .catch(e => console.log(e));
} else {
  load(target, argv.limit)
    .then(res => console.log(JSON.stringify(res, 0, 2)))
    .catch(e => console.log(e));
}
