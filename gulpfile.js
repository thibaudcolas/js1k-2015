var gulp = require('gulp');
var path = require('path');
var closure = require('gulp-closure-compiler');
var bytediff = require('gulp-bytediff');
var micro = require('gulp-micro');

gulp.task('build', function() {
  return gulp.src('src/*.js')
    .pipe(bytediff.start())
    .pipe(closure({
      compilation_level: 'ADVANCED_OPTIMIZATIONS',
      externs: 'js1k-externs.js'
    }))
    .pipe(micro({limit: 1024}))
    .pipe(bytediff.stop())
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['build']);
