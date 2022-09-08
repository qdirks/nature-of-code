// jshint esversion: 6
let walker = new Walker(cv.width / 2, cv.height / 2, 10);
function draw() {
    walker.display();
    walker.step();
}