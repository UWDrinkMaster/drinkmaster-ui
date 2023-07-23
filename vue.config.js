
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = ['js', 'css']


module.exports = {
  publicPath:'/',
  outputDir:'dist',
  assetsDir:'assets',

  productionSourceMap:false,
  lintOnSave:true,


  configureWebpack:{
    plugins:[
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets:false,
      })
    ],
    devtool:'source-map'
  },

  devServer:{
    open:true,
    proxy:{
      '/mqtt':{
        target:'http://localhost:8498',
        changeOrigin: true,
        ws:true,
        // pathRewrite:{
          // '^/api':''
        // }
      }
    }
  }
}
