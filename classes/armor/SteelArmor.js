class SteelArmor extends Armor {
    constructor(data) {
        super(data);
        if (!data) {
            this.defaultDurability = 300;
            this.durability = 300;
            this.protection = 0.8;
        }
        this.image = images.steel_armor;
    }
}