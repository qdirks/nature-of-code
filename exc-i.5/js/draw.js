// jshint esversion: 6
let walker = new Walker(cv.width / 2, cv.height / 2, 20);
function draw() {
    // for (let ix = 0; ix < 1; ix++) {
        walker.display();
        walker.step6();
    // }
}