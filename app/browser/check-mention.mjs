/* eslint-env browser */
import $ from './$.mjs';
import { mentionWrapper } from '../elements/check-mention.mjs';

class CheckMention extends HTMLElement {
  static observedAttributes = ['loading'];

  get url() {
    return this.input.value;
  }

  set loading(value) {
    if (value) {
      this.setAttribute('loading', true);
      this.mentions.innerHTML = '';
    } else {
      this.removeAttribute('loading');
    }
  }

  constructor() {
    super();
    this.button = $('button', this);
    this.input = $('input', this);
    this.mentions = $('#mention-wrapper', this);

    $('form', this).on('submit', (e) => {
      e.preventDefault();
      this.check(this.url);
    });
  }

  /**
   * @param {string} url
   * @param {boolean} [send=false]
   */
  async check(url, send = false) {
    this.loading = true;
    const query = new URLSearchParams();
    query.append('url', url);
    const res = await fetch(`/check?${query.toString()}`, {
      headers: { accept: 'application/json' },
      method: send ? 'post' : 'get',
    });
    const json = await res.json();
    this.loading = false;
    console.log({ json });

    this.mentions.innerHTML = mentionWrapper({
      html(strings, ...values) {
        return String.raw({ raw: strings }, ...values);
      },
      sent: send,
      urls: json.urls || [],
      url: json.url,
    });

    // if (!json.error) {
    //   this.mentions = json.urls;
    //   this.sent = true;
    // } else {
    //   this.mentions = [];
    //   this.error = json.message;
    // }
  }

  async send() {
    this.check(this.url, true);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'loading') {
      this.button.disabled = !!newValue;
    }
  }
}

customElements.define('check-mention', CheckMention);
