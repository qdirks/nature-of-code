(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
require("./shared/setup");
require("./shared/ctxlog");
require("./shared/plotter");
require("./shared/vector");
require("./square");
require("./draw2");
require("./shared/drawLoop");
window.drawLoop();
},{"./draw2":1,"./shared/ctxlog":4,"./shared/drawLoop":5,"./shared/plotter":6,"./shared/setup":7,"./shared/vector":8,"./square":3}],3:[function(require,module,exports){
var Square = function(x, y, size) {
    this.pos = new Vector(x, y);
    this.vec = new Vector(0, 0);
    this.size = size;
    this.acc = 1800;
    this.time = 0;
};
Square.prototype.draw = function() {
    ctx.save();
    ctx.fillStyle = 'rgb(128, 256, 0)';
    ctx.strokeStyle = 'black';
    ctx.rect(this.pos.x, this.pos.y, this.size, this.size);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
};
Square.prototype.update = function(frate){
    if (this.pos.x > cv.width) {
        this.pos.x = 0;
        this.vec.x = 0;
        this.time = 0;
    }
    
    if (this.time > 0) {
        this.vec.x += this.acc/(frate || 60);
        this.pos.x += this.vec.x/(frate || 60);
    }
    
    this.time += 1/frate;
};
globalThis.Square = Square;
},{}],4:[function(require,module,exports){
// jshint esversion: 6
/**
 * 
 * @param {string} text 
 * @param {number} x
 * @param {number} y
 * @param {number} padding
 */
function ctxLog(text='', x=0, y=0, padding=1) {
    // protections
    ctx.save();
    ctx.beginPath();

    // font setup
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    let metrics = ctx.measureText(text);
    ctx.fillStyle = 'white';

    // make the contrast box
    let left = x - padding;
    let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    let textWidth = metrics.width;
    let right = left + padding + textWidth + padding;
    let boxWidth = right - left;
    let top = y - padding;
    let bottom = top + padding + textHeight + padding;
    let boxHeight = bottom - top;
    ctx.fillRect(left, top, boxWidth, boxHeight);
    ctx.rect(left, top, boxWidth, boxHeight);
    ctx.lineWidth = padding;
    ctx.strokeStyle = 'red';
    ctx.stroke();

    // write the text on top of the contrast box
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
    ctx.restore();
}
ctx.log = ctxLog;
},{}],5:[function(require,module,exports){
// jshint esversion: 6

let frameSampleCount = 0;
let frameSampleStartTime = 0;
let frameSampleEndTime = 0;
let sampleFramesPerSecond = 0;
const framesPerSecondSampleRate = 500;
function drawLoop() {
    // gather data for the frame rate
    frameSampleCount += 1;
    frameSampleEndTime = performance.now(); // the current time measurement from the start

    // sample the frame rate
    let noCalculateFrameRate = frameSampleEndTime - frameSampleStartTime < framesPerSecondSampleRate; // doing it this way allows recovery in case of NaN in the conditional
    if (!noCalculateFrameRate) {
        let seconds = (frameSampleEndTime - frameSampleStartTime) / 1000;
        sampleFramesPerSecond = Math.round(100 * frameSampleCount / seconds)/100;
        frameSampleCount = 0;
        frameSampleEndTime = frameSampleStartTime = performance.now();
    }
    if (window.draw) window.draw();
    if (!window.noLoop) requestAnimationFrame(drawLoop);
}
globalThis.drawLoop = drawLoop;
},{}],6:[function(require,module,exports){
// jshint esversion: 6
const Graph = function(x, y, size, title, xlab, ylab) {
    this.pos = new Vector(x, y);
    this.size = size;
    this.title = title;
    this.xlab = xlab;
    this.ylab = ylab;
};
function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
function point(x, y, r=0.5) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
    ctx.fill();
}
Graph.prototype.draw = function(x, y) {
    line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.size);
    line(this.pos.x, this.pos.y + this.size,
         this.pos.x + this.size, this.pos.y + this.size);

    ctx.save();
    ctx.translate(this.pos.x + x, this.pos.y + this.size - y);
    point(0, -1);
    ctx.restore();
    
    ctx.save();
    // title
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'white';
    let px, py, w, h;
    px = this.pos.x;
    py = this.pos.y + this.size + 2;
    w = 100;
    h = 13;
    ctx.fillRect(px, py, w, h);
    ctx.fillStyle = 'black';
    ctx.fillText(this.title, px, py);

    // y label
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    px = this.pos.x;
    py = this.pos.y - 10;
    w = 10;
    h = 10;
    ctx.fillRect(px, py, w, h);
    ctx.fillStyle = 'black';
    ctx.fillText(this.ylab, px, py);

    // x label
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillRect(this.pos.x + this.size + 1, this.pos.y + this.size + -5, 10, 10);
    ctx.fillStyle = 'black';
    ctx.fillText(this.xlab, this.pos.x + this.size + 5, this.pos.y + this.size);

    ctx.restore();
};
globalThis.Graph = Graph;
},{}],7:[function(require,module,exports){
// jshint esversion: 6
const cv = document.createElement('canvas');
cv.style.border = '1px solid white';
cv.width = 650;
cv.height = 650;
document.body.append(cv);
const ctx = cv.getContext('2d');
globalThis.ctx = ctx;
globalThis.cv = cv;
},{}],8:[function(require,module,exports){
// jshint esversion: 6
class Vector {
    constructor(x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * 
     * @param {Vector} vector 
     */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }
    /**
     * 
     * @param {Vector} vector 
     */
    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
    }
    /**
     * @param {number} scalar
     */
    mul(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }
    /**
     * @param {number} scalar
     */
    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
    }
    revx() {this.x = -this.x;}
    revy() {this.y = -this.y;}
    revz() {this.z = -this.z;}
    rev() {
        this.revx();
        this.revy();
        this.revz();
    }
}
globalThis.Vector = Vector;
},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NoYXJlZC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvZHJhdzIuanMiLCJqcy9tYWluLmpzIiwianMvc3F1YXJlLmpzIiwiLi4vc2hhcmVkL2pzL2N0eGxvZy5qcyIsIi4uL3NoYXJlZC9qcy9kcmF3TG9vcC5qcyIsIi4uL3NoYXJlZC9qcy9wbG90dGVyLmpzIiwiLi4vc2hhcmVkL2pzL3NldHVwLmpzIiwiLi4vc2hhcmVkL2pzL3ZlY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8ganNoaW50IGVzdmVyc2lvbjogNlxyXG5cclxudmFyIHNxciA9IG5ldyBTcXVhcmUoMCwgMjAwLCAyMCk7XHJcbnZhciBwdnQgPSBuZXcgR3JhcGgoMjAsIDIwLCAxNTAsICdwb3NpdGlvbiB2cyB0aW1lJywgJ3QnLCAneCcpO1xyXG52YXIgdnZ0ID0gbmV3IEdyYXBoKDIwMCwgMjAsIDE1MCwgJ3ZlbG9jaXR5IHZzIHRpbWUnLCAndCcsICd2Jyk7XHJcbnZhciBwYWRSaWdodCA9IGZ1bmN0aW9uKG51bSkge1xyXG4gICAgdmFyIHN0ciA9IG51bS50b1N0cmluZygpO1xyXG4gICAgdmFyIGl4ID0gc3RyLmluZGV4T2YoJy4nKTtcclxuICAgIGlmIChpeCA+IC0xKSB7XHJcbiAgICAgICAgaWYgKHN0ci5zbGljZShpeCkubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdHIuc2xpY2UoaXgpLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJzAnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RyLnNsaWNlKGl4KS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0ciArICcwMCc7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc3RyICsgJy4wMCc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBkcmF3KCkge1xyXG4gICAgbGV0IHdpZHRoID0gY3Yud2lkdGg7XHJcbiAgICBzcXIudXBkYXRlKDYwKTtcclxuICAgIFxyXG4gICAgc3FyLmRyYXcoKTtcclxuICAgIFxyXG4gICAgdmFyIG1heHQgPSBNYXRoLnNxcnQod2lkdGggKiAyIC8gc3FyLmFjYyk7XHJcbiAgICB2YXIgbWF4diA9IHNxci5hY2MgKiBtYXh0O1xyXG4gICAgXHJcbiAgICBwdnQuZHJhdyhzcXIudGltZS9tYXh0ICogcHZ0LnNpemUsIHNxci5wb3MueC93aWR0aCAqIHB2dC5zaXplKTtcclxuICAgIHZ2dC5kcmF3KHNxci50aW1lL21heHQgKiB2dnQuc2l6ZSwgc3FyLnZlYy54L21heHYgKiB2dnQuc2l6ZSk7XHJcblxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC50cmFuc2xhdGUoMzIsIHNxci5wb3MueSArIHNxci5zaXplICsgMTUpO1xyXG4gICAgY3R4LnNjYWxlKDEuNSwgMS41KTtcclxuXHJcbiAgICBjdHguZm9udCA9IFwiMTJweCBtb25vc3BhY2VcIjtcclxuICAgIGN0eC5sb2coJ3RpbWU6ICcgKyBwYWRSaWdodChNYXRoLmZsb29yKHNxci50aW1lICogMTAwKS8xMDApICsgJyBzJywgMCwgMSk7XHJcbiAgICBjdHgubG9nKCdwb3NpdGlvbjogJyArIE1hdGgucm91bmQoc3FyLnBvcy54KSArICcgcHgnLCAwLCAxNSk7XHJcbiAgICBjdHgubG9nKCd2ZWxvY2l0eTogJyArIE1hdGgucm91bmQoc3FyLnZlYy54KSAgKyAnIHB4L3MnLCAwLCAyOSk7XHJcbiAgICBjdHgubG9nKCdhY2NlbGVyYXRpb246ICcgKyBzcXIuYWNjICsgJyBweC9zL3MnLCAwLCA0Myk7XHJcbiAgICBjdHgubG9nKCdhdmVyYWdlIHZlbC46ICcgKyBNYXRoLnJvdW5kKHNxci5wb3MueC9zcXIudGltZSkgKyAnIHB4L3MnLCAwLCA1Nyk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgXHJcbiAgICBpZiAoc3FyLnBvcy54ID4gd2lkdGgpIHdpbmRvdy5ub0xvb3AgPSB0cnVlO1xyXG59XHJcbmdsb2JhbFRoaXMuZHJhdyA9IGRyYXc7IiwicmVxdWlyZShcIi4vc2hhcmVkL3NldHVwXCIpO1xyXG5yZXF1aXJlKFwiLi9zaGFyZWQvY3R4bG9nXCIpO1xyXG5yZXF1aXJlKFwiLi9zaGFyZWQvcGxvdHRlclwiKTtcclxucmVxdWlyZShcIi4vc2hhcmVkL3ZlY3RvclwiKTtcclxucmVxdWlyZShcIi4vc3F1YXJlXCIpO1xyXG5yZXF1aXJlKFwiLi9kcmF3MlwiKTtcclxucmVxdWlyZShcIi4vc2hhcmVkL2RyYXdMb29wXCIpO1xyXG53aW5kb3cuZHJhd0xvb3AoKTsiLCJ2YXIgU3F1YXJlID0gZnVuY3Rpb24oeCwgeSwgc2l6ZSkge1xyXG4gICAgdGhpcy5wb3MgPSBuZXcgVmVjdG9yKHgsIHkpO1xyXG4gICAgdGhpcy52ZWMgPSBuZXcgVmVjdG9yKDAsIDApO1xyXG4gICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgIHRoaXMuYWNjID0gMTgwMDtcclxuICAgIHRoaXMudGltZSA9IDA7XHJcbn07XHJcblNxdWFyZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSAncmdiKDEyOCwgMjU2LCAwKSc7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgY3R4LnJlY3QodGhpcy5wb3MueCwgdGhpcy5wb3MueSwgdGhpcy5zaXplLCB0aGlzLnNpemUpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5zdHJva2UoKTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICBcclxufTtcclxuU3F1YXJlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihmcmF0ZSl7XHJcbiAgICBpZiAodGhpcy5wb3MueCA+IGN2LndpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5wb3MueCA9IDA7XHJcbiAgICAgICAgdGhpcy52ZWMueCA9IDA7XHJcbiAgICAgICAgdGhpcy50aW1lID0gMDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHRoaXMudGltZSA+IDApIHtcclxuICAgICAgICB0aGlzLnZlYy54ICs9IHRoaXMuYWNjLyhmcmF0ZSB8fCA2MCk7XHJcbiAgICAgICAgdGhpcy5wb3MueCArPSB0aGlzLnZlYy54LyhmcmF0ZSB8fCA2MCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMudGltZSArPSAxL2ZyYXRlO1xyXG59O1xyXG5nbG9iYWxUaGlzLlNxdWFyZSA9IFNxdWFyZTsiLCIvLyBqc2hpbnQgZXN2ZXJzaW9uOiA2XHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYWRkaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBjdHhMb2codGV4dD0nJywgeD0wLCB5PTAsIHBhZGRpbmc9MSkge1xyXG4gICAgLy8gcHJvdGVjdGlvbnNcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgLy8gZm9udCBzZXR1cFxyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9ICdsZWZ0JztcclxuICAgIGxldCBtZXRyaWNzID0gY3R4Lm1lYXN1cmVUZXh0KHRleHQpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcblxyXG4gICAgLy8gbWFrZSB0aGUgY29udHJhc3QgYm94XHJcbiAgICBsZXQgbGVmdCA9IHggLSBwYWRkaW5nO1xyXG4gICAgbGV0IHRleHRIZWlnaHQgPSBtZXRyaWNzLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50ICsgbWV0cmljcy5hY3R1YWxCb3VuZGluZ0JveERlc2NlbnQ7XHJcbiAgICBsZXQgdGV4dFdpZHRoID0gbWV0cmljcy53aWR0aDtcclxuICAgIGxldCByaWdodCA9IGxlZnQgKyBwYWRkaW5nICsgdGV4dFdpZHRoICsgcGFkZGluZztcclxuICAgIGxldCBib3hXaWR0aCA9IHJpZ2h0IC0gbGVmdDtcclxuICAgIGxldCB0b3AgPSB5IC0gcGFkZGluZztcclxuICAgIGxldCBib3R0b20gPSB0b3AgKyBwYWRkaW5nICsgdGV4dEhlaWdodCArIHBhZGRpbmc7XHJcbiAgICBsZXQgYm94SGVpZ2h0ID0gYm90dG9tIC0gdG9wO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnQsIHRvcCwgYm94V2lkdGgsIGJveEhlaWdodCk7XHJcbiAgICBjdHgucmVjdChsZWZ0LCB0b3AsIGJveFdpZHRoLCBib3hIZWlnaHQpO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IHBhZGRpbmc7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmVkJztcclxuICAgIGN0eC5zdHJva2UoKTtcclxuXHJcbiAgICAvLyB3cml0ZSB0aGUgdGV4dCBvbiB0b3Agb2YgdGhlIGNvbnRyYXN0IGJveFxyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XHJcbiAgICBjdHguZmlsbFRleHQodGV4dCwgeCwgeSk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG59XHJcbmN0eC5sb2cgPSBjdHhMb2c7IiwiLy8ganNoaW50IGVzdmVyc2lvbjogNlxyXG5cclxubGV0IGZyYW1lU2FtcGxlQ291bnQgPSAwO1xyXG5sZXQgZnJhbWVTYW1wbGVTdGFydFRpbWUgPSAwO1xyXG5sZXQgZnJhbWVTYW1wbGVFbmRUaW1lID0gMDtcclxubGV0IHNhbXBsZUZyYW1lc1BlclNlY29uZCA9IDA7XHJcbmNvbnN0IGZyYW1lc1BlclNlY29uZFNhbXBsZVJhdGUgPSA1MDA7XHJcbmZ1bmN0aW9uIGRyYXdMb29wKCkge1xyXG4gICAgLy8gZ2F0aGVyIGRhdGEgZm9yIHRoZSBmcmFtZSByYXRlXHJcbiAgICBmcmFtZVNhbXBsZUNvdW50ICs9IDE7XHJcbiAgICBmcmFtZVNhbXBsZUVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTsgLy8gdGhlIGN1cnJlbnQgdGltZSBtZWFzdXJlbWVudCBmcm9tIHRoZSBzdGFydFxyXG5cclxuICAgIC8vIHNhbXBsZSB0aGUgZnJhbWUgcmF0ZVxyXG4gICAgbGV0IG5vQ2FsY3VsYXRlRnJhbWVSYXRlID0gZnJhbWVTYW1wbGVFbmRUaW1lIC0gZnJhbWVTYW1wbGVTdGFydFRpbWUgPCBmcmFtZXNQZXJTZWNvbmRTYW1wbGVSYXRlOyAvLyBkb2luZyBpdCB0aGlzIHdheSBhbGxvd3MgcmVjb3ZlcnkgaW4gY2FzZSBvZiBOYU4gaW4gdGhlIGNvbmRpdGlvbmFsXHJcbiAgICBpZiAoIW5vQ2FsY3VsYXRlRnJhbWVSYXRlKSB7XHJcbiAgICAgICAgbGV0IHNlY29uZHMgPSAoZnJhbWVTYW1wbGVFbmRUaW1lIC0gZnJhbWVTYW1wbGVTdGFydFRpbWUpIC8gMTAwMDtcclxuICAgICAgICBzYW1wbGVGcmFtZXNQZXJTZWNvbmQgPSBNYXRoLnJvdW5kKDEwMCAqIGZyYW1lU2FtcGxlQ291bnQgLyBzZWNvbmRzKS8xMDA7XHJcbiAgICAgICAgZnJhbWVTYW1wbGVDb3VudCA9IDA7XHJcbiAgICAgICAgZnJhbWVTYW1wbGVFbmRUaW1lID0gZnJhbWVTYW1wbGVTdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIH1cclxuICAgIGlmICh3aW5kb3cuZHJhdykgd2luZG93LmRyYXcoKTtcclxuICAgIGlmICghd2luZG93Lm5vTG9vcCkgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXdMb29wKTtcclxufVxyXG5nbG9iYWxUaGlzLmRyYXdMb29wID0gZHJhd0xvb3A7IiwiLy8ganNoaW50IGVzdmVyc2lvbjogNlxyXG5jb25zdCBHcmFwaCA9IGZ1bmN0aW9uKHgsIHksIHNpemUsIHRpdGxlLCB4bGFiLCB5bGFiKSB7XHJcbiAgICB0aGlzLnBvcyA9IG5ldyBWZWN0b3IoeCwgeSk7XHJcbiAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgdGhpcy54bGFiID0geGxhYjtcclxuICAgIHRoaXMueWxhYiA9IHlsYWI7XHJcbn07XHJcbmZ1bmN0aW9uIGxpbmUoeDEsIHkxLCB4MiwgeTIpIHtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcclxuICAgIGN0eC5saW5lVG8oeDIsIHkyKTtcclxuICAgIGN0eC5zdHJva2UoKTtcclxufVxyXG5mdW5jdGlvbiBwb2ludCh4LCB5LCByPTAuNSkge1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmVsbGlwc2UoeCwgeSwgciwgciwgMCwgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxufVxyXG5HcmFwaC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgIGxpbmUodGhpcy5wb3MueCwgdGhpcy5wb3MueSwgdGhpcy5wb3MueCwgdGhpcy5wb3MueSArIHRoaXMuc2l6ZSk7XHJcbiAgICBsaW5lKHRoaXMucG9zLngsIHRoaXMucG9zLnkgKyB0aGlzLnNpemUsXHJcbiAgICAgICAgIHRoaXMucG9zLnggKyB0aGlzLnNpemUsIHRoaXMucG9zLnkgKyB0aGlzLnNpemUpO1xyXG5cclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHgudHJhbnNsYXRlKHRoaXMucG9zLnggKyB4LCB0aGlzLnBvcy55ICsgdGhpcy5zaXplIC0geSk7XHJcbiAgICBwb2ludCgwLCAtMSk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgXHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgLy8gdGl0bGVcclxuICAgIGN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gJ3RvcCc7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgIGxldCBweCwgcHksIHcsIGg7XHJcbiAgICBweCA9IHRoaXMucG9zLng7XHJcbiAgICBweSA9IHRoaXMucG9zLnkgKyB0aGlzLnNpemUgKyAyO1xyXG4gICAgdyA9IDEwMDtcclxuICAgIGggPSAxMztcclxuICAgIGN0eC5maWxsUmVjdChweCwgcHksIHcsIGgpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XHJcbiAgICBjdHguZmlsbFRleHQodGhpcy50aXRsZSwgcHgsIHB5KTtcclxuXHJcbiAgICAvLyB5IGxhYmVsXHJcbiAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgIHB4ID0gdGhpcy5wb3MueDtcclxuICAgIHB5ID0gdGhpcy5wb3MueSAtIDEwO1xyXG4gICAgdyA9IDEwO1xyXG4gICAgaCA9IDEwO1xyXG4gICAgY3R4LmZpbGxSZWN0KHB4LCBweSwgdywgaCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuICAgIGN0eC5maWxsVGV4dCh0aGlzLnlsYWIsIHB4LCBweSk7XHJcblxyXG4gICAgLy8geCBsYWJlbFxyXG4gICAgY3R4LnRleHRBbGlnbiA9ICdsZWZ0JztcclxuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcclxuICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zLnggKyB0aGlzLnNpemUgKyAxLCB0aGlzLnBvcy55ICsgdGhpcy5zaXplICsgLTUsIDEwLCAxMCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuICAgIGN0eC5maWxsVGV4dCh0aGlzLnhsYWIsIHRoaXMucG9zLnggKyB0aGlzLnNpemUgKyA1LCB0aGlzLnBvcy55ICsgdGhpcy5zaXplKTtcclxuXHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG59O1xyXG5nbG9iYWxUaGlzLkdyYXBoID0gR3JhcGg7IiwiLy8ganNoaW50IGVzdmVyc2lvbjogNlxyXG5jb25zdCBjdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5jdi5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkIHdoaXRlJztcclxuY3Yud2lkdGggPSA2NTA7XHJcbmN2LmhlaWdodCA9IDY1MDtcclxuZG9jdW1lbnQuYm9keS5hcHBlbmQoY3YpO1xyXG5jb25zdCBjdHggPSBjdi5nZXRDb250ZXh0KCcyZCcpO1xyXG5nbG9iYWxUaGlzLmN0eCA9IGN0eDtcclxuZ2xvYmFsVGhpcy5jdiA9IGN2OyIsIi8vIGpzaGludCBlc3ZlcnNpb246IDZcclxuY2xhc3MgVmVjdG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHg9MCwgeT0wLCB6PTApIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy56ID0gejtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge1ZlY3Rvcn0gdmVjdG9yIFxyXG4gICAgICovXHJcbiAgICBhZGQodmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy54ICs9IHZlY3Rvci54O1xyXG4gICAgICAgIHRoaXMueSArPSB2ZWN0b3IueTtcclxuICAgICAgICB0aGlzLnogKz0gdmVjdG9yLno7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtWZWN0b3J9IHZlY3RvciBcclxuICAgICAqL1xyXG4gICAgc3ViKHZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMueCAtPSB2ZWN0b3IueDtcclxuICAgICAgICB0aGlzLnkgLT0gdmVjdG9yLnk7XHJcbiAgICAgICAgdGhpcy56IC09IHZlY3Rvci56O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2NhbGFyXHJcbiAgICAgKi9cclxuICAgIG11bChzY2FsYXIpIHtcclxuICAgICAgICB0aGlzLnggKj0gc2NhbGFyO1xyXG4gICAgICAgIHRoaXMueSAqPSBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy56ICo9IHNjYWxhcjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNjYWxhclxyXG4gICAgICovXHJcbiAgICBkaXYoc2NhbGFyKSB7XHJcbiAgICAgICAgdGhpcy54IC89IHNjYWxhcjtcclxuICAgICAgICB0aGlzLnkgLz0gc2NhbGFyO1xyXG4gICAgICAgIHRoaXMueiAvPSBzY2FsYXI7XHJcbiAgICB9XHJcbiAgICByZXZ4KCkge3RoaXMueCA9IC10aGlzLng7fVxyXG4gICAgcmV2eSgpIHt0aGlzLnkgPSAtdGhpcy55O31cclxuICAgIHJldnooKSB7dGhpcy56ID0gLXRoaXMuejt9XHJcbiAgICByZXYoKSB7XHJcbiAgICAgICAgdGhpcy5yZXZ4KCk7XHJcbiAgICAgICAgdGhpcy5yZXZ5KCk7XHJcbiAgICAgICAgdGhpcy5yZXZ6KCk7XHJcbiAgICB9XHJcbn1cclxuZ2xvYmFsVGhpcy5WZWN0b3IgPSBWZWN0b3I7Il19
