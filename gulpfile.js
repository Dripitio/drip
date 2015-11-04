'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  es = require('event-stream'),
  _ = require('lodash'),
  webpackStream = require('webpack-stream')
  ;

var staticPrefix = 'drip/static',
  distPath = staticPrefix + "/dist";

gulp.task("default", ['build', 'sass'], function () {
  gulp.watch([staticPrefix + '/js/**/*.js'], ['build',]);
  gulp.watch([staticPrefix + '/sass/**/*.scss'], ['sass']);
});

gulp.task('sass', function () {
  var sassFiles = gulp.src(staticPrefix + '/sass/style.scss')
    .pipe(sass().on('error', sass.logError));

  var bootstrapFiles = gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css');

  return es.concat(sassFiles, bootstrapFiles)
    .pipe(concat('style.css'))
    .pipe(gulp.dest(distPath));
});


gulp.task('sass:watch', function () {
  gulp.watch(staticPrefix + '/sass/**/*.scss', ['sass']);
});


gulp.task('build', function() {
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

