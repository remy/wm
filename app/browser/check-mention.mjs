/* eslint-env browser */
import Component from '../elements/check-mention.mjs';
import enhance from '@enhance/element';

enhance('check-mention', {
  attrs: ['loading'],
  render: Component,
  connected(...args) {
    /** @type HTMLFormElement */
    const form = this.querySelector('form');
    const input = this.querySelector('input');
    console.log('check-mention connected', { args, form });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.setAttribute('loading', true);
      console.log('test', input);
    });
  },
});
