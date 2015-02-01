var gulp = require('gulp');
var bytediff = require('gulp-bytediff');
var micro = require('gulp-micro');
var uglify = require('gulp-uglify');
var closure = require('gulp-closure-compiler');
var jscrush = require('gulp-jscrush');

gulp.task('uglify', function () {
  return gulp.src('src/source.js')
    .pipe(bytediff.start())
    .pipe(uglify())
    .pipe(jscrush())
    .pipe(bytediff.stop())
    .pipe(micro({limit: 1024}))
    .pipe(gulp.dest('dist'));
});

gulp.task('closure', function() {
  return gulp.src('src/source.js')
    .pipe(closure({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'source.js',
      compilerFlags: {
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        warning_level: 'VERBOSE',
        externs: 'js1k-externs.js'
      }
    }))
    .pipe(jscrush())
    .pipe(micro({limit: 1024}))
    .pipe(gulp.dest('dist'));
});

gulp.task('crush', function() {

})

gulp.task('default', ['uglify']);
