class Mountain extends Tile {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.mountain;
        this.wettable = false;
        this.collision = true;
    }

    act(character) {
        character.speed = character.defaultSpeed * 0.5;
    }
}