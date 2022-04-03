class Dirt extends Tile {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.dirt;
    }
}