class DirtySand extends Sand {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.dirty_sand;
    }
}