class Squirrel extends Character {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.squirrel);
        this.millis = 0;
        this.yoff = 0;
        this.weapon.damage = 1;
        this.setDefaultHealth(50, true);
        this.display_name = chooseRandom(bunny_names);//[Math.floor(Math.random() * bunny_names.length)];
        this.tagOffsets.y = 10;
        this.handOffsets = {
            x: 3,
            y: -5
        };
        this.armorOffsets = {
            y: 13,
            x: 1
        }
    }

    tick() {
        super.tick();
        this.wander();
    }

    hit(weapon, attacker) {
        super.hit(weapon, attacker);
        this.playSound("squirrel_hurt");
    }

    ondeath() {
        super.ondeath();
        this.playSound("squirrel_death");
    }

    render() {
        push();
        if (!this.dead && !this.targetReached) {
            this.millis += deltaTime;
            let yoff = Math.sin((this.millis / (10 / this.speed))) * 10;
            this.yoff = yoff;
        }
        translate(0, this.yoff);
        super.render();
        pop();
    }
}