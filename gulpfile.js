'use strict';

var gulp = require('gulp'),
  _ = require('lodash'),
  webpackStream = require('webpack-stream')
  ;

var staticPrefix = 'drip/static',
  distPath = staticPrefix + "/dist";

gulp.task('build', function () {
  var config = require('./webpack.config.js');
  config = _.assign(config, {
    watch: true,
    devtool: 'source-map',
    debug: true
  });

  return gulp.src(staticPrefix + 'js/index.js')
    .pipe(webpackStream(config))
    .pipe(gulp.dest(distPath));
});

gulp.task('dist', function () {
  var config = require('./webpack.config.js');
  config = _.assign(config, {
    watch: false,
    debug: false
  });

  return gulp.src(staticPrefix + 'js/index.js')
    .pipe(webpackStream(config))
    .pipe(gulp.dest(distPath));
});
