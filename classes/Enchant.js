class Enchant {
    constructor(level = 1) {
        this.display_name = "Enchant";
        this.level = level;
        this.image = images.book;
    }

    calculateDamage(damage) {
        return damage;
    }

    apply(damage, victim, attacker) {
        if (damage >= victim.health && this.level < 4) {
            this.level += 0.05 / floor(this.level);
            if (this.level > 3) this.level = 3.99;
        }
        return damage;
    }

    render(x, y, w = tileSize, h = tileSize) {
        image(this.image, x, y, w, h);
        let l = floor(this.level);
        image(images[`enchant_${l}`], x, y, w, h);
    }
}