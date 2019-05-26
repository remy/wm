#!/usr/bin/env node
const opts = require('optimist')
  .usage('Parse and send WebMentions\n\n$0 <url|file>')
  .default('limit', 10)
  .default('send', false);

const argv = opts.argv;

if (argv._.length == 0) {
  opts.showHelp();
  process.exit(1);
}

const existsSync = require('fs').existsSync;
const target = argv._[0]; // OR?
const load = require('../lib/get-links-from-url');

if (existsSync(target)) {
} else {
  load(target)
    .then(res => console.log(JSON.stringify(res, 0, 2)))
    .catch(e => console.log(e));
}
