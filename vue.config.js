//
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
//
// const productionGzipExtensions = ['js', 'css']
//
//
// module.exports = {
//   publicPath:'/',
//   outputDir:'dist',
//   assetsDir:'assets',
//
//   productionSourceMap:false,
//   lintOnSave:true,
//
//
//   configureWebpack:{
//     plugins:[
//       new CompressionWebpackPlugin({
//         algorithm: 'gzip',
//         test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
//         threshold: 10240,
//         minRatio: 0.8,
//         deleteOriginalAssets:false,
//       })
//     ],
//     devtool:'source-map'
//   },
//   resolve: {
//     //别名配置
//     alias: [
//       {
//         find: "@",
//         replacement: "/src",
//       },
//     ],
//     //忽略文件名
//     extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
//   },
// }
const { defineConfig } = require('@vue/cli-service')
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = ['js', 'css']
module.exports = defineConfig({
  transpileDependencies: true,
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
  }
})

