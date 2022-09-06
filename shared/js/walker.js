// jshint esversion: 6


class Walker {
    constructor(x=0, y=0, width=1) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.stepCount = 0;
    }
    display() {
        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.rect(this.x, this.y, this.w, this.w);
        ctx.fill();
        ctx.restore();
    }
    step() { // 4 possible step choices
        let choice = Math.floor(Math.random() * 4);
        let rx = 0;
        let ry = 0;
        if (choice === 0) rx++;
        else if (choice === 1) rx--;
        else if (choice === 2) ry++;
        else ry--;
        if (this.x + rx >= cv.width) rx = -1;
        if (this.x + rx <= 0 - this.w) rx = 1;
        if (this.y + ry >= cv.height) ry = -1;
        if (this.y + ry <= 0 - this.w) ry = 1;
        this.x += rx * this.w;
        this.y += ry * this.w;
        this.stepCount += 1;
    }
    step2() { // 9 possible step choices
        let rx = Math.floor(Math.random() * 3) - 1;
        let ry = Math.floor(Math.random() * 3) - 1;
        if (this.x + rx >= cv.width) rx = -1;
        if (this.x + rx <= 0 - this.w) rx = 1;
        if (this.y + ry >= cv.height) ry = -1;
        if (this.y + ry <= 0 - this.w) ry = 1;
        this.x += rx * this.w;
        this.y += ry * this.w;
        this.stepCount += 1;
    }
    step3() { // arbitrary step direction
        let rx = Math.random() * 2 - 1;
        let ry = Math.random() * 2 - 1;
        if (this.x + rx >= cv.width) rx = -1;
        if (this.x + rx <= 0 - this.w) rx = 1;
        if (this.y + ry >= cv.height) ry = -1;
        if (this.y + ry <= 0 - this.w) ry = 1;
        this.x += rx * this.w;
        this.y += ry * this.w;
        this.stepCount += 1;
    }
    step4() { // exc-i.1 walker that tends to move down and to the right
        let rx = Math.random() * 2 - 1;
        let ry = Math.random() * 2 - 1;
        if (Math.random() >= 0.9) { // move down and to the right
            rx = Math.random();
            ry = Math.random();
        }
        if (this.x + rx >= cv.width) rx = -1;
        if (this.x + rx <= 0 - this.w) rx = 1;
        if (this.y + ry >= cv.height) ry = -1;
        if (this.y + ry <= 0 - this.w) ry = 1;
        this.x += rx * this.w;
        this.y += ry * this.w;
        this.stepCount += 1;
    }
    step5() { // exc-i.3 walker with dynamic properties
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
    }
}