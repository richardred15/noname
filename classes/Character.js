class Character {
    constructor(x, y) {
        this.display_enemy = false;
        this.display_name = null; //this.constructor.name;
        this.isUser = false;
        this.wants = ["flower", "golden_flower"];
        this.fights = [];
        this.defaultHealth = 100;
        /**
         * @type {Armor}
         */
        this.armor = null;
        this.weapon = new Fist(2);
        this.handOffsets = {
            x: 0,
            y: 0
        };
        this.tagOffsets = {
            x: 0,
            y: 0
        }
        this.armorOffsets = {
            x: 0,
            y: 0
        }
        this.coins = 0;
        this.killer = null;
        this.killCount = 0;
        this.deathCount = 0;
        this.outfit = null;
        this.image = images.guy;
        this.hurt_image = images.hurt;
        this.outline_image = images.blank;
        this.facing = 0;
        this.facing_right = true;
        this.facing_left = false;
        this.facingCardinal = 0;
        this.faction = null;
        this.birthday = days_elapsed;
        this.days_survived = -1;
        this.glow_color = "white";
        this.emitters = [];
        this.sound_manager = new SoundManager();
        this.played = [];
        this.companions = [];
        this.teleport_timeout = -1;
        this.setup(x, y);
    }

    setImage(image) {
        this.image = image;
        let hurt_cache = images[`${this.constructor.name}_Hurt`];
        if (hurt_cache) {
            this.hurt_image = hurt_cache;
        } else {
            let hurt_canvas = createGraphics(tileSize, tileSize);
            hurt_canvas.fill(255, 0, 0, 125);
            hurt_canvas.rect(0, 0, tileSize, tileSize);
            (this.hurt_image = hurt_canvas.get()).mask(this.image);
            images[`${this.constructor.name}_Hurt`] = this.hurt_image;
        }
        let outline_cache = images[`${this.constructor.name}_Outline`];
        if (outline_cache) {
            this.outline_image = outline_cache;
        } else {
            let outline_canvas = createGraphics(tileSize, tileSize);
            outline_canvas.noStroke();
            let copy = this.image.get();
            copy.loadPixels();
            pixels = copy.pixels;
            let state = 0;
            for (let y = 0; y < tileSize; y++) {
                state = 0;
                for (let x = 0; x < tileSize; x++) {
                    let index = ((y * tileSize) + x) * 4;
                    let alpha = pixels[index + 3];

                    switch (state) {
                        case 0:
                            if (alpha > 25) {
                                let ox = x;
                                if (x < 31) ox = x - 1;
                                outline_canvas.set(ox, y, color("red"));
                                state = 1;
                            }
                            break;
                        case 1:
                            if (alpha == 0) {
                                outline_canvas.set(x, y, color("red"));
                                state = 0;
                            }
                            break;
                    }
                }
            }
            for (let x = 0; x < tileSize; x++) {
                state = 0;
                for (let y = 0; y < tileSize; y++) {
                    let index = ((y * tileSize) + x) * 4;
                    let alpha = pixels[index + 3];

                    switch (state) {
                        case 0:
                            if (alpha > 25) {
                                let oy = y;
                                if (y < 31) oy = y - 1;
                                outline_canvas.set(x, oy, color("red"));
                                state = 1;
                            }
                            break;
                        case 1:
                            if (alpha == 0) {
                                outline_canvas.set(x, y, color("red"));
                                state = 0;
                            }
                            break;
                    }
                }
            }
            outline_canvas.updatePixels();

            this.outline_image = outline_canvas;
            images[`${this.constructor.name}_Outline`] = this.outline_image;
        }
    }

    setup(x, y) {
        this.pos = {
            x: x,
            y: y
        };
        this.spawnPos = {
            x: x,
            y: y
        };
        this.speed = 0.1;
        this.defaultSpeed = this.speed;
        this.targetSpeed = this.speed;
        this.vel = {
            x: 0,
            y: 0
        };
        this.target = {
            x: x,
            y: y
        };
        this.targetReached = true;
        this.hasTempTarget = false;
        this.tempTarget = {
            x: 0,
            y: 0
        };
        this.renderRects = [];
        this.nearbyCache = {};
        this.collectCoolDown = 150;
        this.lastCollection = 0;
        this.following = false;
        this.attacking = false;
        /**
         * @type {Enemy[]}
         */
        this.enemies = [];
        this.health = this.defaultHealth;
        this.locked = false;
        this.pain = 0;
        this.dead = false;
        this.nextMoveTimeout = 0;
        this.nextMoveStart = 0;
        this.maxTravel = 20;
        this.minTravel = 5;
        this.wandering = false;
        this.running = false;
        this.wanderRetries = 0;
        this.soundsPlaying = [];
        this.despawn = 30000;
        this.potions = [];
        this.current_tile = null;
        this.frameCount = 0;
        this.burning = false;
        this.burn_time = 0;
        this.invisible = false;
        this.frozen = false;
    }

    addCompanion(companion) {
        this.companions.push(companion);
        companion.setMaster(this);
    }

    summonCompanions() {
        for (let companion of this.companions) {
            companion.teleport(this.pos.x, this.pos.y);
        }
    }

    currentEnemy() {
        if (this.enemies.length > 0) {
            return this.enemies[this.enemies.length - 1];
        }
        return false;
    }

    respawn() {
        this.setup(this.spawnPos.x, this.spawnPos.y);
    }

    setDefaultHealth(health, init = false) {
        if (init) this.health = health;
        this.defaultHealth = health;
    }

    setEnemy(enemy, following = true) {
        this.enemies.push(enemy);
        this.following = following;
        this.wandering = !following;
        this.setTarget(this.pos.x, this.pos.y);
    }

    removeEnemy(enemy) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
    }

    clearEnemies() {
        this.enemies = [];
        for (let companion of this.companions) {
            companion.clearEnemies();
        }
    }

    clearTarget() {
        this.targetReached = true;
        this.hasTarget = false;
        this.hasTempTarget = false;
        this.target = {
            x: this.pos.x,
            y: this.pos.y
        };
        this.tempTarget = {
            x: this.pos.x,
            y: this.pos.y
        };
    }

    setTarget(x, y) {
        this.targetReached = false;
        this.hasTarget = true;
        this.hasTempTarget = false;
        this.target.x = x;
        this.target.y = y;
    }

    setTempTarget(x, y) {
        this.targetReached = false;
        this.hasTempTarget = true;
        this.tempTarget.x = x;
        this.tempTarget.y = y;
    }

    testShore(tile, character) {
        if (!tile) return false;
        if (tile instanceof Water)
            return false;
        else {
            let dA = dist(tile.x, tile.y, character.target.x, character.target.y) * 0.85;
            let dB = dist(character.pos.x, character.pos.y, character.target.x, character.target.y);
            if (dA <= dB) {
                return true;
            }
        }
        return false;
    }

    testShallow(tile, character) {
        if (!tile) return false;
        if (tile instanceof DeepWater)
            return false;
        else {
            let dA = dist(tile.x, tile.y, character.target.x, character.target.y);
            let dB = dist(character.pos.x, character.pos.y, character.target.x, character.target.y);
            if (dA <= dB) {
                return true;
            }
        }
        return false;
    }

    testEntity(tile, character) {
        if (!tile) return false;
        if (tile.contains.type == null)
            return false;
        else {
            if (character.wants.includes(tile.contains.type)) {
                if (!tile.contains.collected) {
                    if (character.wandering) {
                        return true;
                    }
                    let dA = dist(tile.x, tile.y, character.target.x, character.target.y);
                    let dB = dist(character.pos.x, character.pos.y, character.target.x, character.target.y);
                    if (dA <= dB) {
                        return true;
                    }
                }
            } else {
                return false;
            }
        }
        return false;
    }

    testGround(tile, character) {
        if (!tile) return false;
        if (tile instanceof Mountain)
            return false;
        else {
            let dA = dist(tile.x, tile.y, character.target.x, character.target.y);
            let dB = dist(character.pos.x, character.pos.y, character.target.x, character.target.y);
            if (dA <= dB) {
                return true;
            }
        }
        return false;
    }

    lookFor(test, distance = 1) {
        if (this.locked) return;
        let y = Math.floor(this.pos.y);
        let x = Math.floor(this.pos.x);
        let options = [];
        for (let xd = -1; xd < 2; xd++) {
            for (let yd = -1; yd < 2; yd++) {
                let c = 3 * distance;
                if (xd == 0 || yd == 0) c = 5 * distance;
                for (let i = 1; i <= c; i++) {
                    if (xd == 0 && yd == 0) continue;
                    let tile = gm.tile(x + (i * xd), y + (i * yd));
                    if (tile instanceof Mountain) continue;
                    if (tile) {
                        if (debugMode) {
                            this.renderRects.push({
                                f: color(125, 75),
                                x: tile.x,
                                y: tile.y
                            });
                        }
                        if (test(tile, this)) {
                            let bias = 1;
                            if (tile.contains.type == "golden_flower" && this.health > (0.8 * this.defaultHealth)) continue;
                            if (tile.contains.type == "chest") bias = 0.75;
                            if (tile.contains.type == "armor_flower" && this.armor && this.armor.durability < this.armor.defaultDurability) bias = 0.25;
                            options.push({
                                d: dist(tile.x, tile.y, this.target.x, this.target.y) * bias,
                                t: tile
                            });
                            if (debugMode) {
                                this.renderRects.push({
                                    f: color(255, 0, 0, 75),
                                    x: tile.x,
                                    y: tile.y
                                });
                            }
                            break;
                        }
                    }

                }
            }
        }
        if (options.length > 0) {
            let bestT = {
                d: Infinity
            };
            for (let opt of options) {
                if (opt.d < bestT.d) bestT = opt;
                if (debugMode) {
                    this.renderRects.push({
                        f: color(0, 255, 255, 255),
                        x: opt.t.x,
                        y: opt.t.y
                    });
                }
            }
            if (!this.hasTempTarget && !this.hasTarget)
                this.setTempTarget(bestT.t.x + 0.3, bestT.t.y + 0.3);
            if (debugMode) {
                this.renderRects.push({
                    f: color(0, 0, 255, 255),
                    x: bestT.t.x,
                    y: bestT.t.y
                });
            }
        }
    }

    hurt(damage) {
        this.health -= damage;
        this.pain = 150;
        this.checkDeath();
    }

    hit(weapon, attacker) {
        if (this.dead) return;
        let dmg = weapon.strike(this, attacker);
        if (dmg !== false) {
            if (this.armor) {
                dmg = this.armor.hit(dmg);
            }
            this.health -= dmg;
            this.pain = 150;
            if (!this.attacking && !this.following && !this.running) this.runaway();
            if (this.health > 0) {
                if (attacker != null && attacker instanceof Character && !this.attacking) {
                    this.setEnemy(attacker);
                }
            }
            emitters.push(new ParticleEmitter(this.pos.x, this.pos.y, {
                color: "darkred",
                density: 5,
                lifetime: 50,
                radius: 1,
                particle_size: 1,
                following: this
            }));
        }

        this.checkDeath(attacker);
    }

    checkDeath(attacker) {
        if (this.health <= 0) {
            this.health = 0;
            if (attacker) this.killer = attacker;
            this.enemies = [];
            this.ondeath();
            this.dead = true;
        }
    }

    playSound(name) {
        let d = dist(player.pos.x, player.pos.y, (1 / zoom) * 15, this.pos.x, this.pos.y, 0);
        let r = min(20, twidth);
        if (d < r) {
            let play = false;
            if (!this.soundsPlaying.includes(name)) {
                this.soundsPlaying.push(name);
                play = true;
            } else {
                if (!sounds[name].isPlaying()) {
                    this.soundsPlaying.splice(this.soundsPlaying.indexOf(name), 1);
                    play = true;
                }
            }
            if (play) {
                let v = ((r - d) / r) * 0.4;
                if (rain.raining) v /= 1.5;
                sounds[name].setVolume(v);
                sounds[name].play();
            }
        }
    }

    ondespawn() {

    }

    ondeath() {
        clearTimeout(this.teleport_timeout);
        if (this.armor) {
            newItem(this.pos, this.armor);
            this.armor = null;
        }
        if (this.weapon && !(this.weapon instanceof Fist)) {
            newItem(this.pos, this.weapon);
            this.weapon = new Fist();
        }
        if (this.coins > 0) {
            newItem(this.pos, new Coin(this.coins));
            this.coins = 0;
        }
        this.deathCount++;
        if (this.days_survived == -1) {
            this.days_survived = days_elapsed - this.birthday;
        }
        this.emitters = [];
        emitters.push(new ParticleEmitter(this.pos.x, this.pos.y, {
            color: "red",
            density: 10,
            lifetime: 75,
            radius: 1,
            particle_size: 2
        }));
        let tile = gm.tile(floor(this.pos.x), floor(this.pos.y));
        if (tile) tile.bloody();
    }

    getName() {
        return this.display_name ? this.display_name : this.constructor.name;
    }

    update() {
        if (this.dead || this.frozen) return;
        if (this.pain > 0) {
            this.pain -= deltaTime;
            if (this.speed < 0.4) this.speed += 0.05;
            if (this.pain < 0) this.pain = 0;
        }
        if (this.hasTempTarget || this.hasTarget) {
            let target = this.hasTempTarget ? this.tempTarget : this.target;
            if (target.x + 1 > mapSize || target.x < 0 || target.y + 1 > mapSize || target.y < 0) {
                if (this.hasTempTarget) {
                    this.hasTempTarget = false;
                } else {
                    this.hasTarget = false;
                }
                this.targetReached = true;
            }
            this.facing = Math.atan2(target.y - this.pos.y, target.x - this.pos.x);
            let f = this.facing - (Math.PI / 4);
            if (f > (2 * Math.PI)) f = f - (2 * Math.PI);
            if (f < 0) f = (2 * Math.PI) + f;
            this.facingCardinal = Math.floor(f / (Math.PI / 2));
            switch (this.facingCardinal) {
                case 1:
                    this.facing_left = true;
                    this.facing_right = false;
                    break;
                case 3:
                    this.facing_left = false;
                    this.facing_right = true;
                    break;
            }
            let tx = this.pos.x + Math.cos(this.facing) * (this.speed * (deltaTime / 16.66));
            let ty = this.pos.y + Math.sin(this.facing) * (this.speed * (deltaTime / 16.66));
            if (tx + 1 > mapSize || tx < 0) {} else {
                this.pos.x = tx;
            }
            if (ty + 1 > mapSize || ty < 0) {} else {
                this.pos.y = ty;
            }

            if (dist(this.pos.x, this.pos.y, target.x, target.y) < this.speed * (deltaTime / 17)) {
                this.targetReached = true;
                if (!this.hasTempTarget) {
                    this.hasTarget = false;
                }
                this.hasTempTarget = false;
                this.pos.x = target.x;
                this.pos.y = target.y;
            }
        }
    }

    wander() {
        if (this.dead || this.locked || this.pain > 0) return;
        if (this.targetReached && !this.following && !this.attacking) {
            this.wandering = true;
            if (tickTime - this.nextMoveStart > this.nextMoveTimeout) {
                if (Math.random() < 0.5) {
                    let mag = random(this.minTravel, this.maxTravel);
                    let p = getPointNear(this.pos.x, this.pos.y, mag);
                    if (debugMode) {
                        this.renderRects.push({
                            f: color(0, 255, 0),
                            x: p.x,
                            y: p.y
                        });
                    }
                    let tile = gm.tile(Math.floor(p.x), Math.floor(p.y));
                    if (tile) {
                        if ((!(tile instanceof Water) && !(tile instanceof Mountain) && !(tile.contains instanceof Cactus)) || this.wanderRetries > 5) {
                            this.setTempTarget(p.x, p.y);
                            this.wanderRetries = 0;
                        } else {
                            if (!(tile instanceof Mountain))
                                this.wanderRetries++;
                        }
                    } else {
                        this.wanderRetries++;
                    }
                }
                this.nextMoveStart = tickTime;
                this.nextMoveTimeout = (Math.random() * 1000) + 500;
            }
        }
    }

    runaway() {
        if (this.targetReached) {
            let mag = Math.random() * 2 + 1;
            let p = getPointNear(this.pos.x, this.pos.y, mag);
            let t = gm.tile(Math.floor(p.x), Math.floor(p.y));
            if (t) {
                this.setTarget(p.x, p.y);
                this.running = true;
            }
        }
    }

    testCurrentTile() {
        let ptile = gm.tile(round(this.pos.x), round(this.pos.y));
        if (ptile) {
            switch (ptile.constructor.name) {
                case "Mountain":
                    this.lookFor(this.testGround, 5);
                    break;
                case "DeepWater":
                    this.lookFor(this.testShallow, 5);
                    break;
                case "Water":
                case "ShallowWater":
                    this.lookFor(this.testShore, 3);
                    break;
                default:
                    break;
            }
            if (ptile instanceof Grass || ptile instanceof Sand) {
                this.lookFor(this.testEntity, 2);
            }
            if (ptile.contains.type != null && !ptile.contains.collected) {
                if (this.wants.includes(ptile.contains.type)) {
                    ptile.contains.oncollision(this);
                } else if (ptile.contains.static) {
                    ptile.contains.oncollision(this);
                }
            }
            ptile.act(this);
            this.current_tile = ptile;
        }
    }

    trackEnemies() {
        if (this.enemies.length > 0) {
            let eI = this.enemies.length - 1;
            let enemy = this.enemies[eI];
            while (eI >= 0 && enemy && (enemy.dead || enemy.frozen)) {
                this.enemies.splice(eI, 1);
                this.attacking = false;
                eI--;
            }
            if (!enemy || enemy.dead) {
                return;
            }
            if (this.following && !this.running) {
                let target = enemy.pos;
                let distance = dist(this.pos.x, this.pos.y, target.x, target.y);
                if (distance < 2) {
                    this.attacking = true;
                    if (distance < 1 && !this.running) {
                        enemy.hit(this.weapon, this);
                        if (enemy.dead) {
                            this.killCount++;
                            if (enemy.armor && !enemy.armor.broken) {
                                if (this.armor) {
                                    this.armor.repair(enemy.armor.durability / 10);
                                }
                            }
                            this.enemies.splice(eI, 1);
                        }
                    }
                    this.speed *= 0.5;
                    if (!this.hasTempTarget) {
                        let theta = Math.random() * (Math.PI * 2);
                        let x = (Math.cos(theta) * ((Math.random() * ((this.pain > 0) ? 2 : 1)) + 1)) + target.x;
                        let y = (Math.sin(theta) * ((Math.random() * ((this.pain > 0) ? 2 : 1)) + 1)) + target.y;
                        this.setTempTarget(x, y, true);
                    }
                } else {
                    this.attacking = false;
                    this.setTarget(target.x, target.y);
                }
            }
            if (this.attacking || this.following) {
                if (enemy && (enemy.dead || enemy.frozen)) {
                    this.enemies.splice(eI, 1);
                    this.attacking = false;
                }
            }
        } else {
            this.following = false;
            this.attacking = false;
        }
    }

    collectItems() {
        if (tickTime - this.lastCollection > this.collectCoolDown) {
            for (let nearby of this.nearbyItems()) {
                if (nearby.item.ethereal) continue;
                let contents = nearby.item.contents;
                if (contents instanceof Armor) {
                    let better = false;
                    if (this.armor) {
                        let tVal = this.armor.durability * this.armor.protection;
                        let cVal = contents.durability * contents.protection;
                        if (cVal > tVal) better = true;
                    }
                    if (!this.armor || better) {
                        if (this.armor) newItem(this.pos, this.armor);
                        nearby.item.collect(this);
                        this.armor = contents;
                        this.lastCollection = tickTime;
                    }
                }
                if (contents instanceof Weapon) {
                    if (!this.weapon || (this.weapon.calculateDamage() < contents.calculateDamage())) {
                        if (this.weapon) newItem(this.pos, this.weapon);
                        nearby.item.collect(this);
                        this.weapon = contents;
                        this.lastCollection = tickTime;
                    }
                }
                if (contents instanceof Enchant) {
                    if (this.weapon && this.weapon.enchantable) {
                        if (this.weapon.enchant(contents)) {
                            nearby.item.collect(this);
                        }
                    }
                }
                if (contents instanceof Potion) {
                    if (this.addPotion(contents))
                        nearby.item.collect(this);
                }
                if (contents instanceof Entity) {
                    contents.oncollect(this);
                    nearby.item.collect(this);
                }
            }
        }
    }

    addPotion(potion) {
        for (let pot of this.potions) {
            if (pot.constructor.name == potion.constructor.name) {
                return false;
            }
        }
        this.potions.push(potion);
        this.emitters.push(new ParticleEmitter(this.pos.x, this.pos.y, {
            color: potion.color,
            density: 0.3,
            lifetime: 0,
            static: true,
            radius: 1.5,
            particle_lifetime: 4000,
            particle_size: 2,
            particle_gravity: 0,
            particle_speed: 0.005,
            following: this
        }));
        return true;
    }

    applyPotions() {
        for (let p = this.potions.length - 1; p >= 0; p--) {
            let potion = this.potions[p];
            potion.apply(this);
            if (potion.expired) {
                this.potions.splice(p, 1);
                this.emitters.splice(p, 1);
            }
        }
    }

    teleport(x, y, onteleport) {
        clearTimeout(this.teleport_timeout);
        this.invisible = true;
        this.frozen = true;
        emitters.push(new ParticleEmitter(this.pos.x, this.pos.y, {
            color: "white",
            density: 5,
            lifetime: 50,
            radius: 1,
            particle_size: 2
        }));
        this.teleport_timeout = setTimeout(() => {
            this.pos.x = x;
            this.pos.y = y;
            this.invisible = false;
            this.frozen = false;
            if (onteleport) onteleport(this);
            emitters.push(new ParticleEmitter(this.pos.x, this.pos.y, {
                color: "white",
                density: 5,
                lifetime: 50,
                radius: 1,
                particle_size: 2
            }));
        }, 500);
        for (let companion of this.companions) {
            let mag = 3 + (Math.random() * 2 - 1);
            let p = getPointNear(x, y, mag);
            companion.teleport(p.x, p.y, onteleport);
        }

    }

    checkCompanions() {
        for (let c = this.companions.length - 1; c >= 0; c--) {
            let companion = this.companions[c];
            if (companion.dead) {
                this.companions.splice(c, 1);
                console.log(`Your companion died!`);
            }
            if (companion.attacking && !this.attacking) {
                this.setEnemy(companion.currentEnemy());
            }
        }
    }

    tick() {
        if (this.frozen || this.dead) return;
        if (this.burning) {
            if (this.burn_time <= 0) {
                this.burning = false;
            } else {
                if (rain.raining && !(this.current_tile instanceof Sand)) {
                    this.burning = false;
                } else {
                    this.hurt(0.5);
                }
            }
        }
        this.renderRects = [];
        this.nearbyCache = {};
        this.speed = this.defaultSpeed;
        this.testCurrentTile();
        this.applyPotions();
        if (this.running) {
            if (this.targetReached || !this.hasTarget || this.pain == 0) {
                this.running = false;
            }
        }
        this.checkCompanions();
        this.trackEnemies();
        if (!this.dead) {
            this.collectItems();
        }
        this.weapon.tick();
    }

    displayName(x, y) {
        /** Display Name */
        if (this.display_name) {
            let str = `${this.getName()}`;
            if (this.locked) {
                str += " 🔒";
            }
            textSize(5);
            let dw = textWidth(str);
            fill(0, 125);
            rect(x - (dw / 2) + (tileSize / 2) - 1, y - 13, dw + 2, 7);
            stroke(0);
            strokeWeight(1);
            fill(255, 200);
            text(str, x - (dw / 2) + (tileSize / 2), y - 8);
        }
    }

    nearby(radius = 10) {
        return [...this.nearbyWildlife(radius), ...this.nearbyPlayers(radius)];
    }

    nearbyItems(radius = 2) {
        let n = [];
        for (let item of items) {
            if (item.dead || item.collected) continue;
            let d = dist(item.x, item.y, this.pos.x + 0.5, this.pos.y + 0.5);
            if (d < radius) {
                n.push({
                    distance: d,
                    item: item
                });
            }
        }
        return n;
    }

    nearbyWildlife(radius = 10, filter = null) {
        let n = [];
        for (let animal of wildlife) {
            if (filter != null)
                if (!(animal instanceof filter)) continue;
            let d = dist(animal.pos.x, animal.pos.y, this.pos.x, this.pos.y);
            if (d < radius) {
                n.push({
                    distance: d,
                    character: animal
                });
            }
        }
        return n;
    }

    nearbyPlayers(radius = 10) {
        let n = [];
        for (let player of players) {
            let d = dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y);
            if (d < radius) {
                n.push({
                    distance: d,
                    character: player
                });
            }
        }
        return n;
    }

    burn(time) {
        if (rain.raining && !(this.current_tile instanceof Sand)) return false;
        this.burning = true;
        this.burn_time = time;
    }

    render() {
        if (!this.invisible) {
            let mouseOver = (dist(this.pos.x, this.pos.y, mx, my) <= 1);
            if (!onscreen(this.pos.x, this.pos.y)) {
                offScreenCharacters++;
                return;
            }
            for (let e = this.emitters.length - 1; e >= 0; e--) {
                this.emitters[e].render();
            }
            let osc = 0;
            if (!this.dead)
                osc = (Math.sin(this.frameCount / 10) + 1) / 2;
            let x = this.pos.x * tileSize;
            let y = this.pos.y * tileSize;
            push();
            onScreenCharacters++;

            translate(x, y);
            if (this.facing_left) {
                translate(tileSize, 0);
                scale(-1, 1)
            }
            drawingContext.shadowColor = this.glow_color;
            image(this.image, 0, osc / 2, tileSize, tileSize - osc);
            if (!this.dead) {
                if (this.pain > 0) {
                    image(this.hurt_image, 0, 0, tileSize, tileSize);
                }
            }
            if (this.outfit) image(this.outfit, 0, 0, tileSize, tileSize);
            if (this.armor && !this.armor.broken && this.armor.durability > 0) {
                this.armor.render(this.armorOffsets.x, this.armorOffsets.y);
            }
            if (mouseOver) {
                cursor("pointer");
                image(this.outline_image, 0, osc / 2, tileSize, tileSize - osc);
            }
            this.weapon.render(0 + this.handOffsets.x, 0 + this.handOffsets.y + osc);
            pop();
            push();
            translate(x, y);
            if (this.armor && !this.armor.broken && this.armor.durability > 0) {
                fill(0, 0, 255);
                noStroke();
                rect(this.tagOffsets.x, -5 + this.tagOffsets.y, tileSize * (this.armor.durability / this.armor.defaultDurability), 2);
            }
            if (this.dead) image(images.dead, 0, 0, tileSize, tileSize);
            else {
                if (this.burning) {
                    image(images.flame, 0, 0, tileSize, tileSize);
                    this.burn_time -= deltaTime;
                }
                stroke(1);
                strokeWeight(1);
                fill(255);
                rect(this.tagOffsets.x, 0 + this.tagOffsets.y - 3, tileSize, 2);
                fill(lerpColor(color(255, 0, 0), color(0, 255, 0), this.health / this.defaultHealth));
                noStroke();
                rect(this.tagOffsets.x, 0 - 3 + this.tagOffsets.y, tileSize * (this.health / this.defaultHealth), 2);
                let effects = [...this.potions];
                if (effects.length > 0) {
                    let ex = (tileSize - (effects.length * 7)) / 2;
                    let ey = -20;
                    for (let effect of effects) {
                        image(effect.image, ex + this.tagOffsets.x, ey + this.tagOffsets.y, 7, 7);
                        ex += 7;
                    }
                }

                this.displayName(this.tagOffsets.x, this.tagOffsets.y);
            }
            if (mouseOver) {
                if (this.dead) {
                    this.displayName(this.tagOffsets.x, this.tagOffsets.y);
                }
            }
            if (!this.dead) {
                if (debugMode) {
                    strokeWeight(1);
                    stroke(255);
                    if (this instanceof Enemy) {
                        stroke(255, 0, 0);
                        strokeWeight(2);
                    }
                    for (let enemy of this.enemies) {
                        line((tileSize / 2), (tileSize / 2), enemy.pos.x * tileSize + (tileSize / 2), enemy.pos.y * tileSize + (tileSize / 2));
                    }
                    noStroke();
                }
            }
            pop();
            if (!this.dead) {
                for (let tangle of this.renderRects) {
                    let col = tangle.f;
                    if (!this.display_enemy)
                        col.levels[1] = 255;
                    fill(col);
                    rect(tangle.x * tileSize, tangle.y * tileSize, tileSize, tileSize);
                }
                if (debugMode) {
                    if (this.hasTempTarget) {
                        fill(255, 0, 255, 125);
                        rect(this.tempTarget.x * tileSize, this.tempTarget.y * tileSize, tileSize, tileSize);
                    }
                }
            }
            this.frameCount++;
        }
    }
}