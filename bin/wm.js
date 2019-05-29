#!/usr/bin/env node
/* eslint-disable no-process-exit */
/* eslint-disable node/no-unpublished-bin */
const pkg = require('../package.json');
const opts = require('optimist')
  .usage(
    'Parse, discover and send webmentions\n\n$0 <url|file>\nVersion: ' +
      pkg.version
  )
  .default('limit', 10)
  .boolean('version')
  .describe('version')
  .default('verbose', false)
  .default('send', false);

const argv = opts.argv;

if (argv.version) {
  console.log(pkg.version);
  process.exit(0);
}

if (argv._.length == 0) {
  opts.showHelp();
  process.exit(1);
}

const ui = require('clui');
const Progress = ui.Progress;
const progressBar = new Progress(20);
const existsSync = require('fs').existsSync;
const readFileSync = require('fs').readFileSync;
const target = argv._[0];
const Webmention = require('../lib/webmention');

const { limit, verbose } = argv;
const wm = new Webmention({ limit });

const clearLine = () => {
  if (process.stdout.isTTY) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
};

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
    clearLine();
    process.stdout.write(progressBar.update(done, todo));
  }

  if (verbose) {
    console.log(
      `${key} = ${value}${e.data ? ' ' + JSON.stringify(e.data) : ''}`
    );
  }
});
if (verbose) wm.on('log', e => console.log(e));
wm.on('end', res => {
  clearLine();

  if (verbose && res.length === 0) {
    console.log('- no active webmention endpoints found');
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
