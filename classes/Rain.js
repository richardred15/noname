class Drop {
    constructor(offsetx) {
        this.trail = [];
        this.wind_v = 0;
        this.x = offsetx + tx - this.wind_v;
        //this.x = Math.random() * twidth + tx - this.wind_v;
        this.y = ty + (theight / 8) - (Math.random() * (theight / 3));
        this.v = Math.random() * 0.003 + 0.003;
        this.dx = this.x + (3 * (2.5 / zoom)) + this.wind_v;
        this.dy = this.y + theight - (this.wind_v / 4);
        this.dying = false;
        this.dead = false;
    }

    render() {
        stroke(150, 150, 255, 75);
        strokeWeight(1);

        for (let t = this.trail.length - 1; t >= 0; t--) {
            let point = this.trail[t];
            if (t < this.trail.length - 1) {
                let p2 = this.trail[t + 1];
                line(point.x * tileSize, point.y * tileSize, p2.x * tileSize, p2.y * tileSize);
            } else {
                //rect(point.x * tileSize, point.y * tileSize, 2, 2);
            }
            point.lifetime -= deltaTime;
            if (this.dying) {
                point.lifetime -= deltaTime;
            }
            if (point.lifetime <= 0) {
                this.trail.splice(t, 1);
            }
        }
        if (!this.dying) {
            this.trail.push({
                x: this.x,
                y: this.y,
                lifetime: 500
            });
            this.x += (this.dx - this.x) * (this.v * deltaTime);
            this.y += (this.dy - this.y) * (this.v * deltaTime);
            if (dist(this.x, this.y, this.dx, this.dy) < 0.5) {
                this.dying = true;
                if (!(gm.tile(Math.floor(this.x), Math.floor(this.y)) instanceof Sand)) {
                    emitters.push(new ParticleEmitter(this.x, this.y, {
                        color: color(75, 75, 255, 125),
                        density: Math.random() * 3 + 2,
                        lifetime: 5,
                        radius: 1,
                        particle_size: 2
                    }));
                }
            }
        } else {
            if (this.trail.length == 0) {
                this.dead = true;

            }
        }
    }
}

class Rain {
    constructor() {
        this.drops = [];
        this.raining = false;
        this.fading = false;
        this.rainFade = 0;
        this.fadeTime = 1000;
        this.duration = Infinity;
        this.density = 0;
        this.add_drops = true;
        this.targetDensity = 2;
        this.last_rain = 0;
        this.x = -2;
        sounds.rain.setVolume(0);
    }

    start(duration = Infinity) {
        this.reset();
        this.rainFade = this.fadeTime;
        this.raining = true;
        this.duration = duration;
        this.fading = true;
        this.last_rain = Date.now();
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                sounds.rain.setVolume(i * 0.01);
            }, i * 50);
        }
        sounds.rain.loop();
    }

    stop() {
        this.raining = false;
        this.fading = true;
        this.rainFade = this.fadeTime;
        sounds.rain.setVolume(0, 1);
        this.last_rain = Date.now();
        setTimeout(() => {
            sounds.rain.stop();
        }, 1000);
    }

    reset() {
        this.drops = [];
    }

    update() {
        if (this.drops.length < (this.density * 10)) {
            this.drops.push(new Drop(this.x));
        }
        this.x += Math.random() * 4 + 1;
        if (this.x > twidth + 2) {
            this.x = -2;
        }

    }

    render() {
        drawingContext.shadowBlur = 0;
        if (this.raining) {
            this.add_drops = (player.current_tile && !(player.current_tile instanceof Sand));

            if (this.add_drops) {
                this.update();
            }
        }
        if (this.fading) {
            this.density = ((this.fadeTime - this.rainFade) / this.fadeTime) * this.targetDensity;
        }
        this.duration -= deltaTime;
        if (this.duration <= 0) {
            this.stop();
        }
        if (zoom < 1) return;
        for (let d = this.drops.length - 1; d >= 0; d--) {
            let drop = this.drops[d];
            drop.render();
            if (drop.dead) {
                this.drops.splice(d, 1);
            }
        }
    }
}