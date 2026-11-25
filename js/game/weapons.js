/* ============ Armas (atacan solas, estilo Vampire Survivors) ============ */
"use strict";

const WEAPON_DEFS = {
  hilo: {
    id: "hilo", name: "Volantín Cortante", icon: "hilo", sprite: "player",
    kind: "kite",
    desc: "El volantín hace daño a los enemigos que toca. ¡Ojo: si un enemigo toca el hilo, te quita vida a ti!",
    maxLevel: 8,
    levels: [
      { damage: 13, radius: 16, tick: 0.40, kb: 50 },
      { damage: 16, radius: 17, tick: 0.38, kb: 55 },
      { damage: 20, radius: 18, tick: 0.36, kb: 60 },
      { damage: 25, radius: 19, tick: 0.33, kb: 70 },
      { damage: 31, radius: 20, tick: 0.30, kb: 80 },
      { damage: 38, radius: 21, tick: 0.28, kb: 90 },
      { damage: 46, radius: 23, tick: 0.25, kb: 105 },
      { damage: 58, radius: 25, tick: 0.22, kb: 120 }
    ]
  },
  volantin: {
    id: "volantin", name: "Volantines", icon: "volantin", sprite: "player",
    kind: "orbiters",
    desc: "Volantines aliados orbitan a tu alrededor y embisten enemigos.",
    maxLevel: 8,
    levels: [
      { damage: 10, count: 1, radius: 90,  rotSpeed: 2.0, kb: 60 },
      { damage: 13, count: 2, radius: 94,  rotSpeed: 2.1, kb: 70 },
      { damage: 16, count: 2, radius: 100, rotSpeed: 2.3, kb: 80 },
      { damage: 20, count: 3, radius: 106, rotSpeed: 2.5, kb: 90 },
      { damage: 25, count: 3, radius: 112, rotSpeed: 2.7, kb: 100 },
      { damage: 31, count: 4, radius: 118, rotSpeed: 2.9, kb: 115 },
      { damage: 38, count: 5, radius: 126, rotSpeed: 3.1, kb: 130 },
      { damage: 48, count: 6, radius: 136, rotSpeed: 3.4, kb: 150 }
    ]
  },
  fuego: {
    id: "fuego", name: "Fuego Artificial", icon: "fuego", sprite: "rocket",
    kind: "shoot",
    desc: "Cohetes de fuegos artificiales que estallan en el enemigo más cercano.",
    maxLevel: 8,
    levels: [
      { damage: 14, cooldown: 1.6, count: 1, explodeRadius: 46, speed: 420 },
      { damage: 18, cooldown: 1.5, count: 1, explodeRadius: 52, speed: 440 },
      { damage: 22, cooldown: 1.4, count: 2, explodeRadius: 56, speed: 460 },
      { damage: 27, cooldown: 1.3, count: 2, explodeRadius: 62, speed: 480 },
      { damage: 33, cooldown: 1.2, count: 2, explodeRadius: 68, speed: 500 },
      { damage: 40, cooldown: 1.05, count: 3, explodeRadius: 74, speed: 520 },
      { damage: 48, cooldown: 0.95, count: 3, explodeRadius: 82, speed: 540 },
      { damage: 60, cooldown: 0.8, count: 4, explodeRadius: 92, speed: 570 }
    ]
  },
  estrella: {
    id: "estrella", name: "Estrella Fugaz", icon: "estrella", sprite: "star",
    kind: "shoot",
    desc: "Estrellas fugaces que atraviesan enemigos con ligera puntería.",
    maxLevel: 8,
    levels: [
      { damage: 11, cooldown: 1.1, count: 1, pierce: 2, speed: 500, homing: 2.5 },
      { damage: 14, cooldown: 1.0, count: 1, pierce: 3, speed: 520, homing: 2.8 },
      { damage: 17, cooldown: 0.95, count: 2, pierce: 3, speed: 540, homing: 3.0 },
      { damage: 21, cooldown: 0.9, count: 2, pierce: 4, speed: 560, homing: 3.3 },
      { damage: 26, cooldown: 0.82, count: 2, pierce: 5, speed: 580, homing: 3.6 },
      { damage: 32, cooldown: 0.75, count: 3, pierce: 5, speed: 610, homing: 4.0 },
      { damage: 39, cooldown: 0.68, count: 3, pierce: 6, speed: 640, homing: 4.4 },
      { damage: 48, cooldown: 0.55, count: 4, pierce: 8, speed: 680, homing: 5.0 }
    ]
  },
  papel: {
    id: "papel", name: "Papel Picado", icon: "papel", sprite: "papel",
    kind: "burst",
    desc: "Ráfagas de papel picado en todas direcciones.",
    maxLevel: 8,
    levels: [
      { damage: 9,  cooldown: 1.5, count: 6,  speed: 340, pierce: 1 },
      { damage: 11, cooldown: 1.4, count: 8,  speed: 350, pierce: 1 },
      { damage: 14, cooldown: 1.3, count: 8,  speed: 360, pierce: 2 },
      { damage: 17, cooldown: 1.2, count: 10, speed: 380, pierce: 2 },
      { damage: 21, cooldown: 1.1, count: 12, speed: 390, pierce: 2 },
      { damage: 26, cooldown: 1.0, count: 14, speed: 410, pierce: 3 },
      { damage: 32, cooldown: 0.9, count: 16, speed: 430, pierce: 3 },
      { damage: 40, cooldown: 0.75, count: 20, speed: 460, pierce: 4 }
    ]
  },
  choripan: {
    id: "choripan", name: "Choripán Explosivo", icon: "choripan", sprite: "choripanProj",
    kind: "lob",
    desc: "Lanza choripanes que estallan con mostaza explosiva.",
    maxLevel: 8,
    levels: [
      { damage: 20, cooldown: 1.9, explodeRadius: 55, speed: 340 },
      { damage: 25, cooldown: 1.8, explodeRadius: 60, speed: 350 },
      { damage: 31, cooldown: 1.7, explodeRadius: 66, speed: 360 },
      { damage: 38, cooldown: 1.6, explodeRadius: 72, speed: 375 },
      { damage: 46, cooldown: 1.45, explodeRadius: 80, speed: 390 },
      { damage: 56, cooldown: 1.3, explodeRadius: 88, speed: 405 },
      { damage: 68, cooldown: 1.15, explodeRadius: 98, speed: 420 },
      { damage: 84, cooldown: 1.0, explodeRadius: 110, speed: 440 }
    ]
  },
  cueca: {
    id: "cueca", name: "Cueca Salvaje", icon: "cueca", sprite: "dancer",
    kind: "summon",
    desc: "Un huaso baila cueca y azota con su poncho a los enemigos.",
    maxLevel: 8,
    levels: [
      { damage: 12, cooldown: 5.0, count: 1, life: 6, radius: 60, speed: 130 },
      { damage: 15, cooldown: 4.7, count: 1, life: 7, radius: 64, speed: 140 },
      { damage: 19, cooldown: 4.4, count: 2, life: 7, radius: 68, speed: 150 },
      { damage: 23, cooldown: 4.1, count: 2, life: 8, radius: 72, speed: 160 },
      { damage: 28, cooldown: 3.8, count: 2, life: 8, radius: 78, speed: 170 },
      { damage: 34, cooldown: 3.5, count: 3, life: 9, radius: 84, speed: 180 },
      { damage: 41, cooldown: 3.2, count: 3, life: 10, radius: 90, speed: 190 },
      { damage: 50, cooldown: 2.8, count: 4, life: 11, radius: 98, speed: 200 }
    ]
  },
  mote: {
    id: "mote", name: "Mote con Huesillo", icon: "mote", sprite: "mote",
    kind: "shoot",
    desc: "Jarros de mote con huesillo que atraviesan hordas enteras.",
    maxLevel: 8,
    levels: [
      { damage: 24, cooldown: 2.2, count: 1, pierce: 4, speed: 300, size: 10 },
      { damage: 30, cooldown: 2.1, count: 1, pierce: 5, speed: 310, size: 11 },
      { damage: 37, cooldown: 2.0, count: 1, pierce: 6, speed: 320, size: 11 },
      { damage: 45, cooldown: 1.9, count: 2, pierce: 6, speed: 330, size: 12 },
      { damage: 54, cooldown: 1.75, count: 2, pierce: 7, speed: 340, size: 12 },
      { damage: 65, cooldown: 1.6, count: 2, pierce: 8, speed: 355, size: 13 },
      { damage: 78, cooldown: 1.45, count: 3, pierce: 9, speed: 370, size: 14 },
      { damage: 95, cooldown: 1.25, count: 3, pierce: 12, speed: 390, size: 15 }
    ]
  },
  bandera: {
    id: "bandera", name: "Bandera Chilena", icon: "bandera", sprite: "banderaWave",
    kind: "wave",
    desc: "Despliegues de bandera que empujan y dañan en un abanico frontal.",
    maxLevel: 8,
    levels: [
      { damage: 16, cooldown: 2.4, range: 150, arc: 1.4, kb: 240 },
      { damage: 20, cooldown: 2.3, range: 160, arc: 1.5, kb: 260 },
      { damage: 25, cooldown: 2.2, range: 170, arc: 1.6, kb: 280 },
      { damage: 31, cooldown: 2.05, range: 185, arc: 1.7, kb: 300 },
      { damage: 38, cooldown: 1.9, range: 200, arc: 1.8, kb: 330 },
      { damage: 46, cooldown: 1.75, range: 215, arc: 1.9, kb: 360 },
      { damage: 56, cooldown: 1.6, range: 235, arc: 2.0, kb: 400 },
      { damage: 68, cooldown: 1.4, range: 260, arc: 2.2, kb: 450 }
    ]
  }
};

const WeaponSystem = {
  list: [], // {id, level, timer, state:{}}

  reset() { this.list = []; },

  has(id) { return this.list.some(w => w.id === id); },
  get(id) { return this.list.find(w => w.id === id); },

  add(id, level = 1) {
    const def = WEAPON_DEFS[id];
    if (!def) return;
    const existing = this.get(id);
    if (existing) {
      existing.level = Math.min(def.maxLevel, existing.level + level);
    } else {
      this.list.push({ id, level, timer: 0.3, state: { angle: 0, hitCd: {} } });
    }
  },

  upgradeableIds() {
    return this.list.filter(w => w.level < WEAPON_DEFS[w.id].maxLevel).map(w => w.id);
  },

  /* arma actual + nivel */
  lv(id) {
    const w = this.get(id);
    if (!w) return null;
    return { w, def: WEAPON_DEFS[id], stats: WEAPON_DEFS[id].levels[w.level - 1] };
  },

  update(dt, game) {
    const p = game.player;
    const mult = p.stats.damageMult;

    for (const w of this.list) {
      const def = WEAPON_DEFS[w.id];
      const st = def.levels[w.level - 1];

      if (def.kind === "kite") {
        // EL VOLANTÍN hace daño por contacto
        w.state.tick = (w.state.tick || 0) - dt;
        if (w.state.tick <= 0) {
          w.state.tick = st.tick;
          const k = p.kite;
          const kr = st.radius * p.stats.areaMult;
          for (const e of game.enemies) {
            if (e.dead) continue;
            if (U.circleHit(k.x, k.y, kr, e.x, e.y, e.radius)) {
              game.damageEnemy(e, Math.round(st.damage * mult), w.id, false);
              const ka = U.angle(k.x, k.y, e.x, e.y);
              e.kbx += Math.cos(ka) * st.kb;
              e.kby += Math.sin(ka) * st.kb;
            }
          }
        }
      } else if (def.kind === "orbiters") {
        w.state.angle += st.rotSpeed * dt;
        // posiciones calculadas al dibujar / colisión
        w.state.positions = [];
        for (let i = 0; i < st.count; i++) {
          const a = w.state.angle + (i / st.count) * Math.PI * 2;
          const ox = p.x + Math.cos(a) * st.radius;
          const oy = p.y + Math.sin(a) * st.radius;
          w.state.positions.push({ x: ox, y: oy, a });
          // colisión
          for (const e of game.enemies) {
            if (e.dead) continue;
            if (U.circleHit(ox, oy, 12, e.x, e.y, e.radius)) {
              // cooldown por enemigo
              const key = e._id;
              const cd = w.state.hitCd[key] || 0;
              if (game.time >= cd) {
                w.state.hitCd[key] = game.time + 0.45;
                game.damageEnemy(e, Math.round(st.damage * mult), w.id, false);
                const ka = U.angle(ox, oy, e.x, e.y);
                e.kbx += Math.cos(ka) * st.kb;
                e.kby += Math.sin(ka) * st.kb;
              }
            }
          }
        }
      } else if (def.kind === "shoot") {
        w.timer -= dt;
        if (w.timer <= 0) {
          w.timer = st.cooldown / p.stats.cooldownMult;
          const targets = game.nearestEnemies(p.x, p.y, st.count, 900);
          if (targets.length) {
            for (let i = 0; i < st.count; i++) {
              const tgt = targets[i % targets.length];
              const spread = st.count > 1 ? (i - (st.count - 1) / 2) * 0.16 : 0;
              const a = U.angle(p.x, p.y, tgt.x, tgt.y) + spread;
              const proj = {
                x: p.x, y: p.y,
                vx: Math.cos(a) * st.speed, vy: Math.sin(a) * st.speed,
                damage: Math.round(st.damage * mult),
                pierce: st.pierce || 1,
                radius: st.size || 8,
                sprite: def.sprite,
                rot: a + Math.PI / 2,
                rotSpeed: def.id === "estrella" ? 8 : (def.id === "fuego" ? 0 : 0),
                life: 2.4,
                homing: st.homing || 0,
                explodeRadius: st.explodeRadius || 0,
                weapon: w.id,
                hit: new Set()
              };
              game.projectiles.push(proj);
            }
            if (def.id === "fuego" || def.id === "estrella") AudioSys.shoot();
            else AudioSys.thread();
          } else {
            // sin objetivo: disparo aleatorio
            const a = U.rand(Math.PI * 2);
            game.projectiles.push({
              x: p.x, y: p.y,
              vx: Math.cos(a) * st.speed, vy: Math.sin(a) * st.speed,
              damage: Math.round(st.damage * mult),
              pierce: st.pierce || 1,
              radius: st.size || 8,
              sprite: def.sprite,
              rot: a + Math.PI / 2, rotSpeed: def.id === "estrella" ? 8 : 0,
              life: 2.4, homing: st.homing || 0,
              explodeRadius: st.explodeRadius || 0,
              weapon: w.id, hit: new Set()
            });
          }
        }
      } else if (def.kind === "burst") {
        w.timer -= dt;
        if (w.timer <= 0) {
          w.timer = st.cooldown / p.stats.cooldownMult;
          const base = (p.aimAngle !== undefined ? p.aimAngle : p.moveAngle) || U.rand(Math.PI * 2);
          for (let i = 0; i < st.count; i++) {
            const a = base + (i / st.count) * Math.PI * 2 + U.rand(-0.08, 0.08);
            game.projectiles.push({
              x: p.x, y: p.y,
              vx: Math.cos(a) * st.speed, vy: Math.sin(a) * st.speed,
              damage: Math.round(st.damage * mult),
              pierce: st.pierce, radius: 7,
              sprite: def.sprite, rot: a, rotSpeed: 6,
              life: 1.6, homing: 0, explodeRadius: 0,
              weapon: w.id, hit: new Set()
            });
          }
          AudioSys.thread();
        }
      } else if (def.kind === "lob") {
        w.timer -= dt;
        if (w.timer <= 0) {
          w.timer = st.cooldown / p.stats.cooldownMult;
          const targets = game.nearestEnemies(p.x, p.y, 1, 800);
          const tgt = targets[0];
          const a = tgt ? U.angle(p.x, p.y, tgt.x, tgt.y) : U.rand(Math.PI * 2);
          const dist = tgt ? U.dist(p.x, p.y, tgt.x, tgt.y) : 260;
          const speed = st.speed;
          const t = Math.max(0.35, dist / speed);
          game.projectiles.push({
            x: p.x, y: p.y,
            vx: Math.cos(a) * (dist / t), vy: Math.sin(a) * (dist / t),
            damage: Math.round(st.damage * mult),
            pierce: 1, radius: 10,
            sprite: def.sprite, rot: a, rotSpeed: 5,
            life: t + 0.15, homing: 0,
            explodeRadius: st.explodeRadius,
            weapon: w.id, hit: new Set(), lob: true
          });
          AudioSys.shoot();
        }
      } else if (def.kind === "summon") {
        w.timer -= dt;
        if (w.timer <= 0) {
          w.timer = st.cooldown / p.stats.cooldownMult;
          const maxSummons = st.count;
          const alive = game.summons.filter(s => s.weapon === w.id).length;
          if (alive < maxSummons) {
            game.summons.push({
              x: p.x + U.rand(-30, 30), y: p.y + U.rand(-30, 30),
              damage: Math.round(st.damage * mult),
              life: st.life, maxLife: st.life,
              radius: st.radius, speed: st.speed,
              angle: U.rand(Math.PI * 2),
              weapon: w.id, state: "wander", timer: 0,
              flip: 1
            });
            Particles.burst(p.x, p.y, 8, "#ffd43b");
          }
        }
      } else if (def.kind === "wave") {
        w.timer -= dt;
        if (w.timer <= 0) {
          w.timer = st.cooldown / p.stats.cooldownMult;
          const a = p.aimAngle !== undefined ? p.aimAngle : (p.moveAngle || 0);
          game.waves.push({
            x: p.x, y: p.y, angle: a,
            range: st.range, arc: st.arc,
            damage: Math.round(st.damage * mult),
            kb: st.kb, life: 0.35, maxLife: 0.35,
            weapon: w.id, hit: false
          });
          AudioSys.tone(300, 0.18, "sawtooth", 0.2, 0, 600);
        }
      }
    }
  },

  /* dibuja efectos orbitales persistentes */
  drawOrbitals(ctx, game, camX, camY) {
    const p = game.player;
    for (const w of this.list) {
      const def = WEAPON_DEFS[w.id];
      const st = def.levels[w.level - 1];
      if (def.kind === "kite") {
        // el volantín y su hilo se dibujan en Player.draw()
      } else if (def.kind === "orbiters" && w.state.positions) {
        for (const o of w.state.positions) {
          const sx = Math.round(o.x - camX), sy = Math.round(o.y - camY);
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(Math.sin(game.time * 4 + o.a) * 0.3);
          ctx.drawImage(Assets.get("player"), -15, -18);
          ctx.restore();
          // hilo hacia el jugador
          ctx.strokeStyle = "rgba(229,219,255,.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(p.x - camX, p.y - camY);
          ctx.stroke();
        }
      }
    }
  }
};
