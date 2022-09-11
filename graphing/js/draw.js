// jshint esversion: 6

let num = 100;
let randomCounts = new Array(num);
for (let ix = 0; ix < randomCounts.length; ix++) randomCounts[ix] = 0;
let barWidth = Math.floor(cv.width / randomCounts.length);
function smooth() {
    let probability = Math.random();
    let number = Math.random();
    while (number < probability) number = Math.random();
    return number;
}
function smooth2() {
    let probability = Math.random();
    probability *= probability;
    let number = Math.random();
    while (number < probability) number = Math.random();
    return number;
}
function smooth3() {
    let probability = Math.random();
    probability *= probability * probability;
    let number = Math.random();
    while (number < probability) number = Math.random();
    return number;
}
function smooth4() {
    let probability = Math.sqrt(Math.random());
    let number = Math.random();
    while (number < probability) number = Math.random();
    return number;
}
function squared() { // a squared distribution
    let number = Math.random();
    number *= number;
    return 1 - number;
}
function linear() { // a linear distribution
    let number = Math.sqrt(Math.random());
    return number;
}
function getRandom() {
    // return Math.floor(Math.random() * num);
    return Math.floor(smooth4() * num);
}
function draw() {
    ctx.save();
    ctx.translate(0.5, 0);

    // background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, cv.width, cv.height);

    // select a random index
    for (let ix = 0; ix < 10000; ix++) {
        let index = getRandom();
        randomCounts[index]++;
    }

    ctx.beginPath();
    
    let offset = 50;
    for (let ix = 0; ix < randomCounts.length; ix++) {
        let x = ix * barWidth;
        let height = randomCounts[ix] / offset;
        let y = cv.height - height;
        let width = barWidth - 1;
        ctx.rect(x, y, width, height);
    }

    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'gray';
    ctx.fill();

    if (randomCounts.find(num=>cv.height - num/offset <= 0)) {
        window.noLoop = true;
        console.log("simulation ended");
    }

    ctx.restore();
}
globalThis.draw = draw;