var textBox = function(msg, x, y) {
    pushStyle();
    noStroke();
    rect(x, y, width, textAscent() + textDescent() + 2);
    textAlign(LEFT, TOP);
    fill(0);
    text(msg, x, y);
    popStyle();
};
var Square = function(x, y, size) {
    this.pos = new PVector(x, y);
    this.vec = new PVector(0, 0);
    this.size = size;
    this.acc = 100;
    this.time = 0;
};
Square.prototype.draw = function() {
    pushStyle();
    // fill(random(128, 256), random(128, 256), random(128, 256));
    fill(128, 256, 0);
    rect(this.pos.x, this.pos.y, this.size, this.size);
    popStyle();
    
};
Square.prototype.update = function(frate){
    if (this.pos.x > width) {
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

var Graph = function(x, y, size, title, xlab, ylab) {
    this.pos = new PVector(x, y);
    this.size = size;
    this.title = title;
    this.xlab = xlab;
    this.ylab = ylab;
};
Graph.prototype.draw = function(x, y) {
    
    
    line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.size);
    line(this.pos.x, this.pos.y + this.size,
         this.pos.x + this.size, this.pos.y + this.size);
    
    pushMatrix();
    translate(this.pos.x + x, this.pos.y + this.size - y);
    // scale(3);
    pushStyle();
    point(0, -1);
    // point(this.pos.x + x, this.pos.y + this.size - y);
    
    popStyle();
    popMatrix();
    
    pushStyle();
    noStroke();
    
    textAlign(LEFT, TOP);
    fill(255);
    rect(this.pos.x, this.pos.y + this.size + 2, 100, 13);
    fill(0);
    text(this.title, this.pos.x, this.pos.y + this.size);
    
    textAlign(CENTER);
    fill(255);
    rect(this.pos.x - 5, this.pos.y - 14, 10, 10);
    fill(0, 0, 0);
    text(this.ylab, this.pos.x, this.pos.y - 5);
    
    textAlign(LEFT, CENTER);
    fill(255);
    rect(this.pos.x + this.size + 1, this.pos.y + this.size + -5, 10, 10);
    fill(0);
    text(this.xlab, this.pos.x + this.size + 5, this.pos.y + this.size);
    
    
    popStyle();
};

var sqr = new Square(0, 200, 20);
var pvt = new Graph(20, 20, 150, '', 't', 'x');
var vvt = new Graph(200, 20, 150, '', 't', 'v');

var frate = 60;
frameRate(frate);

var ls = second();
var fr = frameCount;

var draw = function() {
    sqr.update(frate);
    
    sqr.draw();
    
    var maxt = sqrt(width * 2 / sqr.acc);
    var maxv = sqr.acc * maxt;
    
    pvt.draw(sqr.time/maxt * pvt.size, sqr.pos.x/width * pvt.size);
    vvt.draw(sqr.time/maxt * vvt.size, sqr.vec.x/maxv * vvt.size);
    
    pushMatrix();
    translate(32, sqr.pos.y + sqr.size + 15);
    scale(1.5);
    textBox('time: ' + padRight(floor(sqr.time * 100)/100) + ' s', 0, 1);
    textBox('position: ' + round(sqr.pos.x) + ' px', 0, 15);
    textBox('velocity: ' + round(sqr.vec.x)  + ' px/s', 0, 29);
    textBox('acceleration: ' + sqr.acc + ' px/s/s', 0, 43);
    textBox('average vel.: ' + round(sqr.pos.x/sqr.time) + ' px/s', 0, 57);
    popMatrix();
    
    // show frames per second
    if (ls !== second()) {
        textBox('fps: ' + (frameCount - fr), 337, 380);
        ls = second();
        fr = frameCount;
    }
    
    if (sqr.pos.x > width) {
        noLoop();
        // background(255);
    }
};
