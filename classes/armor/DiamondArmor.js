class DiamondArmor extends Armor {
    constructor(data) {
        super(data);
        if (!data) {
            this.defaultDurability = 600;
            this.durability = 600;
            this.protection = 0.9;
        }
        this.image = images.diamond_armor;
    }
}