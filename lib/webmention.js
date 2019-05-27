const EventEmitter = require('events');
const links = require('./links').links;
const getEndpoints = require('./get-wm-endpoints');
const request = require('./request');
const dom = require('./html/dom');
const smellsLikeRSS = require('./rss/is');
const rss = require('./rss/dom');
const parse = require('url').parse;

class Webmention extends EventEmitter {
  constructor({ limit, send = false }) {
    super();

    this.url = null;
    this.limit = limit || 10;
    this.send = send;
    this.mentions = [];
    this.counts = {};

    this.on('progress-update', ({ type, value }) => {
      const v = (this.counts[type] = (this.counts[type] || 0) + value);
      this.emit('progress', { [type]: v });
    });
  }

  getLinksFromHTML({ html }) {
    const url = this.url;
    const res = dom(html);
    this.emit('progress', { entries: res.base.length });
    return links({ ...res, url });
  }

  async getLinksFromFeed({ xml }) {
    const res = await rss(xml, this.limit);
    this.url = res.url;
    this.emit('progress', { entries: res.rss.items.length });

    return links({ ...res, rss: true });
  }

  async process() {
    this.emit('progress', {
      mentions: this.mentions.reduce(
        (acc, curr) => (acc += curr.links.length),
        0
      ),
    });

    const ignoreOwn = permalink => curr => {
      if (!this.url) return true;
      const host = parse(this.url).hostname;
      if (curr.includes(host) || curr.includes(host + '/')) {
        return false;
      }

      if (curr === permalink) {
        return false;
      }

      return true;
    };

    const urls = await Promise.all(
      this.mentions.map(async ({ permalink, links }) => {
        const endpoints = await getEndpoints(
          links.filter(ignoreOwn(permalink)),
          (type, data) => this.emit(type, data)
        );

        if (endpoints.length === 0) return false;
        this.emit('log', `Webmention endpoint found: ${endpoints}`);

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

  getFromContent(content) {
    if (smellsLikeRSS(content)) {
      this.emit('log', 'Content is RSS');
      return this.getLinksFromFeed({ xml: content });
    }

    // else: html
    this.emit('log', 'Content is HTML');
    return this.getLinksFromHTML({ html: content });
  }

  async get(url) {
    const content = await request(url);
    this.getFromContent(content, url).then(res => {
      this.mentions = res;
      this.process().then(res => {
        this.emit('end', res);
      });
    });
  }

  async fetch(url) {
    if (!url.startsWith('http')) {
      url = `http://${url}`;
    }
    this.emit('log', `Fetching ${url}`);
    this.url = url;
    this.load(await request(url));
  }

  async load(content) {
    this.content = content;
    this.getFromContent(content)
      .then(res => {
        this.mentions = res;
        this.process().then(res => {
          this.emit('end', res);
        });
      })
      .catch(e => this.emit('error', e));
  }
}

module.exports = Webmention;
