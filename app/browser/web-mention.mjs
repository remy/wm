/* eslint-env browser */
import Component from '../elements/web-mention.mjs';
import enhance from '@enhance/element';

enhance('web-mention', {
  attrs: ['source', 'target', 'status', 'error'],
  render: Component,
});
