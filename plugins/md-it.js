const MarkdownIt = require('markdown-it');

module.exports = (_, inject) => {
  inject('md', new MarkdownIt());
};
