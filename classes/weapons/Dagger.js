class Dagger extends Weapon {
    constructor(dmg = 10) {
        super(dmg);
        this.image = images.dagger;
        this.enchanted_image = images.enchanted_dagger;
        this.enchantable = true;
    }
}