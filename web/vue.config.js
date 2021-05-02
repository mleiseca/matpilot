// var webpack = require('webpack')

module.exports = {
  // ,
  // pluginOptions: {
  //   webpackBundleAnalyzer: {
  //     openAnalyzer: false,
  //     reportFilename: '.report.html',
  //     generateStatsFile: true,
  //     statsFilename: '.stats.json'
  //   },
  //
  // }
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 512000
      }
    }
  },

  transpileDependencies: [
    'vuetify'
  ]
}
