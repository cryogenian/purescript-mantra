var gulp = require("gulp"),
    purescript = require("gulp-purescript"),
    browserify = require("gulp-browserify"),
    br = require("browserify"),
    watchify = require("watchify"),
    gutil = require("gulp-util"),
    vinyl = require('vinyl-source-stream'),
    rename = require('gulp-rename'),

    sequence = require('run-sequence'),
    fs = require('fs'),
    _ = require('lodash');

_.str = require('underscore.string');

var nodeModules = ['node_modules/**/*'];
var jsEntry = "js/src/main.js";
var jsrc = ['js/src/**/*.js'];
var pursrc = [
    'bower_components/purescript-*/src/**/*.purs',
    'src/**/*.purs'
];



gulp.task("utils", function() {
    return gulp.src(jsEntry)
        .pipe(browserify({}))
        .pipe(rename('utils.js'))
        .pipe(gulp.dest("public"));
});

gulp.task('watch-utils', function() {
    return gulp.watch(jsrc, ['utils']);
});


gulp.task('copy-nm', function() {
    return gulp.src(nodeModules)
        .pipe(gulp.dest('dist/node_modules'));
});

gulp.task('make-script', function() {
    var run = function() {
        var path = 'dist/main.js';
        var content = "require('Main').main()";
        fs.writeFileSync(path, content);
    };
    fs.stat('dist', function(err, stats) {
        if (err) {
            fs.mkdir('dist', function(err) {
                if (err) throw err;
                run();
            });
        }
        run();
    });
});

gulp.task('compile-dev', function() {
    var psc = purescript.pscMake({
        output: 'dist/node_modules'
    });
    psc.on('error', function(e) {
        console.error('\u0007');
        console.error(e.message);
        psc.end();
    });
    return gulp.src(pursrc).pipe(psc);
});

gulp.task('bundle-dev', function() {
    gulp.src('dist/main.js')
        .pipe(browserify({}))
        .pipe(rename('mantra.js'))
        .pipe(gulp.dest('public'));
});


gulp.task('make-dev', function(cb) {
    sequence('compile-dev', 'bundle-dev', cb);
});


gulp.task('watch-compile-dev', function() {
    gulp.watch(pursrc, ['make-dev']);
});


gulp.task('purs-dev', ['copy-nm', 'make-script', 'make-dev', 'watch-compile-dev']);

gulp.task('dev-utils', ['utils', 'watch-utils']);


    
gulp.task('psci', function() {
    gulp.src(pursrc) 
        .pipe(purescript.dotPsci({}));
});
