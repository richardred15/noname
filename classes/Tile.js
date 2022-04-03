class Tile {
    constructor(x, y, size = tileSize) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.contains = new Entity();
        this.image = images.blank;
        this.spawnChance = 0;
        this.wet = false;
        this.puddleSize = 0.1;
        this.wettable = true;
        this.collision = false;
        this.puddle = images[`puddle_${Math.floor(Math.random() * 4)}`];
        this.puddlePos = {
            x: -Math.random() * 0.15,
            y: -Math.random() * 0.15
        }
        this.is_bloody = false;
        this.blood_start = 0;
    }

    bloody() {
        this.is_bloody = true;
        this.blood_start = Date.now();
    }

    spawnEntities() {

    }

    act(character) {

    }

    tick() {
        this.contains.tick();
        if (this.wettable) {
            if (rain.raining) {
                if (this.wet && this.puddleSize < 1) {
                    if (Math.random() < 0.1) this.puddleSize += 0.005;
                }
                if (Math.random() < 0.0000025) this.wet = true;
            } else if (this.wet && !rain.raining) {
                if (this.puddleSize > 0.1) {
                    if (Math.random() < 0.25) this.puddleSize -= 0.008;
                } else {
                    this.puddleSize = 0.1;
                    this.wet = false;
                }
            }
        }
    }

    renderContains() {
        translate(this.x * this.size, this.y * this.size);
        this.contains.render();
        if ((this.contains.collected || this.contains.collided) && !this.contains.collected_image) {
            this.contains = new Entity();
        }
        translate(-this.x * this.size, -this.y * this.size);
    }

    render() {
        translate(this.x * this.size, this.y * this.size);
        image(this.image, 0, 0, tileSize, tileSize);
        if (this.is_bloody) {
            imageMode(CENTER);
            image(images.blood_stains, (tileSize / 2) + this.puddlePos.x, (tileSize / 2) + this.puddlePos.y, tileSize, tileSize);
            imageMode(CORNER);
            if (renderTime - this.blood_start > 5000) {
                this.is_bloody = false;
            }
        }
        if (this.wet) {
            imageMode(CENTER);
            image(this.puddle, (tileSize / 2) + this.puddlePos.x, (tileSize / 2) + this.puddlePos.y, tileSize * this.puddleSize, tileSize * this.puddleSize);
            imageMode(CORNER);
        }
        if (time_cycle) image(time_filter, 0, 0, tileSize, tileSize);
        translate(-this.x * this.size, -this.y * this.size);
    }
}