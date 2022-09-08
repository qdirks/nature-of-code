// jshint esversion: 6

let walker = new Walker(cv.width / 2, cv.height / 2, 2);
Walker.prototype.step = function() {
    let rx = Math.random() * 2 - 1;
    let ry = Math.random() * 2 - 1;
    if (TTM && Math.random() < 0.3) { // move towards the mouse
        const helper = (pm, p)=>{
            if (pm - p > 0) return Math.random();
            else if (pm - p < 0) return Math.random() * -1;
        };
        rx = helper(mouseX, this.x);
        ry = helper(mouseY, this.y);
        if (Math.abs(mouseX - this.x) > Math.abs(mouseY - this.y)) {
            ry = Math.random() * 2 - 1;
        } else if (Math.abs(mouseX - this.x) > Math.abs(mouseY - this.y)) {
            rx = Math.random() * 2 - 1;
        }
    }
    if (this.x + rx >= cv.width) rx = -1;
    if (this.x + rx <= 0 - this.w) rx = 1;
    if (this.y + ry >= cv.height) ry = -1;
    if (this.y + ry <= 0 - this.w) ry = 1;
    this.x += rx * this.w;
    this.y += ry * this.w;
    this.stepCount += 1;
};
function draw() {
    // template: your code here
    walker.display();
    walker.step();
}
let TTM = false; // tend towards mouse
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