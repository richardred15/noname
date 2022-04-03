class Player extends Character {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.guy);
        this.wants.push("chest", "armor_flower");
        this.wanderTimeout = 0;
        this.isHelping = false;
        this.helping = null;
        this.weapon = new Sword();
        this.handOffsets = {
            x: 7,
            y: -8
        };
        this.setDefaultHealth(500, true);
        this.id = next_player_id;
        this.display_name = chooseRandom(player_names); //[this.id % player_names.length];
        next_player_id++;
        let index = `outfit_${Math.floor(Math.random()*4)}`;
        this.outfit = images[index];
    }

    setup(x, y) {
        super.setup(x, y);
    }

    clearTarget() {
        super.clearTarget();
        this.helping = null;
        this.isHelping = false;
    }

    tick() {
        super.tick();
        if (this.coins >= 100) {
            if (this.weapon.damage < 40) {
                newItem(this.pos, this.weapon);
                this.weapon = new DiamondSword();
                this.coins -= 100;
                newMessage(`${this.getName()} got an upgrade!`, "rgb(0,145,187)", "bold", images.diamond_sword);
            }
        }
        if (this.wanderTimeout == 0) {
            this.wander();
        } else {
            this.wanderTimeout -= tickDelta;
            if (this.wanderTimeout < 0) this.wanderTimeout = 0;
        }
        if (this.enemies.length == 0) {
            this.isHelping = false;
            this.helping = null;
        }
        if (!this.dead) {
            if (tickTime - this.lastCollection > this.collectCoolDown) {
                for (let nearby of this.nearbyItems(2)) {
                    let contents = nearby.item.contents;
                    if (contents instanceof Coin) {
                        nearby.item.collect(this);
                        this.coins += contents.value;
                        //newMessage(`${this.getName()} - Coins +${contents.value}`, "gold", BOLD, images.coin);
                        this.lastCollection = tickTime;
                    }
                }
            }
            if (!this.attacking && !this.isHelping && !this.locked) {
                let nearby = this.nearbyPlayers();
                for (let n of nearby) {
                    let player = n.character;
                    if (player == this || player.dead) continue;
                    if (player.attacking) {
                        let eI = player.enemies.length - 1;
                        let enemy = player.enemies[eI];
                        if (enemy) {
                            if (!(enemy instanceof Player)) {
                                this.setEnemy(enemy);
                                this.isHelping = true;
                                this.helping = player;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (this.isHelping) {
            if (!this.helping || this.helping.dead || this.dead) {
                this.helping = null;
                this.isHelping = false;
            }
        }
    }

    hit(weapon, attacker) {
        super.hit(weapon, attacker);
        if (onscreen(this.pos.x, this.pos.y)) {
            this.playSound("ouch");
        }
    }

    ondeath() {
        super.ondeath();
        this.isHelping = false;
        this.helping = null;
        if (this.killer) {
            newMessage(`${this.killer.getName()} killed ${this.getName()} with a ${this.killer.weapon.display_name}`, "red", "BOLD", this.killer.image);
        }
        newMessage(`${this.getName()} survived for ${days_elapsed - this.birthday} days`, "red", "bold", images.dead);
        console.log(`${this.getName()} survived for ${days_elapsed - this.birthday} days`);
        dead_players++;
    }

    setTarget(x, y, user = false) {
        super.setTarget(x, y);
        if (user) {
            this.wanderTimeout = 5000;
        }
    }

    setTempTarget(x, y, attack = false) {
        if (this.wanderTimeout == 0 || attack) {
            super.setTempTarget(x, y);
        }
    }

    respawn() {
        super.respawn();
        //if (this.armor) this.armor.repair();
        this.weapon = new Dagger();
        //if (this.killer instanceof Character) this.setEnemy(this.killer, true);
        dead_players--;
    }

    ondespawn() {
        super.ondespawn();
        let z = new Zombie(this.pos.x, this.pos.y);
        newMessage(`${this.getName()} became a zombie!`, "darkgreen", "bold", images.exclaim);
        z.armor = this.armor;
        z.outfit = this.outfit;
        z.weapon = this.weapon;
        z.handOffsets = this.handOffsets;
        z.display_name = this.display_name;
        wildlife.push(z);
    }

    wander() {
        super.wander();
    }

    render() {
        super.render();

        if (debugMode && this.isHelping) {
            stroke(255, 0, 255);
            strokeWeight(1);
            line(this.pos.x * tileSize + (tileSize / 2), this.pos.y * tileSize + (tileSize / 2), this.helping.pos.x * tileSize + (tileSize / 2), this.helping.pos.y * tileSize + (tileSize / 2));
        }
    }
}