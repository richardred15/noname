class ArmorFlower extends Entity {
    constructor(x = 0, y = 0) {
        super("armor_flower", x, y);
        this.image = images[`flower_4`];
    }

    oncollect(character) {
        if (this.collected) return false;
        super.oncollect(character);
        if (character.armor) {
            character.armor.repair(0.05 * character.armor.defaultDurability);
            //newMessage(`${character.getName()} - Armor +5%`, "limegreen", BOLD, images.armor_icon);
        }
    }
}