class Armor {
    constructor(data) {
        this.data = {
            defaultDurability: 20,
            durability: 20,
            protection: 0.5,
            broken: false
        };
        if (data) this.data = data;
        this.defaultDurability = this.data.defaultDurability;
        this.durability = this.data.durability;
        this.protection = this.data.protection;
        this.broken = this.data.broken;
        this.image = images.leather_armor;
    }

    repair(amt = this.defaultDurability) {
        this.durability += amt;
        this.broken = false;
    }

    hit(dmg) {
        if (this.broken) return dmg;
        let ndmg = dmg - (this.protection * dmg);
        this.durability -= (this.protection / 4) * dmg;
        if (this.durability <= 0) {
            this.broken = true;
        }
        return ndmg;
    }

    /* clone() {
        this.data = {
            defaultDurability: this.defaultDurability,
            durability: this.durability,
            protection: this.protection,
            broken: this.broken
        };
        let str = `new ${this.constructor.name}(${JSON.stringify(this.data)})`;
        return eval(str);
    } */

    render(x, y) {
        image(this.image, x, y, tileSize, tileSize);
        if (this.broken) {
            stroke(167, 0, 0);
            strokeWeight(2);
            line(x + 10, y + 1, 22, 15);
        }
    }
}