// jshint esversion: 6
let walker = new Walker(cv.width / 2, cv.height / 2, 20);
Walker.prototype.step = function() {
    // choose a step size
    let sd = 0.5 * this.w; // standard deviation
    let mean = this.w; // average step size
    let stepSizeX = nextG() * sd + mean;
    let stepSizeY = nextG() * sd + mean;

    // pick a direction
    let xdir = Math.floor(Math.random() * 3) - 1;
    let ydir = Math.floor(Math.random() * 3) - 1;

    let newX = stepSizeX * xdir;
    let newY = stepSizeY * ydir;

    if (this.x + newX >= cv.width || this.x + newX + this.w <= 0) newX = -newX;
    if (this.y + newY >= cv.height || this.y + newY + this.w <= 0) newY = -newY;

    this.x += newX;
    this.y += newY;
    this.stepCount += 1;
};
function draw() {
    // for (let ix = 0; ix < 1; ix++) {
        walker.display();
        walker.step();
    // }
}