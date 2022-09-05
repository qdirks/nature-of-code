// jshint esversion: 6
class Vector {
    constructor(x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * 
     * @param {Vector} vector 
     */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }
    /**
     * 
     * @param {Vector} vector 
     */
    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
    }
    /**
     * @param {number} scalar
     */
    mul(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }
    /**
     * @param {number} scalar
     */
    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
    }
    revx() {this.x = -this.x;}
    revy() {this.y = -this.y;}
    revz() {this.z = -this.z;}
    rev() {
        this.revx();
        this.revy();
        this.revz();
    }
}