var path = require('path'),
  webpack = require('webpack'),
  ExtractTextPlugin = require("extract-text-webpack-plugin");

// required because of failing build on ubuntu
require('es6-promise').polyfill();

var staticPath = './drip/static';

module.exports = {
  context: path.join(__dirname, staticPath),

  entry: {
    dashboard: './js/dashboard/dashboard.jsx',
    landingpage: './js/landingpage/landingpage.jsx',
    drip: './js/drip/drip.jsx'
  },

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },

  resolve: {
    root: path.join(__dirname, staticPath),
    extensions: ['', '.scss', '.js', '.jsx']
  },

  plugins: [
    new ExtractTextPlugin("[name].css"),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],

  output: {
    filename: '[name].bundle.js'
  }
};

