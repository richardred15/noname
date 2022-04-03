class Grass extends Tile {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.grass;
        this.spawnChance = 0.00875;
    }

    spawnEntities() {
        if (Math.random() < this.spawnChance) {
            this.contains = new Flower();
        } else if (Math.random() < this.spawnChance / 2) {
            this.contains = new ArmorFlower();
        } else if (Math.random() < this.spawnChance / 4) {
            this.contains = new Chest();
        } else if (Math.random() < this.spawnChance / 8) {
            this.contains = new GoldenFlower();
        }
    }

    tick() {
        super.tick();
        if (this.contains.type == null) {
            if (Math.random() < 0.0001) {
                this.spawnEntities(true);
            }
        }
    }
}