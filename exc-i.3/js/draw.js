// jshint esversion: 6

let walker = new Walker(cv.width / 2, cv.height / 2, 2);
function draw() {
    // template: your code here
    walker.display();
    walker.step5();
}
let TTM; // tend towards mouse
cv.addEventListener('mouseenter', ev=>{
    TTM = true;
});
cv.addEventListener('mouseleave', ev=>{
    TTM = false;
});
let mouseX, mouseY;
cv.addEventListener('mousemove', ev=>{
    mouseX = ev.clientX;
    mouseY = ev.clientY;
});