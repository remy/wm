const pkg = require('./package');

module.exports = {
  mode: 'universal',

  generate: {
    routes: ['/', '/about', '/scan'],
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

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
