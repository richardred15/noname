class Sand extends Tile {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.sand;
        this.spawnChance = 0.015;
        this.wettable = false;
    }

    spawnEntities() {
        if (this.spawnChance > 0) {
            if (Math.random() < this.spawnChance) {
                this.contains = new Cactus();
            } else if (Math.random() < this.spawnChance) {
                this.contains = new Bush();
            } else if (Math.random() < this.spawnChance) {
                this.contains = new Chest();
            }
        }
    }
}