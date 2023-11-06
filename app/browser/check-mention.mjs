/* eslint-env browser */
import $ from './$.mjs';
import { mentionWrapper } from '../elements/check-mention.mjs';

window.$ = $;

class CheckMention extends HTMLElement {
  static observedAttributes = ['loading'];

  get url() {
    return this.input.value;
  }

  set loading(value) {
    if (value) {
      this.setAttribute('loading', true);
    } else {
      this.removeAttribute('loading');
    }
  }

  clear() {
    this.mentions.innerHTML = '';
  }

  constructor() {
    super();
    this.button = $('button', this);
    this.input = $('input', this);
    this.mentions = $('#mention-wrapper', this);
    this.sendForm = $('form[method="post"]', this);

    this.addEventListener('submit', (e) => {
      e.preventDefault();
      this.check(this.url, e.target.method.toLowerCase() === 'post');
    });
  }

  /**
   * @param {string} url
   * @param {boolean} [send=false]
   */
  async check(url, send = false) {
    if (!send) this.clear();
    this.loading = true;
    const query = new URLSearchParams();
    query.append('url', url);
    const res = await fetch(`/check?${query.toString()}`, {
      headers: { accept: 'application/json' },
      method: send ? 'post' : 'get',
    });
    const json = await res.json();
    this.loading = false;

    this.mentions.innerHTML = mentionWrapper({
      html(strings, ...values) {
        return String.raw({ raw: strings }, ...values);
      },
      sent: send,
      urls: json.urls || [],
      url: json.url,
    });

    this.sendForm.hidden = send;

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
