class SalesMan extends Character {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.guy);
        this.wants = [];
        this.weapon = new Staff();
        this.setDefaultHealth(5000, true);
        this.display_name = "SalesMan";
        let index = `outfit_${Math.floor(Math.random()*4)}`;
        this.outfit = images[index];
    }

    setup(x, y) {
        super.setup(x, y);
    }

    tick() {
        super.tick();
        this.wander();
    }

    ondeath() {
        super.ondeath();
    }

    wander() {
        super.wander();
    }

    render() {
        super.render();

        if (debugMode && this.isHelping) {
            stroke(255, 0, 255);
            strokeWeight(1);
            line(this.pos.x * tileSize + (tileSize / 2), this.pos.y * tileSize + (tileSize / 2), this.helping.pos.x * tileSize + (tileSize / 2), this.helping.pos.y * tileSize + (tileSize / 2));
        }
    }
}