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
