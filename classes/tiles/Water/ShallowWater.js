class ShallowWater extends Water {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.shallow_water;
    }

    act(character) {
        character.speed = character.defaultSpeed * 0.75;
    }
}