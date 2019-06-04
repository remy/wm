module.exports = {
  mode: 'universal',

  generate: {
    minify: {
      removeRedundantAttributes: false,
    },
  },

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
    API: process.env.API || 'http://localhost:3030/api',
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
  },
};
