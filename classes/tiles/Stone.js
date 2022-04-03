class Stone extends Tile {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.stone;
    }

    act(character) {
        character.speed = character.defaultSpeed * 0.75;
    }
}