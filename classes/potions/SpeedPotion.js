class SpeedPotion extends Potion {
    constructor() {
        super();
        this.image = images.speed_potion;
        this.color = "rgb(65,231,201)";
    }

    apply(character) {
        super.apply(character);
        character.speed *= 2;
    }
}