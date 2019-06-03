const EventEmitter = require('events');
const parse = require('url').parse;
const links = require('./links').links;
const getEndpoints = require('./get-wm-endpoints');
const request = require('./request');
const dom = require('./html/dom');
const mf = require('./microformat/dom');
const smellsLikeRSS = require('./rss/is');
const rss = require('./rss/dom');
const send = require('./send');

class Webmention extends EventEmitter {
  constructor({ limit = 10, send = false } = {}) {
    super();

    this.url = null;
    this.limit = limit;
    this.send = send;
    this.__sending = false;
    this.mentions = [];
    this.endpoints = null;
    this.counts = {};

    this.on('progress-update', ({ type, value, data }) => {
      const v = (this.counts[type] = (this.counts[type] || 0) + value);
      this.emit('progress', { [type]: v, data });
    });

    if (send) this.sendWebMentions();
  }

  async getLinksFromHTML({ html }) {
    const url = this.url;
    const res = dom(html);
    this.emit('progress', { entries: res.base.length });

    return links({ ...res, url });
  }

  async getLinksFromMicroformats({ html }) {
    const res = await mf(html, this);
    const url = res.url;
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
        this.emit(
          'log',
          `Webmention endpoint found: ${JSON.stringify(endpoints)}`
        );

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

    if (content.includes('h-entry')) {
      // smells like microformats
      this.emit('log', 'Content has microformats');
      return this.getLinksFromMicroformats({ html: content });
    }

    // else: html
    this.emit('log', 'Content is HTML');
    return this.getLinksFromHTML({ html: content });
  }

  fetch(url) {
    if (!url.startsWith('http')) {
      url = `http://${url}`;
    }
    this.emit('log', `Fetching ${url}`);
    request(url)
      .then(({ content, responseUrl }) => {
        this.url = responseUrl;
        this.emit('request', this.url);
        return this.load(content);
      })
      .catch(e => this.emit('error', e));
  }

  load(content) {
    this.content = content;
    return this.getFromContent(content)
      .then(res => {
        this.mentions = res;
        this.process().then(res => {
          this.endpoints = res;
          this.emit('endpoints', res);
          if (!this.__sending) {
            this.emit('end');
          }
        });
      })
      .catch(e => this.emit('error', e));
  }

  // FIXME work out why I can't call this `send`
  async sendWebMentions() {
    this.__sending = true;
    if (this.endpoints === null) {
      this.emit('log', 'queuing send');
      this.on('endpoints', () => {
        this.sendWebMentions();
      });
      return;
    }

    this.emit('log', 'start send');
    Promise.all(
      this.endpoints.map(res => {
        this.emit(
          'log',
          `Sending ${res.source} to ${res.endpoint.url} (${res.endpoint.type})`
        );
        return send(res)
          .then(_ => this.emit('sent', { ..._, ...res }))
          .catch(e => {
            this.emit('log', e.message);
          });
      })
    ).then(() => {
      this.emit('end');
    });
  }
}

module.exports = Webmention;
