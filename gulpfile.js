'use strict';

var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');

var extract = require('gulp-html-extract');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');
var bytediff = require('gulp-bytediff');
var micro = require('gulp-micro');

var uglify = require('gulp-uglify');
var closure = require('gulp-closure-compiler');
var jscrush = require('gulp-jscrush');

gulp.task('uglify', function() {
  return gulp.src('src/*.html')
    .pipe(extract({
      sel: 'script[type=demo]'
    }))
    .pipe(rename('source-crushed.js'))
    .pipe(bytediff.start())
    .pipe(uglify())
    .pipe(jscrush())
    .pipe(bytediff.stop())
    .pipe(micro({limit: 1024}))
    .pipe(gulp.dest('demo'));
});

gulp.task('closure', function() {
  return gulp.src('src/*.html')
    .pipe(extract({
      sel: 'script[type=demo]'
    }))
    .pipe(rename('source-crushed.js'))
    .pipe(bytediff.start())
    .pipe(bytediff.stop())
    .pipe(closure({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'source-crushed.js',
      compilerFlags: {
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        warning_level: 'VERBOSE',
        externs: 'js1k-externs.js'
      }
    }))
    .pipe(jscrush())
    .pipe(bytediff.start())
    .pipe(bytediff.stop())
    .pipe(micro({limit: 1024}))
    .pipe(gulp.dest('demo'));
});

gulp.task('extract', function() {
  return gulp.src('src/*.html')
    .pipe(extract({
      sel: 'script[type=demo]'
    }))
    .pipe(rename('source-full.js'))
    .pipe(gulp.dest('demo'));
});

gulp.task('build:uglify', ['uglify', 'extract'], function() {
  return gulp.src('src/*.html')
    .pipe(htmlreplace({
      demo: {
        src: fs.readFileSync('demo/source-crushed.js').toString(),
        tpl: '<script type="demo">%s</script>'
      }
    }))
    .pipe(gulp.dest('demo'));
});

gulp.task('build:closure', ['closure', 'extract'], function() {
  return gulp.src('src/*.html')
    .pipe(htmlreplace({
      demo: {
        src: fs.readFileSync('demo/source-crushed.js').toString(),
        tpl: '<script type="demo">%s</script>'
      }
    }))
    .pipe(gulp.dest('demo'));
});

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: ['src'],
      directory: true
    },
    files: 'src/*.html',
    online: false,
    logFileChanges: false
  });

  // console.log(browserSync.emitter);
  // gulp.watch('src/*.html', ['build', browserSync.reload]);
});

browserSync.emitter.on('client:connected', function() {
  gulp.src('src/*.html')
      .pipe(extract({
        sel: 'script[type=demo]'
      }))
      .pipe(rename('JS1K demo'))
      .pipe(bytediff.start())
      .pipe(uglify())
      .pipe(jscrush())
      .pipe(bytediff.stop())
      .pipe(gutil.buffer(function(err, data){
        // console.log(Object.keys(data[0]));
        var before = data[0].bytediff.startSize;
        var after = data[0]._contents.length;
        var color = after < 1024 ? 'lime' : 'red';
        browserSync.notify(before + ' ➞ <span style="color:' + color + ';">' + after + '</span>', 5000);
      }));
});

gulp.task('default', ['build:uglify']);
