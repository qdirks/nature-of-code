// jshint esversion: 6
let walker = new Walker(cv.width / 2, cv.height / 2, 10);
Walker.prototype.step = function() {
    let stepSize = montecarlo();
    let rx = ((Math.floor(Math.random() * 2) - 1) ? 1 : -1) * stepSize;
    let ry = ((Math.floor(Math.random() * 2) - 1) ? 1 : -1) * stepSize;
    if (this.x + rx >= cv.width) rx = -1;
    if (this.x + rx <= 0 - this.w) rx = 1;
    if (this.y + ry >= cv.height) ry = -1;
    if (this.y + ry <= 0 - this.w) ry = 1;
    this.x += rx * this.w;
    this.y += ry * this.w;
    this.stepCount += 1;
    return stepSize;
};
function montecarlo() { // The higher the number, the greater the likelihood to use it.
    let probability = Math.random();
    let number = Math.random();
    while (number < probability) number = Math.random();
    return number;
}
function montecarlo2() {
    let probability = Math.random();
    probability *= probability;
    let number = Math.random();
    while (number < probability) number = Math.random();
    return number;
}

let obj = {};
ctx.font = "25px monospace";
ctx.textAlign = 'left';
ctx.textBaseline = 'top';
function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cv.width, cv.height);
    walker.display();
    let stepSize = Math.floor(walker.step() * 10);
    obj[stepSize] = (!!obj[stepSize] ? obj[stepSize] : 0) + 1;
    ctx.fillStyle = 'white';
    for (let step in obj) {
        let x = 10;
        let y = step * 20 + 10;
        let text = step + ": " + Number(!!obj[step] ? obj[step] : 0);
        ctx.fillText(text, x, y);
    }
}