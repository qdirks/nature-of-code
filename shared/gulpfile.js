// jshint esversion: 6

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var crlf = require('gulp-line-ending-corrector');
var sass = require('gulp-sass')(require('sass'));

var bs = require('browser-sync');
var browserSync = bs.create();

var series = gulp.series;
var parallel = gulp.parallel;
var watch = gulp.watch;

function server() {
    let bs = browserSync.init({
        ghostMode: false, // clicks, scrolls & form input on any device mirrored to all others
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });

    // on browser:reload, display the access urls again after the reload
    bs.events.on('browser:reload', ()=>{

        // disable the openBrowser function so that a new tab doesn't open.
        let fptr = bs.utils.openBrowser;
        bs.utils.openBrowser = ()=>{};

        // emitting the service:running event will call the logUrls function
        bs.events.emit("service:running", {
            options: bs.options,
            baseDir: bs.options.getIn(["server", "baseDir"]),
            type: bs.options.get("mode"),
            port: bs.options.get("port"),
            url: bs.options.getIn(["urls", "local"]),
            urls: bs.options.get("urls").toJS(),
            tunnel: bs.options.getIn(["urls", "tunnel"])
        });

        // restore the openBrowser function in case it is needed in the future...
        bs.utils.openBrowser = fptr;

        // further logging can be done here...
    });
}

function lint() {
    return gulp.src(['./js/*.js', '!node_modules/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default', {verbose: true})); 
}

function eolc() {
    return gulp.src(['package-lock.json', 'package.json'], {allowEmpty: true})
        .pipe(crlf({eolc: 'CRLF'}))
        .pipe(gulp.dest('./'));
}

function compileSass() {
    return gulp.src(['./css/*.scss', './scss/*.scss', '!node_modules/**'])
        .pipe(sass())
        .pipe(crlf({eolc: 'CRLF'}))
        .pipe(gulp.dest('./css/'));
}

function reload(cb) {
    console.clear();
    browserSync.reload();
    cb();
}

function reloadBuildSystem() {
    process.on('SIGTERM', ()=>{
        browserSync.exit();
        browserSync.cleanup();
    });
    process.kill(process.pid, 'SIGTERM');
}

function watchFiles(cb) {
    server();
    watch(['./package-lock.json', './package.json'], eolc);
    watch(['../shared/js/**/*.js', './js/**/*.js', '!node_modules/**'], series(reload, lint));
    watch(['./css/*.scss', './scss/*.scss', '!node_modules/**'], series(compileSass, reload));
    watch(['./css/*.css', '!node_modules/**'], reload);
    watch(['./*.html', '!node_modules/**'], reload);
    watch(['../shared/**/*.js', '!../shared/js/**'], reloadBuildSystem);
    cb();
}

console.clear();
exports.watch = watchFiles;
exports.build = parallel(eolc, lint, compileSass);
exports.default = series(exports.build, exports.watch);