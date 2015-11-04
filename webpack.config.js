var path = require('path'),
  webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, './'),
  entry: {
    'index': './drip/static/js/index.js'
  },
  module: {
    loaders: []
  },
  output: {
    filename: 'bundle.js'
  }
};

