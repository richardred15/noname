class DarkGrass extends Grass {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.dark_grass;
        this.spawnChance = 0.00375;
    }
}