var path = require('path'),
  webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, './drip/static'),
  entry: {
    dashboard: './js/dashboard/index.js',
    landingpage: './js/landingpage/index.js'
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    }]
  },
  resolve: {
    root: path.join(__dirname, './drip/static'),
    extensions: ['', '.js', '.scss']
  },
  output: {
    filename: '[name].bundle.js'
  }
};

