class Water extends Tile {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.water;
        this.wettable = false;
    }

    act(character) {
        character.speed = character.defaultSpeed * 0.5;
    }
}