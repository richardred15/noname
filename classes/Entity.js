class Entity {
    constructor(type = null, x = 0, y = 0) {
        this.type = type;
        this.image = null;
        this.x = x;
        this.y = y;
        this.collected = false;
        this.collected_image = false;
        this.static = false;
        this.collided = false;
        this.display_name = this.constructor.name;
    }

    getName() {
        return this.display_name;
    }

    oncollect(character) {
        this.collected = true;
    }

    oncollision(character) {
        if (this.collided) return;
        this.collided = true;
        newItem({
            x: character.pos.x,
            y: character.pos.y
        }, this);
    }

    tick() {

    }

    render() {
        if (this.type == null) return;
        if (fancy_graphics && (night || rain.raining)) {
            drawingContext.shadowBlur = 40;
        }
        if (this.collected && this.collected_image) {
            image(this.collected_image, this.x, this.y, tileSize, tileSize);
        } else {
            image(this.image, this.x, this.y, tileSize, tileSize);
        }
        if (fancy_graphics && (night || rain.raining)) {
            drawingContext.shadowBlur = 0;
        }
    }
}