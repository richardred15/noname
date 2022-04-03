class Dog extends Companion {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.dog);
        this.handOffsets.x = 4;
        this.defaultSpeed = 0.15;
        this.speed = 0.15;
        this.armorOffsets = {
            x: 11,
            y: 3
        }
        this.collectCoolDown = 150;
        this.lastCollection = 0;
    }

    addCompanion(companion) {
        super.addCompanion(companion);

    }

    tick() {
        super.tick();
        if (!this.dead && this.master) {
            if (tickTime - this.lastCollection > this.collectCoolDown) {
                for (let nearby of this.nearbyItems(2)) {
                    let contents = nearby.item.contents;
                    if (contents instanceof Coin) {
                        nearby.item.collect(this);
                        this.master.coins += contents.value;
                        this.lastCollection = tickTime;
                    }
                }
            }
        }
    }
}