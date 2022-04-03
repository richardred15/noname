class Chicken extends Character {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.chicken);
        this.setDefaultHealth(15, true);
        this.weapon = new Claw(0.1);
        this.display_name = chooseRandom(chicken_names); //[Math.floor(Math.random() * chicken_names.length)];
        this.armorOffsets = {
            x: 6,
            y: 3
        }
    }

    hit(weapon, attacker) {
        super.hit(weapon, attacker)
        this.playSound("chicken_hurt");
    }

    tick() {
        super.tick();
        this.wander();
    }
}