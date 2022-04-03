class MiniMap {
    constructor() {
        this.map = createGraphics(mapSize, mapSize);
        this.custom_map = createGraphics(mapSize, mapSize);
        this.overlay = createGraphics(mapSize, mapSize);
        this.size = 200;
    }

    init() {
        this.custom_map.image(images.custom_map, 0, 0, mapSize, mapSize);
        this.map.loadPixels();
        for (let y = 0; y < mapSize; y++) {
            depthMap[y] = [];
            bossIsland[y] = [];
            for (let x = 0; x < mapSize; x++) {
                let i = ((y * mapSize) + x) * 4;
                let cmv = this.custom_map.get(x, y);
                let n = noise(x * inc, y * inc);
                n = ((cmv[3] / 255) * (cmv[0] / 255)) + ((1 - (cmv[3] / 255)) * n);
                if (cmv[3] > 0) {
                    bossIsland[y][x] = true;
                }
                let d = round(n * 64, 2);
                depthMap[y][x] = d;
                let val = n * 255;
                let tval = val;
                if (val < 45) val = 0; /** Deep Water */
                else if (val < 90) val = 1; /** Water */
                else if (val < 110) val = 30; /** Sand */
                else if (val < 120) val = 60; /** Light Grass */
                else if (val > 175) val = 255; /** Mountain */
                else if (val > 165) val = 100; /** Stone */
                else if (val > 155) val = 80; /** Dark Grass */
                else {
                    val = 75; /** Grass */
                }
                let col = color(0);
                switch (val) {
                    case 0:
                        col = color(0, 0, 155);
                        break;
                    case 1:
                        col = color(0, 0, 255);
                        break;
                    case 30:
                        col = color("#ddcc55");
                        break;
                    case 60:
                        col = color(80, 200, 80);
                        break;
                    case 75:
                        col = color(0, 125, 0);
                        break;
                    case 80:
                        col = color(0, 80, 0);
                        break;
                    case 100:
                        col = color(125, 125, 125);
                        break;
                    case 255:
                        col = color(0);
                        break;
                }
                this.map.pixels[i + 0] = col.levels[0];
                this.map.pixels[i + 1] = col.levels[1];
                this.map.pixels[i + 2] = col.levels[2];
                this.map.pixels[i + 3] = 255;
            }
        }
        this.map.updatePixels();
    }

    update() {
        this.overlay.noStroke();
        this.overlay.clear();
        this.overlay.fill(0, 255, 0);
        this.overlay.ellipse(boss.pos.x, boss.pos.y, mapSize / 32);
        for (let animal of wildlife) {
            if (animal.dead) continue;
            this.overlay.fill(255, 192, 203);
            if (animal.display_enemy) this.overlay.fill(255, 0, 0);
            this.overlay.ellipse(animal.pos.x, animal.pos.y, mapSize / 40);
        }
        for (let player of players) {
            if (player.dead) continue;
            this.overlay.fill(255, 255, 255);
            if (player.isHelping) this.overlay.fill(255, 127, 80);
            this.overlay.ellipse(player.pos.x, player.pos.y, mapSize / 40);
        }
        this.overlay.fill(255, 0, 255);
        let x = player.pos.x;
        let y = player.pos.y;
        this.overlay.push();
        this.overlay.translate(x, y);
        this.overlay.ellipse(0, 0, mapSize / 30);
        this.overlay.rotate(player.facing + (Math.PI / 2));

        this.overlay.triangle(0, -(mapSize / 25), 0 + (mapSize / 60), 0, -(mapSize / 60), 0);
        this.overlay.pop();
        //this.overlay.ellipse(player.pos.x, player.pos.y, mapSize / 35);
    }

    render() {
        image(this.map, 10, 10, this.size, this.size);
        image(time_filter, 10, 10, this.size, this.size);
        image(this.overlay, 10, 10, this.size, this.size);
    }
}