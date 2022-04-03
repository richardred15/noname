class GameMap {
    constructor(width, height, depthMap) {
        this.w = width;
        this.h = height;
        this.depthMap = depthMap;

        this.tiles = [];
        this.tileQuads = [];

        this.build();
    }

    tile(x, y) {
        let row = this.tiles[y];
        if (row) {
            return this.tiles[y][x];
        }
        return undefined;
    }

    build() {
        for (let y = 0; y < this.h; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.w; x++) {
                this.tiles[y][x] = this.depthToTile(depthMap[y][x], x, y);
            }
        }
    }

    depthToTile(depth, x, y) {
        let tile = new Grass(x, y);
        if (depth < 11) tile = new DeepWater(x, y);
        else if (depth < 22) tile = new Water(x, y);
        else if (depth < 23.3) tile = new ShallowWater(x, y);
        else if (depth < 23.8) tile = new WetSand(x, y);
        else if (depth < 27) tile = new Sand(x, y);
        else if (depth < 27.5) tile = new DirtySand(x, y);
        else if (depth < 28) tile = new Dirt(x, y);
        else if (depth < 29) tile = new LightGrass(x, y);
        else if (depth > 42.8) tile = new Mountain(x, y);
        else if (depth > 41) tile = new Stone(x, y);
        else if (depth > 39) tile = new DarkGrass(x, y);
        tile.spawnEntities();
        return tile;
    }

    tick() {
        for (let j = 0; j < this.h; j++) {
            for (let i = 0; i < this.w; i++) {
                this.tiles[j][i].tick();
            }
        }
    }

    render() {
        onScreenTiles = 0;
        offScreenTiles = 0;
        let rerender = [];
        for (let j = 0; j < this.h; j++) {
            for (let i = 0; i < this.w; i++) {
                if (onscreen(i, j)) {
                    this.tiles[j][i].render(main_canvas);
                    rerender.push(this.tiles[j][i]);
                    onScreenTiles++;
                } else {
                    offScreenTiles++;
                }
            }
        }
        if (world_effects && world_effect_opacity < 75) {
            world_effect_opacity += deltaTime / 40;
            effect_filter.clear();
            effect_filter.fill(200, 0, 0, world_effect_opacity);
            effect_filter.rect(0, 0, tileSize, tileSize);
        }
        for (let tile of rerender) {
            if (world_effects) image(effect_filter, tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
            tile.renderContains(main_canvas);
            if (world_effects) image(effect_filter, tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
        }
    }
}