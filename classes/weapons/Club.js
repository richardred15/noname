class Club extends Weapon {
    constructor(dmg = 6) {
        super(dmg);
        this.image = images.club;
        this.enchanted_image = images.enchanted_club;
        this.rotationSpeed = 0.3;
        this.enchantable = true;
    }
}