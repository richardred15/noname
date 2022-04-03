class Chest extends Entity {
    constructor(x = 0, y = 0) {
        super("chest", x, y);
        this.image = images.chest;
        //this.collected_image = images.open_chest;
        this.static = true;
    }

    oncollision(character) {
        if (this.collected) return false;
        super.oncollect(character);
        let c = Math.floor(Math.random() * 10) + 1;
        newItem(character.pos, new Coin(c));
        if (Math.random() < 0.5) {
            let c = 1;
            let l = 1;
            if (random() < 0.1) l = 2;
            if (Math.random() < 0.5) c++;
            if (Math.random() < 0.25) c++;
            for (let i = 0; i < c; i++) {
                switch (Math.floor(Math.random() * 6)) {
                    case 0:
                        newItem(character.pos, new Armor());
                        break;
                    case 1:
                        newItem(character.pos, new SteelArmor());
                        break;
                    case 2:
                        newItem(character.pos, new IronArmor());
                        break;
                    case 3:
                        newItem(character.pos, Math.random() < 0.5 ? new FireEnchant(l) : new PowerEnchant(l));
                        break;
                    case 4:
                        newItem(character.pos, new StrikeSpeedEnchant(l));
                        break;
                    case 5:
                        newItem(character.pos, Math.random() < 0.5 ? new SpeedPotion() : new HealthPotion());
                        break;
                    default:
                        newItem(character.pos, new Dagger());
                        break;
                }
            }
        }
    }
}