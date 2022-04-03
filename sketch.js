let mapSize = 200;
let tileSize = 32;
let inc = 0.01;
let seed;
let debugMode = false;
let depthMap = [];
let bossIsland = [];
let main_canvas;
let images = {};
let gm;
let miniMap;
let minimap_enabled = true;
let interval;
let binterval;
let mx = 0;
let my = 0;
let x = 0;
let y = 0;
let renderTime = 0;
let tickDelta = 0;
let tickTime = 0;
let ticks = 0;
let do_tick = true;
let offScreenTiles = 0;
let onScreenTiles = 0;
let player;
let sales_man;
let player_deaths = [];
let boss;
let rain;
let wildlife = [];
let players = [];
let items = [];
let entities = [];
let zoom = 2.5;
let targetZoom = zoom;
let twidth;
let theight;
let tx;
let ty;
let offScreenCharacters = 0;
let onScreenCharacters = 0;
let updateTime = 50;
let start = Date.now();
let gameSpeed = 1;
let night = true;
let time = 700;
let time_ticking = true;
let days_elapsed = 0;
let time_filter;
let effect_filter;
let world_effects = false;
let world_effect_opacity = 0;
let time_cycle = true;
let update_filter = true;
let battling = false;
let battleDay = -1;
let fpss = [];
let fps = 0;
let fancy_graphics = true;
let dead_players = 0;
let emitters = [];
let messageQueue = [];
let messageTimeout = 15000;
let bg_music_playing = false;
let next_player_id = Math.floor(Math.random() * player_names.length);

let ui;

function newMessage(message, color = "white", style = "normal", icon = images.blank) {
    messageQueue.push({
        color: color,
        style: style,
        message: message,
        time: Date.now(),
        icon: icon
    });
}

function renderPlayerData() {
    let w = 250;
    let xs = 10; //width - (355 + w);
    let leaders = playerData(false);
    if (leaders.length > 0) {
        let c = leaders.length; //min(12, leaders.length);
        let h = c * 20;
        let y = miniMap.size + 20;
        let iconPadding = 1;
        let padding = 5;
        let iconSize = 14;
        fill(0, 204);
        rect(xs, y, w, h + padding);
        fill(255, 202, 0);
        textStyle(NORMAL);
        textSize(14);
        for (let i = 0; i < c; i++) {
            let leader = leaders[i];
            if (leader.dead) continue;
            text(`${leader.name}`, xs + 4, y + 16);
            let tw = textWidth(`${leader.name}`);
            fill(200, 200);
            rect(xs + 80 + padding - iconPadding, y + padding - iconPadding, (iconSize + (2 * iconPadding)), (iconSize + (2 * iconPadding)));
            image(leader.weapon.image, xs + 80 + padding, y + padding, iconSize, iconSize);
            if (leader.armor) {
                rect(xs + 80 + padding + 18 - iconPadding, y + padding - iconPadding, (iconSize + (2 * iconPadding)), (iconSize + (2 * iconPadding)));
                image(leader.armor.image, xs + 80 + padding + (iconSize + (2 * iconPadding)), y + padding, iconSize, iconSize);
            }
            fill(255, 202, 0);
            textAlign(RIGHT);
            text(`${leader.health}`, xs + (w - padding), y + (iconSize + (2 * iconPadding)));
            image(images.health, xs + (w - padding) - 46 - padding, y + padding, iconSize, iconSize);
            text(`${leader.coins}`, xs + (w - padding) - 62, y + (iconSize + (2 * iconPadding)));
            image(images.coin, xs + (w - padding) - 59 - 25 - 2 - iconSize, y + padding, iconSize, iconSize);
            textAlign(LEFT);
            y += 20;
        }
    }
}

function renderMessages() {
    let xs = width - 345;
    let c = 0;
    let now = Date.now();
    let yoff = 0;
    noStroke();
    for (let i = messageQueue.length - 1; i >= 0; i--) {
        let y = 25 + ((min(messageQueue.length, 12) - c) * 20);
        if (c > 11) {
            continue;
        }
        c++;
        let msg = messageQueue[i];
        if (now - msg.time > (messageTimeout - 1000)) {
            let yo = map(now - msg.time - (messageTimeout - 1000), 0, 1000, 0, 20);
            y -= yo;
            yoff += yo;
        }
        let col = color(msg.color);
        let a = Math.floor(map(now - msg.time - (messageTimeout - 2000), 0, 2000, 255, 0));
        fill(0, min(a / 1.25, 204));
        rect(xs - 5, y - 17 - yoff, 350, 20);
        fill(msg.color);
        if (now - msg.time > messageTimeout) {
            messageQueue.splice(i, 1);
        } else if (now - msg.time > (messageTimeout - 2000)) {
            col.setAlpha(a);
            fill(col);
        }
        textSize(14);
        textStyle(msg.style);
        image(msg.icon, xs - 2, y - 12 - yoff, 14, 14);
        text(msg.message, xs + 14, y - yoff);
    }
}

let sounds = [];
let music = [];


function httpGet(theUrl) {
    var request = new XMLHttpRequest();
    request.open("GET", theUrl, false); // false for synchronous request
    request.send(null);
    return request.responseText;
}
let load_lists = JSON.parse(httpGet("assets/list.php"));

let imgs;
let load_sounds;
let load_music;

p5.disableFriendlyErrors = true;

function preload() {
    imgs = load_lists.images;
    load_sounds = load_lists.audio;
    load_music = load_lists.music;
    for (let img of imgs) {
        images[img] = loadImage(`assets/images/${img}.png`);
    }
    for (let sound of load_sounds) {
        sounds[sound] = loadSound(`assets/audio/${sound}.mp3`);
        sounds[sound].setVolume(0.6);
    }

    for (let song of load_music) {
        music[song] = loadSound(`assets/music/${song}.mp3`);
        music[song].setVolume(0.6);
    }
}

function play_bg() {
    if (!bg_music_playing) {
        music["storm-clouds-purpple-cat"].play();
        bg_music_playing = true;
        rain.start();
        setTimeout(() => {
            rain.stop()
        }, 155000);
    }
}

function setup() {
    /* dist = function (x1, y1, x2, y2, z1, z2) {
        if (z1 && z2) {
            return Math.hypot(x2 - x1, y2 - y1, z2 - z1);
        } else {
            return Math.hypot(x2 - x1, y2 - y1);
        }
    } */
    /* image = function (img, x, y, w, h) {
        drawingContext.drawImage(img.canvas, x, y, w, h);
    } */
    pixelDensity(1);
    main_canvas = createCanvas(window.innerWidth, window.innerHeight);
    drawingContext.imageSmoothingEnabled = false;
    drawingContext.mozImageSmoothingEnabled = false;
    drawingContext.webkitImageSmoothingEnabled = false;

    time_filter = createGraphics(tileSize, tileSize);
    effect_filter = createGraphics(tileSize, tileSize);
    effect_filter.noStroke();
    time_filter.noStroke();
    canvas.onclick = (e) => {
        let mx = Math.floor(((e.clientX - x) / zoom) / tileSize);
        let my = Math.floor(((e.clientY - y) / zoom) / tileSize);
        let enemyFound = false;
        for (let animal of wildlife) {
            if (dist(animal.pos.x, animal.pos.y, mx, my) <= 1.2) {
                if (!animal.dead && !(animal instanceof Companion)) {
                    player.setEnemy(animal, true);
                    enemyFound = true;
                    break;
                }
            }
        }
        if (dist(boss.pos.x, boss.pos.y, mx, my) <= 1.2) {
            player.setEnemy(boss, true);
            enemyFound = true;
        }
        if (!enemyFound) {
            let t = gm.tile(mx, my);
            if (t.type != "mountain") {
                player.setTarget(mx, my, true);
            }
        }
    }
    //window.onclick = play_bg;
    window.onwheel = (e) => {
        if (e.deltaY < 0)
            targetZoom += 0.1;
        else
            targetZoom -= 0.1;
        if (targetZoom < 0.5) targetZoom = 0.5;
        if (targetZoom > 4) targetZoom = 4;
    }
    noSmooth();
    seed = Math.floor(Math.random() * 1000000000);
    noiseSeed(seed);
    noiseDetail(4);
    miniMap = new MiniMap();
    miniMap.init();
    gm = new GameMap(mapSize, mapSize, depthMap);
    rain = new Rain();
    ui = new UI();
    let text = new TextBox(0, 0, "Potato");
    let win = new UIWindow("Stats", 300, 300);
    win.addComponent(text);
    ui.addWindow(win);
    win.open();
    spawn();
    spawnMisc();
    tick();

}

function spawnMisc() {
    wildlife = [];
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            let spawn = pickSpawn();
            let other = new Player(spawn.x, spawn.y);
            if (Math.random() < 0.5) other.armor = new Armor();
            if (Math.random() < 0.5) {
                other.weapon = new Dagger();
                if (Math.random() < 0.25) other.weapon = new Sword();
            }
            players.push(other);
        }, i * 500 + (Math.random() * 500));
    }
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            let spawn = pickSpawn();
            wildlife.push(chooseRandom(new Bunny(spawn.x, spawn.y), new Chicken(spawn.x, spawn.y)));
        }, i * 500 + (Math.random() * 500));
    }
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            let spawn = pickSpawn();
            wildlife.push(new Bunny(spawn.x, spawn.y));
        }, i * 500 + (Math.random() * 500));
    }
    window.spawnInterval = setInterval(spawnMore, 1000);
}

function spawnMore() {
    if (wildlife.length < 65) {
        if (night) {
            if (Math.random() < 0.5) {
                let r = Math.floor(Math.random() * 5);
                if (r == 4 && Math.random() < 0.5) {
                    r = Math.floor(random * 6);
                }
                switch (r) {
                    case 0:
                        setTimeout(() => {
                            let spawn = pickSpawn();
                            let bear = new Bear(spawn.x, spawn.y);
                            bear.weapon = chooseRandom(new Sword(), new Club(), new Dagger());
                            wildlife.push(bear);
                        }, 500 + (Math.random() * 500));
                        break;
                    case 1:
                        for (let i = 0; i < 2; i++) {
                            setTimeout(() => {
                                let spawn = pickSpawn();
                                let ghost = new Ghost(spawn.x, spawn.y)
                                if (Math.random() < 0.1) {
                                    ghost.armor = new SteelArmor();
                                }
                                wildlife.push(ghost);
                            }, 500 + (Math.random() * 500));
                        }
                        break;
                    case 2:
                        setTimeout(() => {
                            let spawn = pickSpawn();
                            wildlife.push(new Dragon(spawn.x, spawn.y));
                        }, 500 + (Math.random() * 500));
                        break;

                }
            }
        } else {
            if (Math.random() < 0.5) {
                let r = Math.floor(Math.random() * 5);
                let spawn = pickSpawn();
                let duration = 500 + (Math.random() * 500);
                switch (r) {
                    case 0:
                        setTimeout(() => {
                            wildlife.push(new Bunny(spawn.x, spawn.y));
                        }, duration);
                        break;
                    case 1:
                        setTimeout(() => {
                            wildlife.push(new Chicken(spawn.x, spawn.y));
                        }, duration);
                        break;
                    case 2:
                        setTimeout(() => {
                            wildlife.push(new Dog(spawn.x, spawn.y));
                        }, duration);
                        break;
                    case 3:
                        setTimeout(() => {
                            wildlife.push(new Squirrel(spawn.x, spawn.y));
                        }, duration);
                        break;
                }
            }
            if (Math.random() < 0.5) {
                if (players.length - dead_players < 20) {
                    setTimeout(() => {
                        let spawn = pickSpawn();
                        let other = new Player(spawn.x, spawn.y);
                        if (Math.random() < 0.5) other.armor = new Armor();
                        if (Math.random() < 0.5) {
                            other.weapon = new Dagger();
                            if (Math.random() < 0.25) other.weapon = new Sword();
                        }
                        players.push(other);
                    }, 500 + (Math.random() * 500));
                }
            }
        }
    }
}

function getPlayerByName(name) {
    for (let player of players) {
        if (player.display_name == name) {
            return player;
        }
    }
}

function spawn() {
    let spawn = {
        x: 150,
        y: 150
    };
    player = new Player(spawn.x, spawn.y);
    player.display_name = "...";
    player.armor = new Armor();
    if (Math.random() < 0.5) player.armor = new IronArmor();
    else if (Math.random() < 0.5) player.armor = new SteelArmor();
    player.isUser = true;
    players.push(player);
    sales_man = new SalesMan(spawn.x, spawn.y);
    boss = new Boss(mapSize / 2 - 0.5, mapSize / 2 - 0.5);
    boss.weapon = new Sword();
    boss.display_name = "DoomSphere";

}

function setGlobals() {
    mx = Math.floor(((mouseX - x) / zoom) / tileSize);
    my = Math.floor(((mouseY - y) / zoom) / tileSize);
    twidth = (width / tileSize / zoom) + 1;
    theight = (height / tileSize / zoom) + 1;
    tx = -x / tileSize / zoom - 1;
    ty = -y / tileSize / zoom - 1;
    onScreenCharacters = 0;
    offScreenCharacters = 0;
}

function draw() {
    renderTime = Date.now();
    fpss.push(frameRate());
    if (fpss.length > 100) {
        fpss.splice(0, 1);
    }
    fps = fpss.reduce((prev, curr) => {
        return prev + curr;
    });
    fps /= fpss.length;
    deltaTime *= gameSpeed;
    if (zoom != targetZoom) {
        zoom = targetZoom;
    }
    if (fancy_graphics) {
        drawingContext.shadowBlur = 0;
        drawingContext.shadowColor = "rgba(255,255,200,0.6)";
    }
    cursor(ARROW);
    orientScreen();
    setGlobals();
    translate(x, y);
    scale(zoom);
    gm.render();
    for (let entity of entities) {
        entity.render();
    }
    for (let death of player_deaths) {
        image(images.death_marker, death.x * tileSize, death.y * tileSize, tileSize, tileSize);
    }
    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];
        item.render();
        if (item.dead) {
            items.splice(i, 1);
        }
    }
    if (night || rain.raining) {
        let radius = 40;
        if (!rain.raining) {
            if (time < 600 && time > 500) {
                radius *= (600 - time) / 100;
            }
            if (time > 1800 && time < 1900) {
                radius *= 1 - ((1900 - time) / 100);
            }
        }
        if (fancy_graphics) drawingContext.shadowBlur = radius;
    }
    let list = [...wildlife, ...players, boss, sales_man];
    list.sort((a, b) => {
        return a.pos.y - b.pos.y;
    });
    for (let item of list) {
        item.render();
    }
    /* for (let animal of wildlife) {
        animal.render();
    }
    boss.render();
    sales_man.render();
    for (let player of players) {
        player.render();
    } */
    for (let e = emitters.length - 1; e >= 0; e--) {
        let emitter = emitters[e];
        emitter.render();
        if (emitter.dead) {
            emitters.splice(e, 1);
        }
    }
    if (zoom < 1) {
        let x = player.pos.x * tileSize + 16;
        let y = player.pos.y * tileSize;
        fill(255, 0, 200);
        triangle(x, y - 11, x - 12, y - 41, x + 12, y - 41);
    }

    rain.render();
    for (let player of players) {
        player.update();
    }
    sales_man.update();
    boss.update();
    for (let animal of wildlife) {
        animal.update();
    }

    if (debugMode) {
        fill(255, 125);
        stroke(0);
        strokeWeight(1);
        ellipse(player.target.x * tileSize + (tileSize / 2), player.target.y * tileSize + (tileSize / 2), 10);
    }
    if (fancy_graphics) drawingContext.shadowBlur = 0;
    renderUI();
    ui.windows[0].components[0].setText(round(fps.toString(), 2));
    ui.render();
}

function tick() {
    if (do_tick) {
        tickTime = Date.now();
        tickDelta = (tickTime - start) * gameSpeed;
        start = tickTime;
        gm.tick();
        for (let a = wildlife.length - 1; a >= 0; a--) {
            let animal = wildlife[a];
            animal.tick();
            if (animal.dead) {
                if (animal.despawn > 0) {
                    animal.despawn -= tickDelta;
                } else {
                    animal.ondespawn();
                    wildlife.splice(a, 1);
                }
            }
            if (Math.random() < 0.001) {
                if (animal instanceof Bunny) {
                    animal.dead = true;
                    wildlife[a] = new FeralBunny(animal.pos.x, animal.pos.y);
                    wildlife[a].display_name = animal.display_name;
                    wildlife[a].outfit = animal.outfit;
                    wildlife[a].weapon = new Dagger();
                    wildlife[a].armor = (Math.random() < 0.5) ? new IronArmor() : new SteelArmor();
                    newMessage("A bunny has become evil", "rgb(133,18,18)", "bold", images.exclaim);
                }
            }
        }
        for (let p = players.length - 1; p >= 0; p--) {
            let player = players[p];
            player.tick();
            if (player.dead) {
                if (player.despawn > 0) {
                    player.despawn -= tickDelta;
                } else {
                    player.ondespawn();
                    players.splice(p, 1);
                    dead_players--;
                }
            }
        }
        sales_man.tick();
        boss.tick();
        for (let entity of entities) {
            entity.tick();
        }
        miniMap.update();
        if (time_ticking) time += tickDelta / 50;
        if (time > 2399) {
            time = 0;
            days_elapsed++;
        }
        if (time_cycle && ticks % 2 == 0) {
            let a = 100;
            let l = 1;
            if (time < 800 && time > 500) {
                l = (800 - time) / 300;
                a *= l;
            } else if (time >= 800 && time <= 1600) {
                a = 0;
            } else if (time > 1600 && time < 1900) {
                l = 1 - ((1900 - time) / 300);
                a *= l;
            }
            if (time < 600 || time > 1800) {
                night = true;
            } else {
                night = false;
            }
            let c = lerpColor(color(255, 216, 0, a), color(0, 0, 161, a), l);
            time_filter.clear();
            time_filter.fill(c);
            time_filter.rect(0, 0, tileSize, tileSize);
            if (rain.fading || rain.raining) {
                let a = 100;
                if (rain.raining) {
                    if (rain.rainFade > 0) {
                        a = (1 - (rain.rainFade / rain.fadeTime)) * 100;
                    }
                } else {
                    if (rain.rainFade > 0) {
                        a = (rain.rainFade / rain.fadeTime) * 100;
                    }
                }
                rain.rainFade -= tickDelta;
                if (rain.rainFade <= 0) {
                    rain.fading = false;
                }
                time_filter.fill(51, a);
                time_filter.rect(0, 0, tileSize, tileSize);
            }
        }
        if (days_elapsed > 1 && !battling && battleDay != days_elapsed && time > 600 && time < 700) {
            if (boss.active) {
                battleDay = days_elapsed;
            } else {
                battling = true;
                battleDay = days_elapsed;
                boss.active = true;
                time_ticking = false;
                world_effects = true;
                world_effect_opacity = 0;
                effect_filter.clear();
                sounds.deep_boom.play();
                setTimeout(() => {
                    for (let player of players) {
                        let p = getPointNear(boss.pos.x, boss.pos.y, 5);
                        player.teleport(p.x, p.y);
                        player.setEnemy(boss, true);
                    }
                }, (75 / (deltaTime / 40)) * deltaTime);
            }
        }
        if (player.dead) {
            player_deaths.push({
                x: player.pos.x,
                y: player.pos.y
            });
            player.respawn();
        }
        if (tickTime - rain.last_rain > 120000) {
            if (Math.random() < 0.005) {
                rain.start(Math.random() * 60000 + 30000);
            }
        }
        ticks++;
    }
    setTimeout(tick, updateTime);
}

function formatTime(time, twelvehour = true) {
    time = Math.floor(time);
    let suffix = "";
    if (twelvehour) {
        if (time > 1199) suffix = " PM";
        else suffix = " AM";
        if (time > 1299) {
            time -= 1200;
        }
    }
    let out = `000${time}`.slice(-4);
    out = out.split('');
    out.splice(2, 0, ":");
    out = out.join('') + suffix;
    return out;
}

function newItem(pos, contents, options) {
    items.push(new ItemContainer(pos, contents, options));
}

function summonAll() {
    for (let p of players) {
        if (!p.isUser) p.setTarget(player.pos.x, player.pos.y)
    }
}

function spreadPlayers(onteleport) {
    for (let p of players) {
        let spawn = pickSpawn();
        p.teleport(spawn.x, spawn.y, onteleport);
    }
}

function isBossIsland(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    return (bossIsland[y][x] === true);
}

function pickSpawn(_x = 0, _y = 0, w = mapSize, h = mapSize) {
    let x = Math.floor(Math.random() * w) + _x;
    let y = Math.floor(Math.random() * h) + _y;
    let tile = gm.tile(x, y);
    let c = 0;
    while (tile instanceof Water || tile instanceof Mountain || isBossIsland(x, y) || (boss && dist(tile.x, tile.y, boss.pos.x, boss.pos.y) < 20)) {
        x = Math.floor(Math.random() * mapSize);
        y = Math.floor(Math.random() * mapSize);
        tile = gm.tile(x, y);
        if (c > 100) {
            break;
        }
        c++;
    }

    return {
        x: x,
        y: y
    }
}

function renderUI() {
    resetMatrix();
    textSize(12);
    if (minimap_enabled) miniMap.render();
    let info = `Day: ${days_elapsed+1} Time: ${formatTime(time)} Coins: ${player.coins} OnSC: ${onScreenCharacters} OffSC: ${offScreenCharacters} OnST: ${onScreenTiles} OffST: ${offScreenTiles} FPS: ${Math.floor(fps)}`;
    let tWidth = textWidth(info);
    fill(0, 125);
    stroke(0);
    rect(width - tWidth - 15, 5, tWidth + 10, 20);
    fill(255);
    text(info, width - tWidth - 10, 20);
    renderMessages();
    renderPlayerData();
    renderWeaponInfo();
}

function renderWeaponInfo() {
    translate(width - 80, height - 80);
    let x = 4;
    let y = 4;
    player.weapon.render(x, y, 64, 64, true);

    for (let enchant of player.weapon.enchants) {
        y -= 36;
        enchant.render(x + 32, y, tileSize, tileSize);
    }
}

function getPointNear(x = 0, y = 0, r = 1) {
    let theta = Math.random() * (Math.PI * 2);
    x = x + (Math.cos(theta) * r);
    y = y + (Math.sin(theta) * r);
    return {
        x: x,
        y: y
    }
}

function chooseRandom() {
    if (arguments.length > 0) {
        let data = [];
        for (let arg of arguments) {
            if (Array.isArray(arg)) {
                data.push(...arg);
            } else {
                data.push(arg);
            }
        }
        let sel = Math.floor(Math.random() * data.length);
        return data[sel];
    }
    return null;
}

function playerData(hideNone = true) {
    let out = players.map((e) => {
        return {
            name: e.display_name,
            coins: e.coins,
            health: round(e.health, 1),
            weapon: e.weapon,
            armor: e.armor,
            dead: e.dead
        }
    });
    out = out.sort((a, b) => b.coins - a.coins);
    if (hideNone) {
        for (let i = out.length - 1; i >= 0; i--) {
            if (out[i].coins == 0) {
                out.splice(i, 1);
            }
        }
    }
    return out;
}

function onscreen(x, y) {
    return (y > ty && y < ty + theight && x > tx && x < tx + twidth);
}

function orientScreen() {
    let psx = (player.pos.x * tileSize) * zoom + x;
    let psy = (player.pos.y * tileSize) * zoom + y;

    if (psx > (width / 2)) {
        x -= psx - (width / 2);
    }
    if (psx < (width / 2)) {
        x += (width / 2) - psx;
    }
    if (x > 0) x = 0;
    if (x < -(mapSize * tileSize * zoom - width)) {
        x = -(mapSize * tileSize * zoom - width);
    }

    if (psy > (height / 2)) {
        y -= psy - (height / 2);
    }
    if (psy < (height / 2)) {
        y += (height / 2) - psy;
    }
    if (y > 0) y = 0;
    if (y < -(mapSize * tileSize * zoom - height)) {
        y = -(mapSize * tileSize * zoom - height);
    }
}

window.onresize = function () {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

window.onkeyup = (e) => {
    if (e.key == "l") {
        player.locked = !player.locked;
    } else if (e.key == "c") {
        if (player.enemies.length > 0) {
            player.enemies.splice(player.enemies.length - 1, 1);
            player.hasTarget = false;
            player.following = false;
        }
    } else if (e.key == "r") {
        if (rain.raining) {
            rain.stop();
        } else {
            rain.start();
        }
    } else if (e.key == "d") {
        let d = new Dog(player.pos.x, player.pos.y);
        d.armor = new Armor();
        wildlife.push(d);
        player.addCompanion(d);
    }
}

function doggo() {
    let d = new Dog(player.pos.x, player.pos.y);
    d.armor = new Armor();
    wildlife.push(d);
    player.addCompanion(d);
}