class Ghost extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.ghost);
        this.defaultSpeed *= 1.005;
        this.display_name = chooseRandom(ghost_names);//[Math.floor(Math.random() * ghost_names.length)];
        this.weapon = new Sheets();
        this.handOffsets = {
            x: 7,
            y: -4
        };
        this.armorOffsets = {
            x: 2,
            y: 5
        }
    }

    tick() {
        super.tick();
        if (!night) {
            this.hit(new Heat(0.5), null);
        }
    }
}