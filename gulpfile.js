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
var shell = require('gulp-shell');

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

gulp.task('gen-docco-all', function(done) {
    gulp.src(["./www/js/*.js", "./www/js/controllers/*.js", "./www/js/services/*.js", "./www/js/workers/*.js",
        "./www/js/polyfill/*.js", "./www/js/util/*.js", "./www/js/sync/DataService.js", "./www/js/sync/SaveWorker.js",
        "./www/js/sync/SyncWorker.js"])
  .pipe(docco())
  .pipe(gulp.dest('./docs/docco/'));
  done();
});

gulp.task('gen-yuidoc-all', function(done) {
  gulp.src(["./www/js/*.js", "./www/js/controllers/*.js", "./www/js/services/*.js", "./www/js/workers/*.js",
        "./www/js/polyfill/*.js", "./www/js/util/*.js", "./www/js/sync/DataService.js", "./www/js/sync/SaveWorker.js",
        "./www/js/sync/SyncWorker.js"])
  .pipe(yuidoc())
  .pipe(gulp.dest("./docs/yuidoc/"));
  done();
});

gulp.task('gen-docco-all-toc', shell.task([
    'docco-toc \
    ./www/js/controllers/AppController.js \
    ./www/js/controllers/BrowseReportsController.js \
    ./www/js/controllers/LoginController.js \
    ./www/js/controllers/MapController.js \
    ./www/js/controllers/ReportController.js \
    ./www/js/controllers/SettingsController.js \
    ./www/js/controllers/SettingsGeneralController.js \
    ./www/js/controllers/SettingsGpsController.js \
    ./www/js/controllers/SettingsLangController.js \
    ./www/js/controllers/ViewReportController.js \
    ./www/js/controllers/WorkspaceController.js \
    ./www/js/polyfill/FormDataPolyfill.js \
    ./www/js/polyfill/PerfNowPolyfill.js \
    ./www/js/services/AuthService.js \
    ./www/js/services/DataShareService.js \
    ./www/js/services/GeoService.js \
    ./www/js/services/LocalStorageService.js \
    ./www/js/services/SettingsService.js \
    ./www/js/sync/DataService.js \
    ./www/js/sync/SaveWorker.js \
    ./www/js/sync/SyncWorker.js \
    ./www/js/util/EmailValidator.js \
    ./www/js/util/img-touch-canvas.js \
    ./www/js/util/JSONValidator.js \
    ./www/js/util/LocalStorageUtil.js \
    ./www/js/util/ModalHandler.js \
    ./www/js/util/Position.js \
    ./www/js/util/Settings.js \
    ./www/js/util/WeatherReport.js \
    -o ./docs/docco-toc'
]));

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
