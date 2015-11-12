var path = require('path'),
  webpack = require('webpack');

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
  output: {
    filename: '[name].bundle.js'
  }
};

