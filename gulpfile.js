var gulp = require('gulp');
var bytediff = require('gulp-bytediff');
var micro = require('gulp-micro');
var uglify = require('gulp-uglify');
var jscrush = require('gulp-jscrush');

gulp.task('build', function() {
  return gulp.src('src/*.js')
    .pipe(bytediff.start())
    .pipe(uglify())
    .pipe(jscrush())
    .pipe(micro({limit: 1024}))
    .pipe(bytediff.stop())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
