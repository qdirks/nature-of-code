// jshint esversion: 6

let num = 20;
let randomCounts = new Array(num);
for (let ix = 0; ix < randomCounts.length; ix++) randomCounts[ix] = 0;
let barWidth = Math.floor(cv.width / randomCounts.length);

function draw() {
    ctx.save();
    ctx.translate(0.5, 0);

    // background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, cv.width, cv.height);

    // select a random index
    let index = Math.floor(Math.random() * num);
    randomCounts[index]++;

    ctx.beginPath();
    
    for (let ix = 0; ix < randomCounts.length; ix++) {
        let x = ix * barWidth;
        let height = randomCounts[ix];
        let y = cv.height - height;
        let width = barWidth - 1;
        ctx.rect(x, y, width, height);
    }

    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'gray';
    ctx.fill();

    if (randomCounts.find(num=>cv.height - num <= 0)) {
        window.noLoop = true;
        console.log("simulation ended");
    }

    ctx.restore();
}