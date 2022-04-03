class ItemContainer {
    constructor(pos, contents, custom_options) {
        let options = {
            speed: 3,
            vector: false,
            mag: Math.random() * 1.2 + 1
        };
        if (custom_options) {
            for (let opt in custom_options) {
                options[opt] = custom_options[opt];
            }
        }
        this.x = pos.x + (tileSize / 2 / mapSize);
        this.y = pos.y + (tileSize / 2 / mapSize);
        this.g = 0;
        this.gFactor = 0.01;
        if (!options.vector) {
            options.vector = getPointNear(0, 0, options.mag);
        }
        this.fx = pos.x + options.vector.x;
        this.fy = pos.y + options.vector.y;
        this.ethereal = true;
        this.etherealTime = 300;
        this.animating = true;
        this.contents = contents;
        this.collectionDistance = 0.01;
        this.lived = 0;
        this.speed = options.speed;
        this.lifetime = 30000;
        this.collected = false;
        this.dead = false;
        this.following = null;
    }

    collect(character) {
        this.collected = true;
        this.following = character;
        this.collectionDistance = 0.25 + (character.speed * 1.5);
        this.fx = character.pos.x + 0.5;
        this.fy = character.pos.y + 0.5;
        this.gFactor = 0; //-this.gFactor;
        this.g = 0;
        this.speed *= 10 + (player.speed * 20);
        this.animating = true;
    }

    render() {
        if (this.animating) {
            if (this.collected) {
                this.fx = this.following.pos.x + 0.5;
                this.fy = this.following.pos.y + 0.5;
            }
            if (dist(this.x, this.y, this.fx, this.fy) < this.collectionDistance) {
                this.x = this.fx;
                this.y = this.fy;
                this.animating = false;
                if (this.collected) {
                    this.dead = true;
                }
                let tile = gm.tile(Math.floor(this.x), Math.floor(this.y));
                if (tile) {
                    if (tile.contains instanceof Cactus) {
                        this.dead = true;
                    }
                }
            } else {
                this.x += (this.fx - this.x) * ((this.speed / 800) * deltaTime);
                this.y += (this.fy - this.y) * ((this.speed / 800) * deltaTime);
                this.g += this.gFactor;
            }
        }
        push();
        translate(this.x * tileSize, (this.y + this.g) * tileSize);
        scale(0.5);
        this.contents.render(0, 0);
        pop();
        if (this.ethereal) {
            this.etherealTime -= deltaTime;
            if (this.etherealTime <= 0) {
                this.ethereal = false;
            }
        }
        this.lived += deltaTime;
        if (this.lived > this.lifetime) {
            this.dead = true;
        }
    }
}