class CoinFountain extends Entity {
    constructor(x = 0, y = 0) {
        super("coin_fountain", x, y);
        this.image = images.coin_fountain;
        this.static = true;
    }

    oncollision() {

    }

    oncollect() {

    }

    tick() {
        if (Math.random() < 0.2) {
            let theta = random(Math.PI / 2, Math.PI) + (Math.PI / 2) + (Math.PI / 4);
            let mag = Math.random() * 2 + 1;
            let x = Math.cos(theta) * mag;
            let y = Math.sin(theta) * mag;
            newItem({
                x: (this.x + 10) / tileSize,
                y: (this.y + 7) / tileSize
            }, new Coin(), {
                vector: {
                    x: x,
                    y: y
                }
            });
        }
    }
}