module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    link: [
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Pacifico:400' }
    ],
    meta: [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    { src: '~/assets/style/app.styl', lang: 'styl' },
    'mapbox-gl/dist/mapbox-gl.css'
  ],
  /*
  ** Add axios globally
  */
  modules: [
    // Simple usage
    // '@nuxtjs/pwa',
    // With options
    ['@nuxtjs/pwa', {
      optimize: false,
      meta: {
        viewport: false,
        ogTitle: false,
        ogDescription: false
      }
    }]
  ],
  plugins: [
    { src: '~/plugins/fb-sdk.js', ssr: false },
    '~/plugins/vuetify.js',
    { src: 'mapbox-gl/dist/mapbox-gl', ssr: false }
  ],
  build: {
    vendor: [
      'axios',
      'vuetify',
      'firebase',
      'mapbox-gl/dist/mapbox-gl'
    ],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (!ctx.dev && ctx.isClient) {
        config.module.noParse = /(mapbox-gl)\.js$/
      }
    }
  }
}
