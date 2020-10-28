module.exports = {
  mode: 'static',

  vue: {
    config: {
      // productionTip: false,
      devtools: true,
    },
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#03A9F4' },

  css: [],

  env: {
    API: process.env.NODE_ENV === 'development' ? 'http://localhost:3030' : '',
  },

  modules: ['@nuxtjs/markdownit', 'cookie-universal-nuxt'],
  plugins: ['~/plugins/md-it'],

  markdownit: {
    preset: 'default',
    linkify: true,
    html: true,
    use: ['markdown-it-task-lists', 'markdown-it-named-headings'],
  },

  devtools: true,
  /*
   ** Build configuration
   */
  build: {
    extend(config, ctx) {},
    minify: {
      removeRedundantAttributes: false,
    },
  },
};
