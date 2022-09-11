// jshint esversion: 6
const cv = document.createElement('canvas');
cv.style.border = '1px solid white';
cv.width = 650;
cv.height = 650;
document.body.append(cv);
const ctx = cv.getContext('2d');
global.ctx = ctx;
global.cv = cv;
