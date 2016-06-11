var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    // Allow watch not to fail on the first error in pipe.
    plumber = require('gulp-plumber');

///////////////////////////////////////////////////
// Compile JavaScript Task
///////////////////////////////////////////////////
gulp.task('scripts', function(){
	gulp.src(['dist/**/*.js', '!dist/**/*.min.js'])
  .pipe(plumber())
  .pipe(rename({suffix:'.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('dist/'))
  .pipe(reload({stream:true}));
});

///////////////////////////////////////////////////
// Compile Sass Task
///////////////////////////////////////////////////
gulp.task('sass', function() {
  return sass('dist/swipeslider.scss', {sourcemap: true})
  .on('error', sass.logError)
  .pipe(autoprefixer('last 2 versions', 'ie 9'))
  .pipe(sourcemaps.write('dist/'))
  .pipe(gulp.dest('dist/'))
  .pipe(reload({stream:true}));
});

///////////////////////////////////////////////////
// Browser Task
///////////////////////////////////////////////////
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

///////////////////////////////////////////////////
// Watch Task
///////////////////////////////////////////////////
gulp.task('watch', function(){
  gulp.watch('dist/**/*.js', ['scripts']);
  gulp.watch('dist/swipeslider.scss', ['sass']);
});

///////////////////////////////////////////////////
// Default Task
///////////////////////////////////////////////////
gulp.task('default', ['scripts', 'sass', 'browser-sync', 'watch']);
