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