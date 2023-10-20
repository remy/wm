/* eslint-env browser */
import Component from '../elements/started-docs.mjs';
import enhance from '@enhance/element';

enhance('started-docs', {
  attrs: ['selected'],
  render: Component,
});
