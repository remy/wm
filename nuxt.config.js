const pkg = require('./package');

module.exports = {
  mode: 'universal',

  generate: {
    // routes: ['/', '/about', '/scan'],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#03A9F4' },

  /*
   ** Global CSS
   */
  css: [],

  modules: ['@nuxtjs/markdownit'],
  plugins: ['~/plugins/md-it'],

  markdownit: {
    preset: 'default',
    linkify: true,
    html: true,
    use: ['markdown-it-task-lists'],
  },

  devtools: true,
  /*
   ** Build configuration
   */
  build: {
    extend(config, ctx) {},
  },
};
