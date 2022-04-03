class Dragon extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.dragon);
        this.weapon = new Sword();
        this.handOffsets = {
            x: 12,
            y: -8
        };
        this.display_name = chooseRandom(dragon_names);//[Math.floor(Math.random() * dragon_names.length)];
        this.armorOffsets.x = 10;
    }

    hit(weapon, attacker) {
        super.hit(weapon, attacker);
        this.playSound("dragon_hurt");
    }

    ondeath() {
        super.ondeath();
        this.playSound("dragon_death");
    }

    setup(x, y) {
        super.setup(x, y);
    }
}