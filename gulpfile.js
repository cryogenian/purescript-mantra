var gulp = require("gulp"),
    purescript = require("gulp-purescript"),
    browserify = require("gulp-browserify"),
    br = require("browserify"),
    watchify = require("watchify"),
    gutil = require("gulp-util"),
    vinyl = require('vinyl-source-stream'),
    rename = require('gulp-rename');

var jsEntry = "js/src/main.js";
var jsrc = ['js/src/**/*.js'];

gulp.task("utils", function() {
    return gulp.src(jsEntry)
        .pipe(browserify({}))
        .pipe(rename('utils.js'))
        .pipe(gulp.dest("public"));
});


gulp.task('watch-utils', function() {
    return gulp.watch(jsrc, ['utils']);
});


gulp.task('dev-utils', ['utils', 'watch-utils']);


    
