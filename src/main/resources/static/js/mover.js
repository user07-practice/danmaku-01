export class Mover {

    constructor() {

        this.keyW = false;
        this.keyA = false;
        this.keyS = false;
        this.keyD = false;

    }

    move(target, speed) {

        if (this.keyW) {
            target.y -= speed;
        }

        if (this.keyS) {
            target.y += speed;
        }

        if (this.keyA) {
            target.x -= speed;
        }

        if (this.keyD) {
            target.x += speed;
        }
    }

}