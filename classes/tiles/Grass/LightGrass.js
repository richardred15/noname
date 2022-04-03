class LightGrass extends Grass {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.light_grass;
        this.spawnChance = 0.00175;
    }
}