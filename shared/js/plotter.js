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
global.Graph = Graph;