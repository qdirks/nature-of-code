// jshint esversion: 6
let walker = new Walker(cv.width / 2, cv.height / 2, 10);
Walker.prototype.step = function() {
    let stepsize = montecarlo();
    let rx = ((Math.floor(Math.random() * 2) - 1) ? 1 : -1) * stepsize;
    let ry = ((Math.floor(Math.random() * 2) - 1) ? 1 : -1) * stepsize;
    if (this.x + rx >= cv.width) rx = -1;
    if (this.x + rx <= 0 - this.w) rx = 1;
    if (this.y + ry >= cv.height) ry = -1;
    if (this.y + ry <= 0 - this.w) ry = 1;
    this.x += rx * this.w;
    this.y += ry * this.w;
    this.stepCount += 1;
};
function montecarlo() {
    while (true) {
        let r1 = Math.random();
        let probability = r1;
        let r2 = Math.random();
        if (r2 < probability) return r1;
    }
}
function draw() {
    walker.display();
    walker.step();
}