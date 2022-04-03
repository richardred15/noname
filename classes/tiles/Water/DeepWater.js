class DeepWater extends Water {
    constructor(x, y, size = tileSize) {
        super(x, y, size);
        this.image = images.deep_water;
    }

    act(character) {
        character.speed = character.defaultSpeed * 0.33;
    }
}