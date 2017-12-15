var gulp = require("gulp");
var zip = require("gulp-zip");
var del = require("del");
var install = require("gulp-install");
var runSequence = require("run-sequence");
var awsLambda = require("node-aws-lambda");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
const jasmine = require("gulp-jasmine");
let reporters = require("jasmine-reporters");


let tsProject = ts.createProject("tsconfig.json");
let _testOptions = {
    verbose: true,
    includeStackTrace: true
};

if (process.env.CIRCLE_TEST_REPORTS) {
    this._testOptions = {
        reporter: new reporters.JUnitXmlReporter({
            savePath: process.env.CIRCLE_TEST_REPORTS,
        })
    };
}

gulp.task("clean", function () {
    return del(["./built", "./dist.zip"]);
});

gulp.task("tslint", () =>
    gulp.src("src/**/*.ts")
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
);

gulp.task("tsc", function () {
    var tsResult = gulp.src(["**/*.ts", "!node_modules/**/*"])
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest("built"));
});

gulp.task("node-mods", function () {
    return gulp.src("./package.json")
        .pipe(gulp.dest("built/src"))
        .pipe(install({ production: true }));
});

gulp.task("zip", function () {
    return gulp.src(["built/src/**/*", "!built/src/package.json"])
        .pipe(zip("dist.zip"))
        .pipe(gulp.dest("./"));
});

gulp.task("upload", function (callback) {
    awsLambda.deploy("./dist.zip", require("./lambda-config.js"), callback);
});

gulp.task("runTest", function (callback) {
    return gulp.src("built/test/**/*.spec.js")
    .pipe(jasmine(_testOptions))
});

gulp.task("deploy", function (callback) {
    return runSequence(
        ["clean"],
        ["tslint"],
        ["tsc", "node-mods"],
        ["zip"],
        ["upload"],
        callback
    );
});

gulp.task("test", function (callback) {
    return runSequence(
        ["clean"],
        ["tslint"],
        ["tsc"],
        ["runTest"],
        callback
    );
});
