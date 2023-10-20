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

      // this next line causes the entire component to render
      // which then means the `input` value is nuked.
      // a work around it to capture the value before the attr
      // is set, but that's only having debugged to work out
      // what was going on - plus if I watch `loading` and `url`
      // and then set those two attributes, it calls the
      // web component's render function twice and everything
      // is rendered twice
      this.setAttribute('loading', true);
      console.log('test value', input.value);
    });
  },
});
