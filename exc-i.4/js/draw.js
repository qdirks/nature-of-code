// jshint esversion: 6
function draw() {
    for (let ix = 0; ix < 3000; ix++) {
        let x = nextG() * 108 + cv.width / 2;
        let y = nextG() * 108 + cv.height / 2;
        let a = cv.width/2 - x;
        let b = cv.height/2 - y;
        let c = Math.sqrt(a*a + b*b);
        ctx.fillStyle = `hsla(${c * 1.1 - nextG() * 4}, 100%, 50%)`;
        ctx.beginPath();
        ctx.ellipse(x, y, 2, 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.log("fps: " + sampleFramesPerSecond, 10, 10);
}