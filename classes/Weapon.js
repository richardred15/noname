class Weapon {
    constructor(dmg) {
        this.damage = dmg;
        this.display_name = this.constructor.name;
        this.defaultRotation = Math.PI / 8;
        this.rotation = this.defaultRotation;
        this.rotationSpeed = 0.6;
        this.frames = 0;
        this.animate = false;
        this.cooldown = 200;
        this.current_cooldown = 0;
        this.image = images.blank;
        this.enchanted_image = images.blank;
        this.enchants = [];
        this.enchanted = false;
        this.enchantable = false;
        this.glowPosition = 0;
        this.glowColor = "white";
    }

    enchant(enchantment) {
        for (let enchant of this.enchants) {
            if (enchant.constructor.name == enchantment.constructor.name) return false;
        }
        this.enchants.push(enchantment);
        this.enchanted = true;
        return true;
    }

    calculateDamage() {
        let d = this.damage;
        for (let enchant of this.enchants) {
            d = enchant.calculateDamage(d);
        }
        return d;
    }

    strike(victim, attacker) {
        if (this.current_cooldown == 0) {
            this.animate = true;
            this.frames = 0;
            this.rotation = this.defaultRotation;
            this.current_cooldown = this.cooldown;
            let d = this.damage;
            for (let enchant of this.enchants) {
                d = enchant.apply(d, victim, attacker);
            }
            return d;
        } else {
            return false;
        }
    }

    /* clone() {
        return eval(`new ${this.constructor.name}(${this.damage})`);
    } */

    update() {
        if (this.current_cooldown > 0) {
            this.current_cooldown -= deltaTime;
            if (this.current_cooldown < 0) this.current_cooldown = 0;
        }
    }

    tick() {

    }

    render(x, y, w = tileSize, h = tileSize, still = false) {
        push();
        translate(x + (w / 2), y + h);
        if (!still) rotate(this.rotation);
        else rotate(this.defaultRotation);
        if (this.enchanted && fancy_graphics) {
            drawingContext.shadowColor = this.glowColor;
            drawingContext.shadowBlur = (Math.sin(this.glowPosition) * 4) + 8;
            this.glowPosition += 0.05;
        }
        image(this.image, -(w / 2), -h, w, h);
        if (this.enchanted) image(this.enchanted_image, -(w / 2), -h, w, h);
        pop();
        if (!still) this.update();
        if (this.animate && !still) {
            this.rotation += (Math.sin(this.frames) * (Math.PI / 16));
            this.frames += this.rotationSpeed;
            if (this.frames >= (2 * Math.PI)) {
                this.animate = false;
                this.frames = 0;
                this.rotation = this.defaultRotation;
            }
        }
    }
}