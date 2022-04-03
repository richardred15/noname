class Sword extends Weapon {
    constructor(dmg = 20) {
        super(dmg);
        this.image = images.sword;
        this.enchanted_image = images.enchanted_sword;
        this.enchantable = true;
    }
}