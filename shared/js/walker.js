// jshint esversion: 6
class Walker {
    constructor(x=0, y=0, width=1) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.stepCount = 0;
    }
    display() {
        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.rect(this.x, this.y, this.w, this.w);
        ctx.fill();
        ctx.restore();
    }
    step() {
        let rx = Math.random() * 2 - 1;
        let ry = Math.random() * 2 - 1;
        if (this.x + rx >= cv.width) rx = -1;
        if (this.x + rx <= 0 - this.w) rx = 1;
        if (this.y + ry >= cv.height) ry = -1;
        if (this.y + ry <= 0 - this.w) ry = 1;
        this.x += rx * this.w;
        this.y += ry * this.w;
        this.stepCount += 1;
    }
}