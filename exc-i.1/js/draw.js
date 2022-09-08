// jshint esversion: 6
let walker = new Walker(cv.width / 2, cv.height / 2, 1);
Walker.prototype.step = function() {
    let rx = Math.random() * 2 - 1;
    let ry = Math.random() * 2 - 1;
    if (Math.random() >= 0.9) { // move down and to the right
        rx = Math.random();
        ry = Math.random();
    }
    if (this.x + rx >= cv.width) rx = -1;
    if (this.x + rx <= 0 - this.w) rx = 1;
    if (this.y + ry >= cv.height) ry = -1;
    if (this.y + ry <= 0 - this.w) ry = 1;
    this.x += rx * this.w;
    this.y += ry * this.w;
    this.stepCount += 1;
};
function draw() {
    for (let ix = 0; ix < 30; ix++) {
        walker.display();
        walker.step();
    }
}