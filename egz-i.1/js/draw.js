// jshint esversion: 6
let walker = new Walker(cv.width / 2, cv.height / 2, 1);
Walker.prototype.step = function() { // 4 possible choices
    let choice = Math.floor(Math.random() * 4);
    let rx = 0;
    let ry = 0;
    if (choice === 0) rx++;
    else if (choice === 1) rx--;
    else if (choice === 2) ry++;
    else ry--;
    if (this.x + rx >= cv.width) rx = -1;
    if (this.x + rx <= 0 - this.w) rx = 1;
    if (this.y + ry >= cv.height) ry = -1;
    if (this.y + ry <= 0 - this.w) ry = 1;
    this.x += rx * this.w;
    this.y += ry * this.w;
    this.stepCount += 1;
};
Walker.prototype.step2 = function() { // 9 possible choices
    let rx = Math.floor(Math.random() * 3) - 1;
    let ry = Math.floor(Math.random() * 3) - 1;
    if (this.x + rx >= cv.width) rx = -1;
    if (this.x + rx <= 0 - this.w) rx = 1;
    if (this.y + ry >= cv.height) ry = -1;
    if (this.y + ry <= 0 - this.w) ry = 1;
    this.x += rx * this.w;
    this.y += ry * this.w;
    this.stepCount += 1;
};
Walker.prototype.step3 = function() { // arbitrary step direction and length
    let rx = Math.random() * 2 - 1;
    let ry = Math.random() * 2 - 1;
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
        walker.step3();
    }
}