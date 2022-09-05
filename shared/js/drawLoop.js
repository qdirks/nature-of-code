// jshint esversion: 6


let frameSampleCount = 0;
let frameSampleStartTime = 0;
let frameSampleEndTime = 0;
let sampleFramesPerSecond = 0;
const framesPerSecondSampleRate = 500;
function drawLoop() {
    // gather data for the frame rate
    frameSampleCount += 1;
    frameSampleEndTime = performance.now(); // the current time measurement from the start

    // sample the frame rate
    let noCalculateFrameRate = frameSampleEndTime - frameSampleStartTime < framesPerSecondSampleRate; // doing it this way allows recovery in case of NaN in the conditional
    if (!noCalculateFrameRate) {
        let seconds = (frameSampleEndTime - frameSampleStartTime) / 1000;
        sampleFramesPerSecond = Math.round(100 * frameSampleCount / seconds)/100;
        frameSampleCount = 0;
        frameSampleEndTime = frameSampleStartTime = performance.now();
    }
    if (window.draw) window.draw();
    if (!window.noLoop) requestAnimationFrame(drawLoop);
}