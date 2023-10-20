import enhance from '@enhance/element';
import GettingStarted from '../elements/getting-started.mjs';

enhance('getting-started', {
  attrs: [],
  /**
   * @param {HTMLElement} root
   */
  init(root) {
    root.addEventListener('change', (event) => {
      if (event.target.nodeName === 'INPUT') {
        root
          .querySelector('#started-docs')
          .setAttribute('selected', event.target.value);
      }
    });
  },
  render: GettingStarted,
  connected() {},
});
