// jshint esversion: 6
/**
 * 
 * @param {string} text 
 * @param {number} x
 * @param {number} y
 * @param {number} padding
 */
 function ctxLog(text='', x=0, y=0, padding=5) {
    // protections
    ctx.save();
    ctx.beginPath();

    // font setup
    ctx.font = "20px monospace";
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    let metrics = ctx.measureText(text);
    ctx.fillStyle = 'white';

    // make the contrast box
    let left = x - padding;
    let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    let textWidth = metrics.width;
    let right = left + padding + textWidth + padding;
    let boxWidth = right - left;
    let top = y - padding;
    let bottom = top + padding + textHeight + padding;
    let boxHeight = bottom - top;
    ctx.fillRect(left, top, boxWidth, boxHeight);
    ctx.rect(left, top, boxWidth, boxHeight);
    ctx.lineWidth = padding;
    ctx.strokeStyle = 'red';
    ctx.stroke();

    // write the text on top of the contrast box
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
    ctx.restore();
}
ctx.log = ctxLog;