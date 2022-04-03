class Bush extends Entity {
    constructor(x = 0, y = 0) {
        super("bush", x, y);
        this.image = images.bush;
        this.static = true;
    }

    oncollision(player) {
        player.speed *= 0.8;
    }

    oncollect(player) {

    }
}