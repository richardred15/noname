class IronArmor extends Armor {
    constructor(data) {
        super(data);
        if (!data) {
            this.defaultDurability = 150;
            this.durability = 150;
            this.protection = 0.6;
        }
        this.image = images.iron_armor;
    }
}