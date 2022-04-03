class HealthPotion extends Potion {
    constructor() {
        super();
        this.image = images.health_potion;
        this.color = "rgb(178,94,255)";
    }

    apply(character) {
        super.apply(character);
        if (character.health < character.defaultHealth) {
            character.health += 0.5;
        }
    }
}