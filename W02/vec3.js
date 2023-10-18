class Vec3 {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    min(){
        return Math.min(this.x, this.y, this.z);
    }

    mid(){
        const arr = [this.x, this.y, this.z];
        arr.sort((a, b) => a - b);
        return arr[1];
    }

    max(){
        return Math.max(this.x, this.y, this.z);
    }
}