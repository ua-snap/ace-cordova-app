var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('karma').server;
var docco = require("gulp-docco");
var yuidoc = require("gulp-yuidoc");

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/tests/my.conf.js',
    singleRun: true
  }, function() {
    done();
  });
});

gulp.task('test-debug', function(done) {
  karma.start({
    configFile: __dirname + '/tests/my.conf.js',
    singleRun: false,
    debug: true
  }, function() {
    done();
  });
});

gulp.task('gen-docco-app', function(done) {
  gulp.src(["./www/js/*.js", "./www/js/controllers/*.js", "./www/services/*.js"])
  .pipe(docco())
  .pipe(gulp.dest('./docs/app/inline'));
  done();
});

gulp.task('gen-docco-api', function(done) {
  gulp.src("./www/js/core/*.js")
  .pipe(docco())
  .pipe(gulp.dest('./docs/api/inline'));
  done();
});

gulp.task('gen-yuidoc-api', function(done) {
  gulp.src("./www/js/core/*.js")
  .pipe(yuidoc())
  .pipe(gulp.dest("./docs/api/interface"));
  done();
});

gulp.task('gen-yuidoc-app', function(done) {
  gulp.src(["./www/js/*.js", "./www/js/controllers/*.js", "./www/services/*.js"])
  .pipe(yuidoc())
  .pipe(gulp.dest("./docs/app/interface"));
  done();
});

gulp.task('gen-docs', ['gen-docco-api', 'gen-docco-app', 'gen-yuidoc-api', 'gen-yuidoc-app']);


gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
