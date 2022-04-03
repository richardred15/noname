class Bunny extends Character {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.bunny);
        this.millis = 0;
        this.yoff = 0;
        this.weapon.damage = 1;
        this.setDefaultHealth(50, true);
        this.display_name = chooseRandom(bunny_names); //[Math.floor(Math.random() * bunny_names.length)];
        let index = Math.floor(Math.random() * 5);
        if (index > 0) {
            this.outfit = images[`bunny_outfit_${index}`];
        }
        this.handOffsets = {
            x: 7,
            y: -8
        };
    }

    tick() {
        super.tick();
        this.wander();
    }

    hit(weapon, attacker) {
        super.hit(weapon, attacker);
        this.playSound("bunny_hurt");
    }

    ondeath() {
        super.ondeath();
        this.playSound("bunny_death");
    }

    render() {
        push();
        if (!this.dead && !this.targetReached) {
            this.millis += deltaTime;
            let yoff = Math.sin((this.millis / (10 / this.speed))) * 10;
            this.yoff = yoff; // - (tileSize * 2);
        }
        translate(0, this.yoff);
        super.render();
        pop();
    }
}