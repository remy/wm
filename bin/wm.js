#!/usr/bin/env node
/* eslint-disable node/no-unpublished-bin */
const opts = require('optimist')
  .usage('Parse, discover and send webmentions\n\n$0 <url|file>')
  .default('limit', 10)
  .default('verbose', false)
  .default('send', false);

const argv = opts.argv;

if (argv._.length == 0) {
  opts.showHelp();
  process.exit(1);
}

const ui = require('clui');

var Progress = ui.Progress;

const progressBar = new Progress(20);
const existsSync = require('fs').existsSync;
const readFileSync = require('fs').readFileSync;
const target = argv._[0];
const Webmention = require('../lib/webmention');

const { limit, verbose } = argv;
const wm = new Webmention({ limit });

let todo = 0;
let done = 0;

wm.on('error', e => console.log(e));
wm.on('progress', e => {
  const [[key, value]] = Object.entries(e);

  if (key === 'endpoints') {
    todo = value;
  }

  if (key === 'endpoints-resolved') {
    done = value;
  }

  if (!verbose && process.stdout.isTTY) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progressBar.update(done, todo));
  }

  if (verbose) {
    console.log('%s = %s', key, value, JSON.stringify(e.data));
  }
});
if (verbose) wm.on('log', e => console.log(e));
wm.on('end', res => {
  if (process.stdout.isTTY) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  if (verbose && res.length === 0) {
    console.log('- no webmentions found');
  }

  res.map(res => {
    console.log('source= ' + res.source);
    console.log('target= ' + res.target);
    console.log('');
  });
});

if (existsSync(target)) {
  wm.load(readFileSync(argv._[0], 'utf8'));
} else {
  wm.fetch(target);
}
