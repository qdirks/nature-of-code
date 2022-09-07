// jshint esversion: 6
let walker = new Walker(cv.width / 2, cv.height / 2, 2);
function draw() {
    for (let ix = 0; ix < 100; ix++) {
        walker.display();
        walker.step6();
    }
}