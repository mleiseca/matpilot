// var webpack = require('webpack')

module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 512000
      }
    }
  }
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
}
