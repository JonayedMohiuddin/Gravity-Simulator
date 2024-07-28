export class Comet {
    constructor(x, y, r, m, color = "black", vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.m = m;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.static = false;

        if (m == -1) {
            this.m = Comet.getMass(r);
        }
    }

    getVelocityAngle()
    {
        return Math.atan2(this.vy, this.vx);
    }

    getVelocityMagnitude()
    {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    getNormalVelocity()
    {
        let velocityMagnitude = this.getVelocityMagnitude();
        let unitVelocityX = (this.vx / velocityMagnitude) * velocityMagnitude;
        let unitVelocityY = (this.vy / velocityMagnitude) * velocityMagnitude;
        return [unitVelocityX, unitVelocityY];
    }

    changeVelocity(val)
    {
        let angle = this.getVelocityAngle();
        this.vx += val * Math.cos(angle);
        this.vy += val * Math.sin(angle);
    }

    static getVelocityFromMouseCord(mouseDX, mouseDY)
    {
        let vx = (mouseDX) / 50;
        let vy = (mouseDY) / 50;
        return [vx, vy];
    }

    static getMass(r) {
        return Math.PI * r * r;
    }
}
