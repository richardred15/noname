class Particle {
    constructor(x, y, options) {
        this.lifetime = options.particle_lifetime;
        this.x = x;
        this.y = y;
        this.color = color(options.color);
        this.dead = false;
        this.opacity = 255;
        this.speed = options.particle_speed;
        this.options = options;
        this.g = options.particle_gravity;
        this.calculateTarget();
    }

    calculateTarget() {
        let theta = Math.random() * (Math.PI * 2);
        let hr = this.options.radius / 2;


        this.tx = this.x + (Math.cos(theta) * (this.options.radius + ((Math.random() * hr) - (hr / 2))));
        this.ty = this.y + (Math.sin(theta) * (this.options.radius + ((Math.random() * hr) - (hr / 2))));
    }

    update() {
        this.x += (this.tx - this.x) * this.speed;
        this.y += (this.ty - this.y) * this.speed;
        this.ty += this.g;
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.dead = true;
        }
    }

    render() {
        this.update();
        if (!onscreen(this.x, this.y)) {
            return;
        }
        if (this.lifetime < 500) {
            this.opacity = (this.lifetime / 500) * 255;
            this.color.setAlpha(this.opacity);
        }
        fill(this.color);
        rect(this.x * tileSize, this.y * tileSize, this.options.particle_size, this.options.particle_size);
    }
}

class ParticleEmitter {
    constructor(x, y, opts) {
        this.options = {
            density: 1,
            radius: 3,
            particle_speed: 0.05,
            particle_size: 3,
            particle_lifetime: 1000,
            particle_gravity: 0.03,
            lifetime: 30000,
            static: false,
            following: false,
            color: "white"
        }
        if (opts) {
            for (let opt in opts) {
                this.options[opt] = opts[opt];
            }
        }
        this.particles = [];
        this.x = x + 0.5;
        this.y = y + 0.5;
        this.density_accumulator = 0;
        this.dead = false;
        this.dying = false;
    }

    update() {
        if (!this.dying) {
            this.density_accumulator += this.options.density;
            for (let i = 0; i < this.density_accumulator; i++) {
                this.particles.push(new Particle(this.x + (Math.random() - 0.5), this.y + (Math.random() - 0.5), this.options));
                this.density_accumulator -= 1;
            }
            if (!this.options.static) {
                this.options.lifetime -= deltaTime;
                if (this.options.lifetime <= 0) {
                    this.dying = true;
                }
            }
            if (this.options.following) {
                this.x = this.options.following.pos.x + 0.5;
                this.y = this.options.following.pos.y + 0.5;
            }
        }
    }

    render() {
        for (let p = this.particles.length - 1; p >= 0; p--) {
            let particle = this.particles[p];
            particle.render();
            if (particle.dead) {
                this.particles.splice(p, 1);
                if (this.dying && this.particles.length == 0) {
                    this.dead = true;
                }
            }
        }
        this.update();
    }
}