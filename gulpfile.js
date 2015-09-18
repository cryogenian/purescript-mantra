"use strict";

var gulp = require("gulp"),
    purescript = require("gulp-purescript"),
    webpack = require("webpack-stream"),
    rimraf = require("rimraf");

var sources = [
    "src/**/*.purs",
    "test/src/**/*.purs",
    "bower_components/purescript-*/src/**/*.purs"
];

var foreigns = [
    "src/**/*.js",
    "test/src/**/*.js",
    "bower_components/purescript-*/src/**/*.js"
];

gulp.task("make", function() {
    return purescript.psc({
        src: sources,
        ffi: foreigns
    });
});

gulp.task("clean", function() {
    ["output", "tmp", "public/js"].forEach(function(path) { rimraf.sync(path);});
});

gulp.task("prebundle", ["make"], function() {
    return purescript.pscBundle({
        src: "output/**/*.js",
        output: "tmp/js/build.js",
        module: "Test.Main",
        main: "Test.Main"
    });
});

gulp.task("bundle", ["prebundle"], function() {
    return gulp.src("tmp/js/build.js")
        .pipe(webpack({
            resolve: {moduleDirectories: ["node_modules"]},
            output: {filename: "build.js"}
        }))
        .pipe(gulp.dest("public/js"));
});

gulp.task("watch", ["bundle"], function() {
    return gulp.watch(foreigns.concat(sources), ["bundle"]);
});

gulp.task("default", ["watch"]);
