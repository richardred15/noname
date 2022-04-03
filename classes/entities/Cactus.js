class Cactus extends Entity {
    constructor(x = 0, y = 0) {
        super("cactus", x, y);
        this.image = images.cactus;
        this.weapon = new Spine(0.1);
        this.bloody = 0;
        this.static = true;
    }

    oncollision(player) {
        player.hit(this.weapon, this);
        this.bloody = 8000;
        this.image = images.cactus_bloody;
    }

    oncollect(player) {

    }

    render() {
        if (this.bloody > 0) {
            this.bloody -= deltaTime;
            if (this.bloody <= 0) {
                this.image = images.cactus;
            }
        }
        super.render();
        this.weapon.update();
    }
}