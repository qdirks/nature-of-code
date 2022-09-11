// jshint esversion: 6

var sqr = new Square(0, 200, 20);
var pvt = new Graph(20, 20, 150, 'position vs time', 't', 'x');
var vvt = new Graph(200, 20, 150, 'velocity vs time', 't', 'v');
var padRight = function(num) {
    var str = num.toString();
    var ix = str.indexOf('.');
    if (ix > -1) {
        if (str.slice(ix).length === 3) {
            return str;
        } else if (str.slice(ix).length === 2) {
            return str + '0';
        } else if (str.slice(ix).length === 1) {
            return str + '00';
        }
    } else {
        return str + '.00';
    }
};

function draw() {
    let width = cv.width;
    sqr.update(60);
    
    sqr.draw();
    
    var maxt = Math.sqrt(width * 2 / sqr.acc);
    var maxv = sqr.acc * maxt;
    
    pvt.draw(sqr.time/maxt * pvt.size, sqr.pos.x/width * pvt.size);
    vvt.draw(sqr.time/maxt * vvt.size, sqr.vec.x/maxv * vvt.size);

    ctx.save();
    ctx.translate(32, sqr.pos.y + sqr.size + 15);
    ctx.scale(1.5, 1.5);

    ctx.font = "12px monospace";
    ctx.log('time: ' + padRight(Math.floor(sqr.time * 100)/100) + ' s', 0, 1);
    ctx.log('position: ' + Math.round(sqr.pos.x) + ' px', 0, 15);
    ctx.log('velocity: ' + Math.round(sqr.vec.x)  + ' px/s', 0, 29);
    ctx.log('acceleration: ' + sqr.acc + ' px/s/s', 0, 43);
    ctx.log('average vel.: ' + Math.round(sqr.pos.x/sqr.time) + ' px/s', 0, 57);
    ctx.restore();
    
    if (sqr.pos.x > width) window.noLoop = true;
}
globalThis.draw = draw;