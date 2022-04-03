class Coin {
    constructor(value = 1) {
        this.image = images.coin;
        this.value = value;
    }

    render(x, y) {
        image(this.image, x, y, tileSize / 2, tileSize / 2);
    }
}