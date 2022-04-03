class Bear extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.bear);
        this.setDefaultHealth(75);
        this.weapon = new Claw();
        this.handOffsets = {
            x: 7,
            y: 0
        };
        this.armorOffsets = {
            x: 9,
            y: 3
        };
        this.display_name = chooseRandom(bear_names); //[Math.floor(Math.random() * bear_names.length)];
    }

    hit(weapon, attacker) {
        super.hit(weapon, attacker);
        this.playSound("bear_hurt");
    }
}