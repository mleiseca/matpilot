var webpack = require('webpack')

module.exports = {
  configureWebpack:{
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 512000,
      }
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en.*/),
    ]
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
      reportFilename: '.report.html',
      generateStatsFile: true,
      statsFilename: '.stats.json'
    },

  }
}
