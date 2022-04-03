class Potion {
    constructor() {
        this.image = images.empty_potion;
        this.duration = 10000;
        this.expired = false;
        this.color = "white";
    }

    apply(character) {
        if (this.expired) return;
        this.duration -= tickDelta;
        if (this.duration <= 0) {
            this.expired = true;
        }
    }

    render(x, y) {
        image(this.image, x, y);
    }
}