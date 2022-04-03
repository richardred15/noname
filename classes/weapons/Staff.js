class Staff extends Weapon {
    constructor(dmg = 50) {
        super(dmg);
        this.image = images.staff;
        this.enchanted_image = images.enchanted_staff;
        this.defaultRotation = 0;
        this.rotation = this.defaultRotation;
        this.enchantable = true;
    }
}