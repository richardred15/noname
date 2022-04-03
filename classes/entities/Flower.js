class Flower extends Entity {
    constructor(x = 0, y = 0) {
        super("flower", x, y);
        this.f_type = Math.floor(Math.random() * 4);
        this.image = images[`flower_${this.f_type}`];
    }

    oncollect(character) {
        if (this.collected) return false;
        super.oncollect(character);
        if (this.f_type >= 2) {
            if (character.isUser) {
                character.defaultSpeed += 0.005 / 10;
            } else {
                character.defaultSpeed += 0.00375 / 10;
            }
            character.speed = character.defaultSpeed;
        } else {
            let h = Math.random() * 5;
            character.health += h;
            let p = round((h / character.defaultHealth) * 100, 1);
            //newMessage(`${character.getName()} - Health +${p}%`, "limegreen", BOLD, images.health);
        }
    }
}