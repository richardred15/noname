class Companion extends Character {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.blank);

        this.master = null;
        this.follow = false;
        this.stay = false;
        this.target_radius = 4;
        this.handOffsets = {
            x: 3,
            y: 0
        };
    }

    setMaster(master) {
        this.master = master;
        this.follow = true;
        this.display_name = chooseRandom(dog_names); //[Math.floor(Math.random() * dog_names.length)];
        let index = Math.floor(Math.random() * 5);
        this.outfit = images[`dog_outfit_${index}`];
    }

    tick() {
        super.tick();
        if (!this.master && !this.stay && !this.follow) {
            this.wander();
        }
        if (this.master) {
            if (this.enemies.length == 0) {
                let dtm = dist(this.pos.x, this.pos.y, this.master.pos.x, this.master.pos.y);
                if (dtm > 8) {
                    let target = this.selectTarget();
                    if (target) {
                        this.setTarget(target.x, target.y);
                    }
                } else if (dtm > 25) {
                    this.teleport(this.master.pos.x, this.master.pos.y);
                } else {
                    if (Math.random() < 0.04) this.wander();
                }
                if (this.master.attacking) {
                    let enemy = this.master.currentEnemy();
                    this.setEnemy(enemy);
                }
            }
        }
    }

    selectTarget() {
        if (this.master) {
            let mag = this.target_radius + (Math.random() * 2 - 1);
            let p = getPointNear(this.master.pos.x, this.master.pos.y, mag);
            let tile = gm.tile(Math.floor(p.x), Math.floor(p.y));
            if (tile) {
                if (tile.contains && tile.contains instanceof Cactus) {} else {
                    return {
                        x: p.x,
                        y: p.y
                    }
                }
            }
        }
        return false;
    }

    hit(weapon, attacker) {
        super.hit(weapon, attacker);
    }

    ondeath() {
        super.ondeath();
    }

    render() {
        super.render();
    }
}