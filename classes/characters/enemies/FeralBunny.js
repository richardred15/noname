class FeralBunny extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.feral_bunny);
        this.display_enemy = false;
        this.display_name = chooseRandom(bunny_names);//[Math.floor(Math.random() * bunny_names.length)];
        this.setDefaultHealth(25, true);
        if (Math.random() < 0.25) {
            this.weapon = new Dagger();
        }
        this.handOffsets = {
            x: 7,
            y: -8
        };
    }

    hit(weapon, attacker) {
        super.hit(weapon, attacker);
        if (dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y) < twidth) {
            this.playSound("bunny_hurt");
        }
    }

    ondeath() {
        super.ondeath();
        if (dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y) < twidth) {
            this.playSound("bunny_death");
        }
    }

    setup(x, y) {
        super.setup(x, y);
    }
}