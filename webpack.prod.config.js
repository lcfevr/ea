/**
 * 生产环境
 */
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var webpackBaseConfig = require('./webpack.base.config.js');
var fs = require('fs');



process.env.NODE_ENV = '"production"';



module.exports = merge(webpackBaseConfig, {
  entry: {
    main:'./src/tracker/ea.js',
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'ea.min.js',
  },

  plugins: [


    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),



  ]
});



