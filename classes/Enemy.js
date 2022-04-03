class Enemy extends Character {
    constructor(x, y) {
        super(x, y);
        this.display_enemy = true;
        this.detectionDistance = 10;
        this.fights = [Character];
        this.likes = [Enemy];
        this.glow_color = "red";
        this.coins = Math.floor(Math.random() * 10);
    }

    tick() {
        super.tick();
        if (!this.dead) {
            if (!this.following && !this.attacking) {
                this.wander();
                for (let n of this.nearby(this.detectionDistance)) {
                    if (!(n.character instanceof Enemy)) {
                        if (!n.character.dead)
                            this.setEnemy(n.character);
                    }
                }
            }
        }
    }

    render() {
        super.render();
    }
}