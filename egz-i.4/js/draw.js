// jshint esversion: 6
cv.width = 640;
cv.height = 360;
function draw() {
    let num = nextG();
    let sd = 60;
    let mean = cv.width / 2;
    let x = sd * num + mean;
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    ctx.ellipse(x, 180, 16, 16, 0, 0, Math.PI * 2);
    ctx.fill();
}
let nextNextG;
let haveNextG = false;
function nextG() {
    if (haveNextG) {
        haveNextG = false;
        return nextNextG;
    } else {
        let v1, v2, s;
        do {
            v1 = 2 * Math.random() - 1;
            v2 = 2 * Math.random() - 1;
            s = v1 * v1 + v2 * v2;
        } while (s >= 1 || s === 0);
        let multiplier = Math.sqrt(-2 * Math.log(s) / s);
        nextNextG = v2 * multiplier;
        haveNextG = true;
        return v1 * multiplier;
    }
}