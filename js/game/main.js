/* ============ Volantín Survivor — Motor principal ============ */
"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const Game = {
  state: "menu", // menu | intro | play | levelup | shop | gameover | victory | pause
  running: false,
  time: 0,
  stageIndex: 0,
  stage: null,
  player: null,
  enemies: [],
  projectiles: [],
  enemyProjectiles: [],
  pickups: [],
  summons: [],
  waves: [],
  enemyWaves: [],
  boss: null,
  bossIntro: 0,
  pendingLevelups: 0,
  passiveLevels: {},
  spawnTimer: 0,
  minibossSpawned: false,
  bossSpawned: false,
  stageEnding: false,
  camX: 0, camY: 0,
  shake: 0,
  toastMsg: null,
  toastTimer: 0,
  groundTile: null,
  props: [],
  stars: [],
  _raf: null,
  _last: 0,
  _idCounter: 1,

  /* ---------- Setup ---------- */
  init() {
    Input.init();
    Assets.init();
    AudioSys.init();
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.bindUI();
    this.makeStars();
    HUD.updateMenuCoins();
    this.loop(performance.now());
  },

  resize() {
    const wrap = document.getElementById("game-wrap");
    const aspect = 16 / 9;
    let w = wrap.clientWidth, h = wrap.clientHeight;
    if (w / h > aspect) w = h * aspect;
    else h = w / aspect;
    // resolución interna estilo retro
    const baseW = 960, baseH = 540;
    canvas.width = baseW;
    canvas.height = baseH;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.imageSmoothingEnabled = false;
  },

  makeStars() {
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random(), y: Math.random() * 0.7,
        s: U.rand(1, 2.4), tw: U.rand(0, Math.PI * 2),
        spd: U.rand(0.4, 1.4)
      });
    }
  },

  bindUI() {
    const $ = (id) => document.getElementById(id);
    $("btn-play").addEventListener("click", () => { AudioSys.resume(); AudioSys.ui(); this.startRun(); });
    $("btn-shop").addEventListener("click", () => { AudioSys.resume(); AudioSys.ui(); this.openShop(false); });
    $("btn-help").addEventListener("click", () => { AudioSys.ui(); HUD.hide("menu"); HUD.show("help"); });
    $("btn-help-back").addEventListener("click", () => { AudioSys.ui(); HUD.hide("help"); HUD.show("menu"); });

    $("btn-shop-menu").addEventListener("click", () => { AudioSys.ui(); this.goMenu(); });
    $("btn-shop-play").addEventListener("click", () => { AudioSys.ui(); this.afterShop(); });

    $("btn-retry").addEventListener("click", () => { AudioSys.ui(); this.startRun(); });
    $("btn-go-shop").addEventListener("click", () => { AudioSys.ui(); this.openShop(false); });
    $("btn-go-menu").addEventListener("click", () => { AudioSys.ui(); this.goMenu(); });
    $("btn-vic-menu").addEventListener("click", () => { AudioSys.ui(); this.goMenu(); });
    $("btn-pause-menu").addEventListener("click", () => { AudioSys.ui(); this.stopRun(); this.goMenu(); });
  },

  goMenu() {
    this.stopRun();
    HUD.hideAllOverlays();
    HUD.show("menu");
    HUD.updateMenuCoins();
    this.state = "menu";
    AudioSys.stopMusic();
  },

  /* ---------- Nueva partida ---------- */
  startRun() {
    HUD.hideAllOverlays();
    this.player = Player.create();
    WeaponSystem.reset();
    WeaponSystem.add("hilo", 1);
    Shop.applyAll(this);
    this.passiveLevels = {};
    this.stageIndex = 0;
    this.time = 0;
    this.startStage(0);
    AudioSys.resume();
  },

  startStage(idx) {
    this.stageIndex = idx;
    this.stage = STAGES[idx];
    this.time = 0;
    this.enemies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.pickups = [];
    this.summons = [];
    this.waves = [];
    this.enemyWaves = [];
    this.boss = null;
    this.bossIntro = 0;
    this.pendingLevelups = 0;
    this.spawnTimer = 0.5;
    this.minibossSpawned = false;
    this.bossSpawned = false;
    this.stageEnding = false;
    this.shake = 0;
    this.toastMsg = null;

    // reposicionar jugador
    this.player.x = WORLD.w / 2;
    this.player.y = WORLD.h / 2;
    this.player.trail = [];
    if (this.player.hp <= 0) this.player.hp = this.player.maxHp;

    // suelo y props
    this.groundTile = makeGroundTile(this.stage);
    this.buildProps();

    HUD.show("hud");
    HUD.renderStageIntro(this.stage);
    HUD.hideAllOverlays();
    HUD.show("stage-intro");
    this.state = "intro";
    setTimeout(() => {
      if (this.state !== "intro") return;
      HUD.hide("stage-intro");
      this.state = "play";
      this.running = true;
      AudioSys.startMusic();
    }, 1800);
  },

  buildProps() {
    this.props = [];
    const st = this.stage;
    for (let i = 0; i < st.propCount; i++) {
      const spriteName = U.pick(st.props);
      const spr = Assets.get(spriteName);
      let x, y, tries = 0;
      do {
        x = U.rand(80, WORLD.w - 80);
        y = U.rand(80, WORLD.h - 80);
        tries++;
      } while (tries < 20 && U.dist(x, y, WORLD.w / 2, WORLD.h / 2) < 260);
      this.props.push({
        x, y, sprite: spriteName,
        w: spr.width, h: spr.height,
        solid: spriteName === "table" || spriteName === "tree" || spriteName === "rock" || spriteName === "cactus"
      });
    }
    // banderas decorativas en el centro
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      this.props.push({
        x: WORLD.w / 2 + Math.cos(a) * 380,
        y: WORLD.h / 2 + Math.sin(a) * 380,
        sprite: "flagPole", w: 28, h: 56, solid: false
      });
    }
  },

  stopRun() {
    this.running = false;
    this.state = "menu";
    AudioSys.stopMusic();
    HUD.hide("hud");
  },

  toast(msg) {
    this.toastMsg = { text: msg, life: 2.4, maxLife: 2.4 };
  },

  /* ---------- Utilidades de combate ---------- */
  nearestEnemies(x, y, n, maxDist = Infinity) {
    const arr = [];
    for (const e of this.enemies) {
      if (e.dead) continue;
      const d = U.dist(x, y, e.x, e.y);
      if (d <= maxDist) arr.push({ e, d });
    }
    arr.sort((a, b) => a.d - b.d);
    return arr.slice(0, n).map(o => o.e);
  },

  damageEnemy(e, amount, weaponId, allowCrit = true) {
    if (e.dead) return;
    let dmg = amount;
    let crit = false;
    if (allowCrit && Math.random() < this.player.stats.crit) {
      dmg *= 2; crit = true;
    }
    e.hp -= dmg;
    e.flash = 0.09;
    Particles.damageText(e.x, e.y - e.radius, dmg, crit ? "#ff6b6b" : "#ffd43b", crit);
    Particles.burst(e.x, e.y, crit ? 6 : 3, ["#fff", "#ffd43b"], { spMax: 140, life: 0.3, size: 3 });
    if (crit) this.shake = Math.max(this.shake, 3);
    AudioSys.hit();
    if (e.hp <= 0) this.killEnemy(e, weaponId);
  },

  killEnemy(e, weaponId) {
    if (e.dead) return;
    e.dead = true;
    const p = this.player;
    p.kills++;

    // XP
    const xp = Math.max(1, Math.round(e.xp * (1 + this.stageIndex * 0.15)));
    this.pickups.push({ type: "xp", x: e.x + U.rand(-6, 6), y: e.y + U.rand(-6, 6), value: xp, size: xp >= 8 ? 3 : xp >= 4 ? 2 : 1, vx: U.rand(-40, 40), vy: U.rand(-40, 40), life: 30 });

    // monedas
    if (Math.random() < e.coins) {
      const val = Math.max(1, Math.round((e.isBoss ? e.coins : U.randInt(1, 2 + this.stageIndex)) * (e.isMini ? 6 : 1)));
      this.pickups.push({ type: "coin", x: e.x, y: e.y, value: val, size: 1, vx: U.rand(-50, 50), vy: U.rand(-50, 50), life: 30 });
    }
    // vida ocasional
    if (!e.isBoss && Math.random() < 0.012) {
      this.pickups.push({ type: "heart", x: e.x, y: e.y, value: 25, size: 1, vx: 0, vy: 0, life: 25 });
    }

    // partículas
    const colors = e.isBoss ? ["#f03e3e", "#ffd43b", "#fff"] :
      e.type === "empanada" || e.type === "sopaipilla" ? ["#f4b860", "#e09b3d"] :
      e.type === "sombra" ? ["#495057", "#f03e3e"] :
      ["#e03131", "#fff", "#1971c2"];
    Particles.burst(e.x, e.y, e.isBoss ? 60 : 10, colors, { spMax: e.isBoss ? 340 : 200, size: e.isBoss ? 7 : 4 });
    if (e.isBoss || e.isMini) Particles.confetti(e.x, e.y, e.isBoss ? 30 : 14);

    if (e.isBoss) {
      AudioSys.bossDie();
      this.shake = 14;
      this.onBossKilled();
    } else if (e.isMini) {
      AudioSys.explode();
      this.toast("¡Monito de la Carreta derrotado! +Lucumí");
    } else if (Math.random() < 0.3) {
      AudioSys.xp();
    }
  },

  hurtPlayer(damage, fromX, fromY) {
    const p = this.player;
    if (p.invuln > 0 || p.dead || this.state !== "play") return;
    let dmg = Math.max(1, damage - p.stats.armor);
    p.hp -= dmg;
    p.invuln = 0.7;
    this.shake = Math.max(this.shake, 6);
    Particles.burst(p.x, p.y, 8, "#ff6b6b", { spMax: 180 });
    Particles.damageText(p.x, p.y - 18, "-" + dmg, "#ff6b6b", true);
    AudioSys.hurt();
    // pequeño empuje lejos del daño
    const a = U.angle(fromX, fromY, p.x, p.y);
    p.x += Math.cos(a) * 14;
    p.y += Math.sin(a) * 14;

    if (p.hp <= 0) {
      if (p.revives > 0) {
        p.revives--;
        p.hp = Math.ceil(p.maxHp * 0.5);
        p.invuln = 2.5;
        Particles.burst(p.x, p.y, 40, ["#ffd43b", "#fff"], { spMax: 300 });
        this.toast("¡SEGUNDO AIRE! Sigues en pie");
        AudioSys.victory();
      } else {
        p.hp = 0;
        p.dead = true;
        this.onGameOver();
      }
    }
  },

  /* ---------- Final de etapa ---------- */
  onBossKilled() {
    this.boss = null;
    this.stageEnding = true;
    // limpiar enemigos con confeti
    setTimeout(() => {
      if (this.state !== "play") return;
      for (const e of this.enemies) {
        if (!e.dead && !e.isBoss) {
          e.dead = true;
          if (Math.random() < 0.5) Particles.confetti(e.x, e.y, 6);
        }
      }
      this.enemyProjectiles = [];
      const bonus = 40 + this.stageIndex * 30;
      this.player.coins += Math.round(bonus * this.player.stats.coinMult);
      AudioSys.victory();

      if (this.stageIndex >= STAGES.length - 1) {
        // ¡victoria total!
        this.running = false;
        HUD.hide("hud");
        HUD.renderVictory(this);
        HUD.hideAllOverlays();
        HUD.show("victory");
        this.state = "victory";
        AudioSys.stopMusic();
      } else {
        // tienda entre etapas
        this.running = false;
        AudioSys.stopMusic();
        HUD.hide("hud");
        this.openShop(true);
      }
    }, 900);
  },

  openShop(betweenStages) {
    this._shopBetween = betweenStages;
    HUD.hideAllOverlays();
    HUD.show("shop");
    Shop.render();
    document.getElementById("btn-shop-play").classList.toggle("hidden", !betweenStages);
    this.state = "shop";
  },

  afterShop() {
    HUD.hide("shop");
    this.startStage(this.stageIndex + 1);
  },

  onGameOver() {
    this.running = false;
    AudioSys.stopMusic();
    AudioSys.death();
    Particles.burst(this.player.x, this.player.y, 50, ["#e03131", "#fff"], { spMax: 300, size: 6 });
    HUD.renderGameOver(this);
    HUD.hide("hud");
    setTimeout(() => {
      HUD.hideAllOverlays();
      HUD.show("gameover");
      this.state = "gameover";
    }, 1100);
    this.state = "dying";
  },

  onCardChosen() {
    this.pendingLevelups--;
    if (this.pendingLevelups > 0) {
      HUD.renderLevelup(this);
    } else {
      HUD.hide("levelup");
      this.state = "play";
    }
  },

  /* ---------- Spawn director ---------- */
  spawnDirector(dt) {
    const st = this.stage;
    const tFrac = this.time / st.duration;

    // oleadas normales
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.enemies.filter(e => !e.dead).length < 320) {
      const ramp = U.clamp(tFrac, 0, 1);
      this.spawnTimer = Math.max(0.14, 0.95 - ramp * 0.7) / (1 + this.stageIndex * 0.25);
      const count = 1 + Math.floor(ramp * 3) + (U.chance(ramp * 0.6) ? 1 : 0);
      for (let i = 0; i < count; i++) {
        const type = pickWeighted(st.enemies);
        if (!type) continue;
        if (type === "carreta") continue; // solo por evento
        const pos = this.spawnPosition();
        const hpMult = 1 + this.stageIndex * 0.85 + ramp * 1.6;
        const dmgMult = 1 + this.stageIndex * 0.3 + ramp * 0.35;
        Enemies.spawn(this, type, pos.x, pos.y, hpMult, dmgMult);
      }
    }

    // mini jefe
    if (!this.minibossSpawned && tFrac >= st.minibossAt && tFrac < 0.95) {
      this.minibossSpawned = true;
      const pos = this.spawnPosition(380);
      const mb = Enemies.spawn(this, st.miniboss, pos.x, pos.y, 1 + this.stageIndex * 1.2, 1 + this.stageIndex * 0.3);
      if (mb) {
        this.toast("¡APARECIÓ EL MONITO DE LA CARRETA!");
        AudioSys.bossSpawn();
        Particles.burst(mb.x, mb.y, 24, "#ffd43b");
      }
    }

    // jefe de mundo al final
    if (!this.bossSpawned && this.time >= st.duration) {
      this.bossSpawned = true;
      Bosses.spawn(this, st.boss);
      this.toast("¡JEFE DE MUNDO! " + BOSS_DEFS[st.boss].name);
    }
  },

  spawnPosition(minDist = 620) {
    const p = this.player;
    const a = U.rand(Math.PI * 2);
    const d = minDist + U.rand(0, 160);
    let x = p.x + Math.cos(a) * d;
    let y = p.y + Math.sin(a) * d;
    x = U.clamp(x, 40, WORLD.w - 40);
    y = U.clamp(y, 40, WORLD.h - 40);
    return { x, y };
  },

  /* ---------- Update principal ---------- */
  update(dt) {
    if (this.toastMsg) {
      this.toastMsg.life -= dt;
      if (this.toastMsg.life <= 0) this.toastMsg = null;
    }
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 24);

    if (this.state === "intro") {
      Particles.update(dt);
      return;
    }
    if (this.state !== "play" && this.state !== "dying") {
      Particles.update(dt);
      return;
    }

    const playing = this.state === "play";
    if (playing) {
      this.time += dt;
      Player.update(dt, this);
      WeaponSystem.update(dt, this);
      this.spawnDirector(dt);
      if (this.bossIntro > 0) this.bossIntro -= dt;
    }

    // enemigos
    for (const e of this.enemies) {
      if (e.dead) continue;
      if (e.isBoss) updateBoss(e, dt, this);
      else updateEnemy(e, dt, this);
    }
    this.enemies = this.enemies.filter(e => !e.dead);

    // proyectiles del jugador
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      pr.life -= dt;
      if (pr.homing) {
        const tgt = this.nearestEnemies(pr.x, pr.y, 1, 420)[0];
        if (tgt) {
          const a = U.angle(pr.x, pr.y, tgt.x, tgt.y);
          const ca = Math.atan2(pr.vy, pr.vx);
          const na = U.angleLerp(ca, a, Math.min(1, pr.homing * dt));
          const sp = Math.sqrt(pr.vx * pr.vx + pr.vy * pr.vy);
          pr.vx = Math.cos(na) * sp;
          pr.vy = Math.sin(na) * sp;
          pr.rot = na + Math.PI / 2;
        }
      }
      pr.x += pr.vx * dt;
      pr.y += pr.vy * dt;
      if (pr.rotSpeed) pr.rot += pr.rotSpeed * dt;

      let remove = pr.life <= 0 || pr.x < -50 || pr.y < -50 || pr.x > WORLD.w + 50 || pr.y > WORLD.h + 50;

      if (!remove) {
        for (const e of this.enemies) {
          if (e.dead || pr.hit.has(e._id)) continue;
          if (U.circleHit(pr.x, pr.y, pr.radius, e.x, e.y, e.radius)) {
            pr.hit.add(e._id);
            if (pr.explodeRadius > 0) {
              // explosión
              this.damageEnemy(e, pr.damage, pr.weapon);
              Particles.burst(pr.x, pr.y, 14, ["#ffd43b", "#ff922b", "#fff"], { spMax: 260, size: 5 });
              AudioSys.explode();
              this.shake = Math.max(this.shake, 4);
              for (const o of this.enemies) {
                if (o.dead || o === e) continue;
                if (U.dist(pr.x, pr.y, o.x, o.y) < pr.explodeRadius + o.radius) {
                  this.damageEnemy(o, Math.round(pr.damage * 0.7), pr.weapon);
                  const ka = U.angle(pr.x, pr.y, o.x, o.y);
                  o.kbx += Math.cos(ka) * 120;
                  o.kby += Math.sin(ka) * 120;
                }
              }
              // estela
              remove = true;
              break;
            } else {
              this.damageEnemy(e, pr.damage, pr.weapon);
              Particles.burst(pr.x, pr.y, 3, "#fff", { spMax: 120, life: 0.25, size: 3 });
              pr.pierce--;
              if (pr.pierce <= 0) { remove = true; break; }
            }
          }
        }
      }
      if (remove) {
        if (pr.explodeRadius > 0 && pr.life <= 0) {
          // estallido al expirar (lob)
          Particles.burst(pr.x, pr.y, 14, ["#ffd43b", "#b5451b"], { spMax: 260, size: 5 });
          for (const o of this.enemies) {
            if (o.dead) continue;
            if (U.dist(pr.x, pr.y, o.x, o.y) < pr.explodeRadius + o.radius) {
              this.damageEnemy(o, pr.damage, pr.weapon);
            }
          }
          AudioSys.explode();
        }
        this.projectiles.splice(i, 1);
      }
    }

    // proyectiles enemigos
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const pr = this.enemyProjectiles[i];
      pr.life -= dt;
      pr.x += pr.vx * dt;
      pr.y += pr.vy * dt;
      if (pr.trail && Math.random() < 0.5) {
        Particles.spawn({ x: pr.x, y: pr.y, vx: 0, vy: 0, life: 0.3, size: 3, color: pr.color || "#ff922b", glow: true, shape: "circle" });
      }
      let remove = pr.life <= 0 || pr.x < -30 || pr.y < -30 || pr.x > WORLD.w + 30 || pr.y > WORLD.h + 30;
      if (!remove && this.state === "play") {
        if (U.circleHit(pr.x, pr.y, pr.radius, this.player.x, this.player.y, this.player.radius)) {
          this.hurtPlayer(pr.damage, pr.x, pr.y);
          remove = true;
        }
      }
      if (remove) this.enemyProjectiles.splice(i, 1);
    }

    // ondas de jefe (AoE telegrafiadas)
    for (let i = this.enemyWaves.length - 1; i >= 0; i--) {
      const w = this.enemyWaves[i];
      w.life -= dt;
      const t = 1 - Math.max(0, w.life) / w.maxLife;
      w.radius = U.lerp(10, w.maxRadius, t);
      if (this.state === "play" && !w.hit.has("p") && U.dist(w.x, w.y, this.player.x, this.player.y) < w.radius + this.player.radius) {
        w.hit.add("p");
        this.hurtPlayer(w.damage, w.x, w.y);
      }
      if (w.life <= 0) this.enemyWaves.splice(i, 1);
    }

    // ondas del jugador (bandera)
    for (let i = this.waves.length - 1; i >= 0; i--) {
      const w = this.waves[i];
      w.life -= dt;
      const t = 1 - Math.max(0, w.life) / w.maxLife;
      w.rangeNow = w.range * (0.35 + t * 0.85);
      if (!w.applied) {
        w.applied = true;
        for (const e of this.enemies) {
          if (e.dead) continue;
          const d = U.dist(w.x, w.y, e.x, e.y);
          if (d > w.range + e.radius) continue;
          const a = U.angle(w.x, w.y, e.x, e.y);
          let diff = Math.abs(((a - w.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
          if (diff <= w.arc / 2) {
            this.damageEnemy(e, w.damage, w.weapon);
            e.kbx += Math.cos(w.angle) * w.kb;
            e.kby += Math.sin(w.angle) * w.kb;
          }
        }
      }
      if (w.life <= 0) this.waves.splice(i, 1);
    }

    // summons (cueca)
    for (let i = this.summons.length - 1; i >= 0; i--) {
      const s = this.summons[i];
      s.life -= dt;
      s.timer -= dt;
      // wander hacia enemigos cercanos
      const tgt = this.nearestEnemies(s.x, s.y, 1, 500)[0];
      let dx2, dy2;
      if (tgt) { dx2 = tgt.x - s.x; dy2 = tgt.y - s.y; }
      else { dx2 = this.player.x - s.x; dy2 = this.player.y - s.y; }
      const dd = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
      s.x += (dx2 / dd) * s.speed * dt;
      s.y += (dy2 / dd) * s.speed * dt;
      s.angle = Math.atan2(dy2, dx2);
      if (s.timer <= 0) {
        s.timer = 0.55;
        // golpe circular
        for (const e of this.enemies) {
          if (e.dead) continue;
          if (U.circleHit(s.x, s.y, s.radius * 0.55, e.x, e.y, e.radius)) {
            this.damageEnemy(e, s.damage, s.weapon);
            const ka = U.angle(s.x, s.y, e.x, e.y);
            e.kbx += Math.cos(ka) * 90;
            e.kby += Math.sin(ka) * 90;
          }
        }
        Particles.burst(s.x, s.y, 4, ["#ffd43b", "#1971c2"], { spMax: 130, life: 0.35 });
      }
      if (s.life <= 0) {
        Particles.burst(s.x, s.y, 8, "#e5dbff");
        this.summons.splice(i, 1);
      }
    }

    // pickups
    const magnet = this.player.stats.magnet;
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const pk = this.pickups[i];
      pk.life -= dt;
      pk.vx = (pk.vx || 0) * Math.pow(0.02, dt);
      pk.vy = (pk.vy || 0) * Math.pow(0.02, dt);
      pk.x += pk.vx * dt;
      pk.y += pk.vy * dt;

      const d = U.dist(pk.x, pk.y, this.player.x, this.player.y);
      if (d < magnet) {
        const a = U.angle(pk.x, pk.y, this.player.x, this.player.y);
        const pull = U.lerp(560, 160, d / magnet);
        pk.x += Math.cos(a) * pull * dt;
        pk.y += Math.sin(a) * pull * dt;
      }
      if (d < 22) {
        if (pk.type === "xp") {
          this.player.xp += Math.round(pk.value * this.player.stats.xpMult);
          if (Math.random() < 0.4) AudioSys.xp();
        } else if (pk.type === "coin") {
          this.player.coins += Math.max(1, Math.round(pk.value * this.player.stats.coinMult));
          AudioSys.coin();
          Particles.burst(pk.x, pk.y, 4, "#ffd43b", { spMax: 100, life: 0.3 });
        } else if (pk.type === "heart") {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + pk.value);
          AudioSys.tone(660, 0.12, "sine", 0.2, 0, 990);
          Particles.burst(pk.x, pk.y, 8, "#ff8787");
        }
        this.pickups.splice(i, 1);
        continue;
      }
      if (pk.life <= 0) this.pickups.splice(i, 1);
    }

    // level up → pausa
    if (playing && this.state === "play" && this.pendingLevelups > 0 && !this.player.dead) {
      this.state = "levelup";
      HUD.renderLevelup(this);
      HUD.show("levelup");
      AudioSys.levelup();
    }

    // cámara
    const p = this.player;
    const targetX = p.x - canvas.width / 2;
    const targetY = p.y - canvas.height / 2;
    this.camX = U.clamp(targetX, 0, WORLD.w - canvas.width);
    this.camY = U.clamp(targetY, 0, WORLD.h - canvas.height);

    Particles.update(dt);
    HUD.update(this);
  },

  /* ---------- Render ---------- */
  render() {
    const W = canvas.width, H = canvas.height;
    const camX = Math.round(this.camX + (this.shake ? U.rand(-this.shake, this.shake) : 0));
    const camY = Math.round(this.camY + (this.shake ? U.rand(-this.shake, this.shake) : 0));

    // cielo
    if (this.stage) {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, this.stage.skyTop);
      g.addColorStop(1, this.stage.skyBot);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // estrellas
      for (const s of this.stars) {
        const tw = 0.4 + Math.sin(performance.now() / 500 * s.spd + s.tw) * 0.35;
        ctx.globalAlpha = U.clamp(tw, 0.1, 1);
        ctx.fillStyle = "#fff";
        ctx.fillRect(Math.floor(s.x * W), Math.floor(s.y * H), s.s, s.s);
      }
      ctx.globalAlpha = 1;
      // luna/fuegos artificiales de fondo (decorativo)
      this.drawBgFireworks(W, H, camX, camY);
    } else {
      ctx.fillStyle = "#0b1628";
      ctx.fillRect(0, 0, W, H);
    }

    if (!this.stage) return;

    // suelo
    if (this.groundTile) {
      const pat = ctx.createPattern(this.groundTile, "repeat");
      ctx.save();
      ctx.translate(-camX % 64, -camY % 64);
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, W + 64, H + 64);
      ctx.restore();
    }

    // borde del mundo
    ctx.strokeStyle = "rgba(255,212,59,.35)";
    ctx.lineWidth = 6;
    ctx.strokeRect(-camX, -camY, WORLD.w, WORLD.h);

    // props (detrás)
    for (const pr of this.props) {
      const sx = Math.round(pr.x - camX), sy = Math.round(pr.y - camY);
      if (sx < -80 || sy < -80 || sx > W + 80 || sy > H + 80) continue;
      const spr = Assets.get(pr.sprite);
      ctx.fillStyle = "rgba(0,0,0,.28)";
      ctx.beginPath();
      ctx.ellipse(sx, sy + pr.h * 0.35, pr.w * 0.35, pr.h * 0.1, 0, 0, 7);
      ctx.fill();
      ctx.drawImage(spr, sx - pr.w / 2, sy - pr.h * 0.55);
    }

    // sombras de entidades
    for (const e of this.enemies) {
      if (e.dead) continue;
      const sx = Math.round(e.x - camX), sy = Math.round(e.y - camY);
      if (sx < -80 || sy < -80 || sx > W + 80 || sy > H + 80) continue;
      ctx.fillStyle = "rgba(0,0,0,.3)";
      ctx.beginPath();
      ctx.ellipse(sx, sy + e.radius * 0.8, e.radius * 0.85, e.radius * 0.32, 0, 0, 7);
      ctx.fill();
    }

    // pickups
    for (const pk of this.pickups) {
      const sx = Math.round(pk.x - camX), sy = Math.round(pk.y - camY);
      if (sx < -20 || sy < -20 || sx > W + 20 || sy > H + 20) continue;
      const spr = pk.type === "xp" ? Assets.get("xp" + pk.size) :
        pk.type === "coin" ? Assets.get("coin") : Assets.get("heart");
      const bob = Math.sin(performance.now() / 300 + pk.x) * 2;
      ctx.drawImage(spr, sx - spr.width / 2, sy - spr.height / 2 + bob);
    }

    // ondas enemigas (AoE)
    for (const w of this.enemyWaves) {
      const sx = w.x - camX, sy = w.y - camY;
      const t = 1 - Math.max(0, w.life) / w.maxLife;
      ctx.strokeStyle = `rgba(240,62,62,${(1 - t) * 0.9})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(sx, sy, w.radius, 0, 7);
      ctx.stroke();
      ctx.fillStyle = `rgba(240,62,62,${(1 - t) * 0.15})`;
      ctx.fill();
    }

    // ondas del jugador
    for (const w of this.waves) {
      const sx = w.x - camX, sy = w.y - camY;
      const t = 1 - Math.max(0, w.life) / w.maxLife;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(w.angle);
      ctx.globalAlpha = 1 - t;
      const spr = Assets.get("banderaWave");
      ctx.drawImage(spr, 30, -spr.height / 2, w.rangeNow, spr.height);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // proyectiles jugador
    for (const pr of this.projectiles) {
      const sx = Math.round(pr.x - camX), sy = Math.round(pr.y - camY);
      const spr = Assets.get(pr.sprite);
      if (!spr) continue;
      ctx.save();
      ctx.translate(sx, sy);
      if (pr.rot) ctx.rotate(pr.rot);
      ctx.drawImage(spr, -spr.width / 2, -spr.height / 2);
      ctx.restore();
    }

    // summons
    for (const s of this.summons) {
      const sx = Math.round(s.x - camX), sy = Math.round(s.y - camY);
      ctx.fillStyle = "rgba(0,0,0,.3)";
      ctx.beginPath();
      ctx.ellipse(sx, sy + 13, 11, 4, 0, 0, 7);
      ctx.fill();
      ctx.save();
      ctx.translate(sx, sy);
      if (Math.cos(s.angle) < 0) ctx.scale(-1, 1);
      const spr = Assets.get("dancer");
      const hop = Math.abs(Math.sin(performance.now() / 120)) * 4;
      ctx.drawImage(spr, -spr.width / 2, -spr.height / 2 - hop);
      ctx.restore();
      // aura
      ctx.strokeStyle = "rgba(255,212,59,.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx, sy, s.radius * 0.55, 0, 7);
      ctx.stroke();
    }

    // armas orbitales
    WeaponSystem.drawOrbitals(ctx, this, camX, camY);

    // jugador
    if (this.player) Player.draw(ctx, this, camX, camY);

    // enemigos
    for (const e of this.enemies) {
      if (e.dead) continue;
      const sx = Math.round(e.x - camX), sy = Math.round(e.y - camY);
      if (sx < -100 || sy < -100 || sx > W + 100 || sy > H + 100) continue;
      const spr = Assets.get(e.def.sprite);
      if (!spr) continue;
      const scale = e.def.scale || 1;
      const bob = e.isBoss ? Math.sin(e.bob * 3) * 4 : Math.sin(e.bob) * 1.5;
      ctx.save();
      ctx.translate(sx, sy + bob);
      if (e.angle && !e.isBoss) {
        if (Math.cos(e.angle) < 0) ctx.scale(-1, 1);
      }
      if (e.isBoss) {
        // aro de aura
        ctx.strokeStyle = e.phase === 2 ? "rgba(240,62,62,.7)" : "rgba(255,212,59,.5)";
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -performance.now() / 40;
        ctx.beginPath();
        ctx.arc(0, 0, e.radius + 16, 0, 7);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (e.flash > 0) {
        ctx.filter = "brightness(2.2)";
      }
      const w = spr.width * scale, h = spr.height * scale;
      ctx.drawImage(spr, -w / 2, -h * 0.55, w, h);
      ctx.filter = "none";
      ctx.restore();

      // barra de vida de miniboss
      if (e.isMini && !e.isBoss) {
        const bw = 56;
        ctx.fillStyle = "rgba(0,0,0,.6)";
        ctx.fillRect(sx - bw / 2, sy - 44, bw, 7);
        ctx.fillStyle = "#e03131";
        ctx.fillRect(sx - bw / 2 + 1, sy - 43, (bw - 2) * U.clamp(e.hp / e.maxHp, 0, 1), 5);
      }
    }

    // proyectiles enemigos
    for (const pr of this.enemyProjectiles) {
      const sx = Math.round(pr.x - camX), sy = Math.round(pr.y - camY);
      if (sx < -20 || sy < -20 || sx > W + 20 || sy > H + 20) continue;
      const spr = Assets.get(pr.sprite);
      if (spr) {
        ctx.save();
        ctx.translate(sx, sy);
        if (pr.sprite !== "mustard" && pr.sprite !== "star") ctx.rotate(Math.atan2(pr.vy, pr.vx) + Math.PI / 2);
        ctx.drawImage(spr, -spr.width / 2, -spr.height / 2);
        ctx.restore();
      } else {
        ctx.fillStyle = pr.color || "#ffd43b";
        ctx.beginPath();
        ctx.arc(sx, sy, pr.radius, 0, 7);
        ctx.fill();
      }
    }

    // partículas y textos
    Particles.draw(ctx, camX, camY);

    // toast
    if (this.toastMsg) {
      const a = U.clamp(this.toastMsg.life / this.toastMsg.maxLife, 0, 1);
      ctx.globalAlpha = Math.min(1, a * 3);
      ctx.font = "bold 20px 'Arial Black', sans-serif";
      ctx.textAlign = "center";
      const ty = 130;
      ctx.fillStyle = "rgba(0,0,0,.65)";
      const tw = ctx.measureText(this.toastMsg.text).width + 30;
      ctx.fillRect(W / 2 - tw / 2, ty - 22, tw, 34);
      ctx.fillStyle = "#ffd43b";
      ctx.fillText(this.toastMsg.text, W / 2, ty + 3);
      ctx.globalAlpha = 1;
      ctx.textAlign = "left";
    }

    // intro de jefe
    if (this.bossIntro > 0 && this.boss) {
      const a = U.clamp(this.bossIntro / 2.2, 0, 1);
      ctx.globalAlpha = Math.min(1, (1 - Math.abs(a - 0.5) * 2) * 2 + 0.4);
      ctx.fillStyle = "rgba(0,0,0,.55)";
      ctx.fillRect(0, H / 2 - 54, W, 100);
      ctx.textAlign = "center";
      ctx.font = "bold 15px 'Arial Black', sans-serif";
      ctx.fillStyle = "#ff6b6b";
      ctx.fillText("⚠ JEFE DE MUNDO ⚠", W / 2, H / 2 - 18);
      ctx.font = "bold 30px 'Arial Black', sans-serif";
      ctx.fillStyle = "#fff3bf";
      ctx.fillText(this.boss.def.name, W / 2, H / 2 + 22);
      ctx.textAlign = "left";
      ctx.globalAlpha = 1;
    }

    // viñeta
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,.45)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
  },

  drawBgFireworks(W, H, camX, camY) {
    const t = performance.now() / 1000;
    // fuegos artificiales decorativos de fondo (lejanos)
    for (let i = 0; i < 4; i++) {
      const cycle = (t * 0.35 + i * 0.31) % 1;
      if (cycle > 0.5) continue;
      const p = cycle / 0.5;
      const fx = ((i * 0.27 + 0.1) * W + Math.sin(t + i) * 20);
      const fy = H * (0.15 + (i % 2) * 0.12);
      const r = 10 + p * 46;
      const alpha = (1 - p) * 0.5;
      const colors = ["#ffd43b", "#ff6b6b", "#74c0fc", "#b2f2bb"];
      ctx.strokeStyle = colors[i % colors.length];
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2;
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(fx + Math.cos(a) * r * 0.5, fy + Math.sin(a) * r * 0.5);
        ctx.lineTo(fx + Math.cos(a) * r, fy + Math.sin(a) * r);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  },

  /* ---------- Loop ---------- */
  loop(now) {
    this._raf = requestAnimationFrame((t) => this.loop(t));
    let dt = (now - this._last) / 1000;
    this._last = now;
    if (!isFinite(dt) || dt < 0) dt = 0;
    dt = Math.min(dt, 0.05);

    // pausa con ESC
    if (Input.wasPressed("escape")) {
      if (this.state === "play") {
        this.state = "pause";
        HUD.show("pause");
        AudioSys.stopMusic();
      } else if (this.state === "pause") {
        this.state = "play";
        HUD.hide("pause");
        AudioSys.startMusic();
      }
    }

    this.update(dt);
    this.render();
    Input.endFrame();
  }
};

/* arranque */
window.addEventListener("DOMContentLoaded", () => {
  Game.init();
});
