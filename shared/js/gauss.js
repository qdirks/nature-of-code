// jshint esversion: 6

let nextNextG;
let haveNextG = false;
function nextG() {
    if (haveNextG) {
        haveNextG = false;
        return nextNextG;
    } else {
        let v1, v2, s;
        do {
            v1 = 2 * Math.random() - 1;
            v2 = 2 * Math.random() - 1;
            s = v1 * v1 + v2 * v2;
        } while (s >= 1 || s === 0);
        let multiplier = Math.sqrt(-2 * Math.log(s) / s);
        nextNextG = v2 * multiplier;
        haveNextG = true;
        return v1 * multiplier;
    }
}