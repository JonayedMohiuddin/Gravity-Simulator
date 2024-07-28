export class Planet {
    constructor(x, y, r, m, color = "black") {
        this.x = x;
        this.y = y;
        this.r = r;
        this.m = m;
        this.color = color;

        if (m == -1) {
            this.m = Planet.getMass(r);
        }
    }

    static getMass(r) {
        return Math.PI * r * r;
    }
}
