// jshint esversion: 6
let walker = new Walker(cv.width / 2, cv.height / 2, 1);
function draw() {
    for (let ix = 0; ix < 30; ix++) {
        walker.display();
        walker.step4();
    }
}