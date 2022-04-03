class Zombie extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.zombie);
    }

    hit(weapon, attacker) {
        super.hit(weapon, attacker);
    }

    ondeath() {
        super.ondeath();
    }

    setup(x, y) {
        super.setup(x, y);
    }
}