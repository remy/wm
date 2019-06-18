#!/usr/bin/env node
/* eslint-disable no-process-exit */
/* eslint-disable node/no-unpublished-bin */
const pkg = require('../package.json');
const opts = require('optimist')
  .usage(
    'Parse, discover and send webmentions\n\n$ $0 [ url | file ]\n\nversion: ' +
      pkg.version
  )
  .boolean('version')
  .describe('send', 'send webmention notifications')
  .default('limit', 10)
  .default('send', false)
  .describe('limit', 'int: entries to discover')
  .describe('version')
  .describe('debug');

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

const { limit, debug, send } = argv;
const wm = new Webmention({ limit, send });

const clearLine = () => {
  if (process.stdout.isTTY) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
};

let todo = 0;
let done = 0;

if (debug) {
  console.log('limit = ' + limit);
  console.log('send = ' + send);
}

wm.on('error', e => console.log(e));
wm.on('progress', e => {
  const [[key, value]] = Object.entries(e);

  if (key === 'endpoints') {
    todo = value;
  }

  if (key === 'endpoints-resolved') {
    done = value;
  }

  if (!debug && process.stdout.isTTY) {
    clearLine();
    process.stdout.write(progressBar.update(done, todo));
  }

  if (debug) {
    console.log(
      `${key} = ${value}${e.data ? ' ' + JSON.stringify(e.data) : ''}`
    );
  }
});
if (debug) wm.on('log', e => console.log(e));
wm.on('endpoints', clearLine);
if (!send) {
  wm.on('endpoints', res => {
    if (res.length === 0) {
      if (wm.mentions.length) {
        console.log(
          'No webmention endpoints found on %s entries found (try increasing with --limit N)',
          wm.mentions.length
        );
      } else {
        console.log('No webmention endpoints found');
      }
    }

    res.map(res => {
      console.log('source = ' + res.source);
      console.log('target = ' + res.target);
      console.log(`endpoint = ${res.endpoint.url} (${res.endpoint.type})`);
      console.log('');
    });
  });
}

wm.on('sent', res => {
  console.log('source   = ' + res.source);
  console.log(`endpoint = ${res.endpoint.url} (${res.endpoint.type})`);
  console.log('target   = ' + res.target);
  console.log(`status   = ${res.status} ${res.status < 400 ? '✓' : '✗'}`); // ✖︎✓✔︎✗
  if (res.error) console.log('error    = ' + res.error);
  console.log('');
});

if (existsSync(target)) {
  wm.load(readFileSync(argv._[0], 'utf8'));
} else {
  wm.fetch(target);
}
