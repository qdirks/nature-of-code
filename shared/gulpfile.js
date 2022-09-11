// jshint esversion: 6

const gulp = require('gulp');
const series = gulp.series;
const parallel = gulp.parallel;

const crlf = require('gulp-line-ending-corrector');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass')(require('sass'));
const watchify = require('watchify');
const browserify = require('browserify');
const createVinylFile = require('vinyl-source-stream');
const glog = require('gulplog');
const assign = require('lodash.assign');
const browserSync = require('browser-sync');

const opts = assign({}, watchify.args, {
    entries: ['./js/main.js'],
    debug: true
});
const bundler = watchify(browserify(opts));
const bsInst = browserSync.create();
const noop = ()=>{};
let callback = noop;
let openNewTab = true; // allow a new tab to be opened in the browser where the project will run

function bundle(cb) {
    return bundler.bundle().on('error', ()=>{cb();})
    .pipe(createVinylFile('bundle.js')).pipe(gulp.dest('./js/dist/'));
}
function startServer(cb) {
    // cb(); // dummy - erase when done
    // return; // dummy - erase when done
    callback = cb;

    var bsInstInitObj = bsInst.init({
        ghostMode: false, // clicks, scrolls & form input on any device mirrored to all others
        server: {
            baseDir: process.cwd(), // cwd so we can see what directory is being served
            index: "index.html"
        }
    });

    const openBrowser = bsInstInitObj.utils.openBrowser;
    if (!openNewTab) bsInstInitObj.utils.openBrowser = noop;

    // on browser:reload, display the access urls again after the reload
    bsInstInitObj.events.on('browser:reload', ()=>{

        // disable the openBrowser function so that a new tab doesn't open when the service:running event is emitted
        bsInstInitObj.utils.openBrowser = noop;

        // emitting the service:running event will call the logUrls function
        let _callback = callback;
        callback = noop;
        bsInstInitObj.events.emit("service:running", {
            options: bsInstInitObj.options,
            baseDir: bsInstInitObj.options.getIn(["server", "baseDir"]),
            type: bsInstInitObj.options.get("mode"),
            port: bsInstInitObj.options.get("port"),
            url: bsInstInitObj.options.getIn(["urls", "local"]),
            urls: bsInstInitObj.options.get("urls").toJS(),
            tunnel: bsInstInitObj.options.getIn(["urls", "tunnel"])
        });

        // restore the openBrowser function in case it is needed in the future...
        bsInstInitObj.utils.openBrowser = openBrowser;
        _callback(); // signal reloadServer complete
    });

    bsInstInitObj.events.on("service:running", ()=>{
        callback();
        callback = noop;
    });
}
function reloadServer(cb) {
    bsInst.reload();
    callback = cb; // called during an on event handler
}
function lint() {
    return gulp.src(['./js/**/*.js', '!./js/dist/bundle.js', '!./node_modules/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default', {verbose: true})); 
}
function eolc() {
    return gulp.src(['../shared/package-lock.json', '../shared/package.json'])
        .pipe(crlf({eolc: 'CRLF'}))
        .pipe(gulp.dest('../shared'));
}
function transformSass() {
    return gulp.src(['./css/*.scss', './scss/*.scss', '!node_modules/**'])
        .pipe(sass())
        .pipe(crlf({eolc: 'CRLF'}))
        .pipe(gulp.dest('./css/'));
}
function disconnect() {
    process.on('SIGTERM', ()=>{
        bsInst.exit();
        bsInst.cleanup();
    });
    process.kill(process.pid, 'SIGTERM');
}
function reconnect(cb) {
    openNewTab = false;
    exports.watch(cb);
}
function watch(cb) {
    let lintReload = series(lint, reloadServer);
    let reloadBundle = series(bundle, lintReload);

    // watch end of line characters for package-lock.json and package.json
    // gulp.watch(['../shared/package-lock.json', '../shared/package.json'], eolc);

    // watch js
    gulp.watch(['../shared/js/**/*.js', './js/**/*.js', '!./js/dist/bundle.js', '!node_modules/**'], reloadBundle);

    // watch css/scss
    gulp.watch(['./css/*.scss', './scss/*.scss'], series(transformSass, lintReload));
    gulp.watch(['./css/*.css'], lintReload);

    // watch html
    gulp.watch(['./*.html'], lintReload);

    // watch build system javascript
    gulp.watch(['./**/*.js', '!./js/**', '../shared/**/*.js', '!../shared/js/**'], disconnect);

    // log bundler output
    bundler.on('log', glog.info); // output build logs to terminal

    // signal task complete
    cb();
}
function build() {
    return browserify(opts).bundle()
    .on('error', glog.error.bind(glog, 'Browserify Error'))
    .pipe(createVinylFile('bundle.js'))
    .pipe(gulp.dest('./js/dist/'));
}

exports.reconnect = reconnect;
exports.serve = startServer;
exports.watch = series(lint, parallel(transformSass, eolc, watch, startServer, bundle));
exports.default = exports.watch;
exports.build = series(transformSass, lint, build);

// TODO: begin working with undertaker, and see if there is a way for me to swap out the registered task with a new one which has console.clear injected in it.
// TODO: when the build system reconnects, also trigger a browser reload. It doesn't seem to reload after reconnecting.