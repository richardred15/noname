class Boss extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.setImage(images.boss);
        this.coins = 100;
        this.active = false;
        this.fountain_index = -1;
        this.armorOffsets.y = 6;
        this.teleport_cooldown = 0;
        this.armor = new SteelArmor();
        this.setDefaultHealth(1500, true);
    }

    tick() {
        if (!this.active) return;
        super.tick();

        if (Math.random() < 0.01) {
            newItem(this.pos, Math.random() < 0.5 ? new HealthPotion() : new SpeedPotion());
        }

        if (this.active) {
            if (this.health < 500) {
                if (this.teleport_cooldown <= 0) {
                    if (Math.random() < 0.25) {
                        let mag = (Math.random() * 12 + 3);
                        let p = getPointNear((mapSize / 2 + 0.5), (mapSize / 2 + 0.5), mag);
                        this.teleport(p.x, p.y);
                        this.teleport_cooldown = Math.random() * 10000 + 5000;
                    }
                } else {
                    this.teleport_cooldown -= tickDelta;
                }
            }
        }
    }

    ondeath() {
        if (battling) {
            battling = false;
            console.log("Battling:", battling);
            setTimeout(() => {
                spreadPlayers((character) => {
                    character.clearTarget();
                    character.clearEnemies();
                });
            }, 30000);
            time_ticking = true;
            world_effects = false;
        }
        setTimeout(() => {
            this.respawn();
            this.defaultHealth += 500;
            this.health = this.defaultHealth;
            this.weapon = new DiamondSword(40);
            this.armor = new SteelArmor();
            entities.splice(this.fountain_index, 1);
        }, 30000);
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                newItem(this.pos, new Coin(20), {
                    mag: Math.random() * 4 + 6
                });
            }, i * 50);
        }
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                newItem(this.pos, new DiamondArmor(), {
                    mag: Math.random() * 4 + 6
                });
            }, i * 50);
        }
        this.fountain_index = entities.length;
        entities.push(new CoinFountain(this.spawnPos.x * tileSize, this.spawnPos.y * tileSize));
        this.active = false;
        this.killer = null;
        super.ondeath();
        emitters.push(new ParticleEmitter(this.pos.x, this.pos.y, {
            color: "black",
            density: 8,
            lifetime: 600,
            radius: 4,
            particle_size: 8
        }));
        emitters.push(new ParticleEmitter(this.pos.x, this.pos.y, {
            color: "black",
            density: 8,
            lifetime: 600,
            radius: 6,
            particle_size: 8
        }));
    }

    update() {
        if (!this.active) return;
        super.update();
    }

    hit(weapon, attacker) {
        if (!this.active) {
            this.active = true;
            summonAll();
        }
        super.hit(weapon, attacker);
    }

    respawn() {
        super.respawn();
    }

    setup(x, y) {
        super.setup(x, y);
    }
}