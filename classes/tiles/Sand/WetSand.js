class WetSand extends Sand {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.wet_sand;
    }
    spawnEntities() {}
}