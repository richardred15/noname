class GoldenFlower extends Entity {
    constructor(x = 0, y = 0) {
        super("golden_flower", x, y);
        this.image = images['golden_flower'];
    }

    /**
     * 
     * @param {Character} character 
     */
    oncollect(character) {
        if (this.collected) return false;
        super.oncollect(character);
        if (character.health < character.defaultHealth) {
            let p = round((1 - (character.health / character.defaultHealth)) * 100, 1);
            character.health = character.defaultHealth;
            //newMessage(`${character.getName()} - Health +${p}%`, "limegreen", BOLD, images.health);
            if (p < 20) {
                console.log(p);
            }
        }
    }
}