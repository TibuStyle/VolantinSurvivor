/* ============ Jefes de Mundo ============ */
"use strict";

const BOSS_DEFS = {
  castillo: {
    id: "castillo",
    name: "CASTILLO ARDIENTE",
    sprite: "castillo",
    hp: 3600,
    speed: 42,
    damage: 24,
    radius: 34,
    xp: 120,
    coins: 90,
    phase2At: 0.5
  },
  lagarto: {
    id: "lagarto",
    name: "LAGARTO DEL MAPOCHO",
    sprite: "lagarto",
    hp: 6400,
    speed: 78,
    damage: 28,
    radius: 42,
    xp: 200,
    coins: 140,
    phase2At: 0.5
  },
  volantinOscuro: {
    id: "volantinOscuro",
    name: "EL VOLANTÍN OSCURO",
    sprite: "volantinOscuro",
    hp: 10500,
    speed: 95,
    damage: 32,
    radius: 40,
    xp: 350,
    coins: 220,
    phase2At: 0.45
  }
};

let BOSS_ID = 100000;

const Bosses = {
  spawn(game, bossId) {
    const def = BOSS_DEFS[bossId];
    if (!def) return null;
    // aparece lejos del jugador
    const a = U.rand(Math.PI * 2);
    const d = 520;
    const x = U.clamp(game.player.x + Math.cos(a) * d, 80, WORLD.w - 80);
    const y = U.clamp(game.player.y + Math.sin(a) * d, 80, WORLD.h - 80);
    const hpMult = 1 + game.stageIndex * 0.15;
    const b = {
      _id: BOSS_ID++,
      type: "boss",
      bossId,
      def,
      x, y,
      hp: Math.round(def.hp * hpMult),
      maxHp: Math.round(def.hp * hpMult),
      speed: def.speed,
      damage: def.damage,
      radius: def.radius,
      xp: def.xp,
      coins: def.coins,
      dead: false,
      isBoss: true,
      isMini: false,
      kbx: 0, kby: 0,
      flash: 0,
      angle: 0,
      bob: 0,
      // timers de patrones
      tAttack: 2.2,
      tSpecial: 4.5,
      tSpawn: 6,
      phase: 1,
      state: "idle",
      stateTimer: 0,
      chargeAngle: 0,
      // animación
      anim: 0
    };
    game.boss = b;
    game.enemies.push(b);
    // intro
    game.bossIntro = 2.2;
    AudioSys.bossSpawn();
    return b;
  }
};

function updateBoss(b, dt, game) {
  const p = game.player;
  b.flash = Math.max(0, b.flash - dt);
  b.bob += dt;
  b.anim += dt;

  const frac = b.hp / b.maxHp;
  if (frac <= b.def.phase2At && b.phase === 1) {
    b.phase = 2;
    Particles.burst(b.x, b.y, 40, ["#f03e3e", "#ffd43b", "#495057"], { spMax: 300, size: 7 });
    AudioSys.explode();
    game.toast("¡FASE 2! El jefe se enoja de verdad");
    b.tAttack = Math.min(b.tAttack, 0.8);
    b.tSpecial = Math.min(b.tSpecial, 1.5);
  }

  const dx = p.x - b.x, dy = p.y - b.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const dirx = dx / dist, diry = dy / dist;
  b.angle = U.angleLerp(b.angle, Math.atan2(diry, dirx), 0.06);

  b.tAttack -= dt;
  b.tSpecial -= dt;
  b.tSpawn -= dt;
  const rage = b.phase === 2 ? 0.65 : 1;

  let mvx = 0, mvy = 0;

  switch (b.bossId) {
    /* ===== CASTILLO ARDIENTE ===== */
    case "castillo": {
      // mantiene distancia media
      if (dist > 320) { mvx = dirx * b.speed; mvy = diry * b.speed; }
      else if (dist < 200) { mvx = -dirx * b.speed * 0.8; mvy = -diry * b.speed * 0.8; }
      // disparos radiales de fuegos artificiales
      if (b.tAttack <= 0) {
        b.tAttack = (b.phase === 2 ? 1.5 : 2.2) * rage;
        const n = b.phase === 2 ? 12 : 8;
        const off = b.anim;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + off;
          game.enemyProjectiles.push({
            x: b.x, y: b.y - 20,
            vx: Math.cos(a) * 210, vy: Math.sin(a) * 210,
            damage: Math.round(b.damage * 0.65),
            radius: 9, life: 3.4, sprite: "rocket", color: "#ff922b",
            trail: true
          });
        }
        Particles.burst(b.x, b.y - 30, 10, ["#ffd43b", "#ff922b"]);
        AudioSys.tone(240, 0.2, "sawtooth", 0.25, 0, 520);
      }
      // estallido especial hacia el jugador
      if (b.tSpecial <= 0) {
        b.tSpecial = (b.phase === 2 ? 3.4 : 4.8) * rage;
        // 3 anillos
        for (let ring = 0; ring < 3; ring++) {
          setTimeout(() => {
            if (b.dead || !game.running) return;
            const n = 10 + ring * 2;
            for (let i = 0; i < n; i++) {
              const a = (i / n) * Math.PI * 2 + ring * 0.3;
              game.enemyProjectiles.push({
                x: b.x, y: b.y,
                vx: Math.cos(a) * (170 + ring * 40),
                vy: Math.sin(a) * (170 + ring * 40),
                damage: Math.round(b.damage * 0.6),
                radius: 8, life: 3.6, sprite: "star", color: "#ffd43b", trail: true
              });
            }
            AudioSys.explode();
          }, ring * 350);
        }
      }
      // invocar empanadas
      if (b.tSpawn <= 0) {
        b.tSpawn = (b.phase === 2 ? 5 : 7.5) * rage;
        for (let i = 0; i < (b.phase === 2 ? 5 : 3); i++) {
          const a = U.rand(Math.PI * 2);
          Enemies.spawn(game, U.pick(["empanada", "sopaipilla"]), b.x + Math.cos(a) * 70, b.y + Math.sin(a) * 70,
            1 + game.stageIndex * 0.4, 1);
        }
        Particles.burst(b.x, b.y, 14, "#f4b860");
      }
      break;
    }

    /* ===== LAGARTO DEL MAPOCHO ===== */
    case "lagarto": {
      if (b.state === "idle") {
        if (dist > 240) { mvx = dirx * b.speed; mvy = diry * b.speed; }
        if (b.tAttack <= 0) {
          // elige patrón
          const roll = Math.random();
          if (roll < 0.45) {
            b.state = "charge"; b.chargeAngle = Math.atan2(diry, dirx);
            b.stateTimer = 0.75;
            AudioSys.tone(120, 0.4, "sawtooth", 0.3, 0, 60);
          } else if (roll < 0.75) {
            b.state = "spin"; b.stateTimer = 1.4;
            b.tAttack = 3 * rage;
          } else {
            // escupitajo triple con aleta
            for (let s = -1; s <= 1; s++) {
              const a = b.angle + s * 0.3;
              for (let k = 0; k < 3; k++) {
                setTimeout(() => {
                  if (b.dead || !game.running) return;
                  game.enemyProjectiles.push({
                    x: b.x, y: b.y,
                    vx: Math.cos(a) * 300, vy: Math.sin(a) * 300,
                    damage: Math.round(b.damage * 0.6),
                    radius: 10, life: 3, sprite: "mustard", color: "#7c4a03", trail: false
                  });
                }, k * 140);
              }
            }
            b.tAttack = 2.4 * rage;
            AudioSys.tone(300, 0.2, "square", 0.2, 0, 180);
          }
        }
        if (b.tSpecial <= 0) {
          b.tSpecial = 6 * rage;
          // salto al jugador (AoE)
          b.state = "jump"; b.stateTimer = 0.6;
          b.jumpTarget = { x: p.x, y: p.y };
          b.jumpFrom = { x: b.x, y: b.y };
          AudioSys.tone(400, 0.5, "triangle", 0.25, 0, 80);
        }
        if (b.tSpawn <= 0) {
          b.tSpawn = 9 * rage;
          for (let i = 0; i < 4; i++) {
            const a = U.rand(Math.PI * 2);
            Enemies.spawn(game, U.pick(["piquero", "guanaco"]), b.x + Math.cos(a) * 90, b.y + Math.sin(a) * 90,
              1 + game.stageIndex * 0.4, 1);
          }
        }
      } else if (b.state === "charge") {
        b.stateTimer -= dt;
        mvx = Math.cos(b.chargeAngle) * 520;
        mvy = Math.sin(b.chargeAngle) * 520;
        Particles.spawn({ x: b.x, y: b.y, vx: U.rand(-60, 60), vy: U.rand(-60, 60), life: 0.3, size: 5, color: "#40c057" });
        if (b.stateTimer <= 0 || b.x < 60 || b.x > WORLD.w - 60 || b.y < 60 || b.y > WORLD.h - 60) {
          b.state = "idle"; b.tAttack = 1.8 * rage;
          AudioSys.explode();
          Particles.burst(b.x, b.y, 16, "#40c057");
        }
      } else if (b.state === "spin") {
        b.stateTimer -= dt;
        // gira lanzando proyectiles
        b.spinAng = (b.spinAng || 0) + dt * 9;
        if (Math.floor(b.stateTimer * 10) % 2 === 0) {
          for (let i = 0; i < 4; i++) {
            const a = b.spinAng + (i / 4) * Math.PI * 2;
            game.enemyProjectiles.push({
              x: b.x, y: b.y,
              vx: Math.cos(a) * 240, vy: Math.sin(a) * 240,
              damage: Math.round(b.damage * 0.5),
              radius: 8, life: 2.6, sprite: "papel", color: "#2f9e44", trail: false
            });
          }
        }
        mvx = dirx * b.speed * 1.4; mvy = diry * b.speed * 1.4;
        if (b.stateTimer <= 0) { b.state = "idle"; b.tAttack = 1.6 * rage; }
      } else if (b.state === "jump") {
        b.stateTimer -= dt;
        const t = 1 - Math.max(0, b.stateTimer) / 0.6;
        b.x = U.lerp(b.jumpFrom.x, b.jumpTarget.x, t);
        b.y = U.lerp(b.jumpFrom.y, b.jumpTarget.y, t) - Math.sin(t * Math.PI) * 120;
        if (b.stateTimer <= 0) {
          b.x = b.jumpTarget.x; b.y = b.jumpTarget.y;
          b.state = "idle"; b.tAttack = 2 * rage;
          // impacto AoE
          game.enemyWaves.push({
            x: b.x, y: b.y, radius: 10, maxRadius: 130,
            damage: Math.round(b.damage * 0.9), life: 0.45, maxLife: 0.45,
            hit: new Set()
          });
          Particles.burst(b.x, b.y, 26, ["#7a6248", "#8a7052"], { spMax: 260, grav: 200 });
          AudioSys.explode();
        }
      }
      break;
    }

    /* ===== VOLANTÍN OSCURO ===== */
    case "volantinOscuro": {
      // vuela en círculos alrededor del jugador
      const orbitR = 260;
      const orbA = (b.orbitA = (b.orbitA || 0) + dt * (b.phase === 2 ? 0.9 : 0.6));
      const tx = p.x + Math.cos(orbA) * orbitR;
      const ty = p.y + Math.sin(orbA) * orbitR;
      const toA = U.angle(b.x, b.y, tx, ty);
      const toD = U.dist(b.x, b.y, tx, ty);
      mvx = Math.cos(toA) * Math.min(b.speed, toD * 2);
      mvy = Math.sin(toA) * Math.min(b.speed, toD * 2);

      if (b.tAttack <= 0) {
        b.tAttack = (b.phase === 2 ? 0.9 : 1.4) * rage;
        // abanico de estrellas oscuras hacia el jugador
        const base = U.angle(b.x, b.y, p.x, p.y);
        const n = b.phase === 2 ? 5 : 3;
        for (let i = 0; i < n; i++) {
          const a = base + (i - (n - 1) / 2) * 0.22;
          game.enemyProjectiles.push({
            x: b.x, y: b.y,
            vx: Math.cos(a) * 300, vy: Math.sin(a) * 300,
            damage: Math.round(b.damage * 0.55),
            radius: 9, life: 3.2, sprite: "star", color: "#f03e3e", trail: true
          });
        }
        AudioSys.tone(520, 0.1, "square", 0.16, 0, 260);
      }

      if (b.tSpecial <= 0) {
        b.tSpecial = (b.phase === 2 ? 4 : 6) * rage;
        const roll = Math.random();
        if (roll < 0.5) {
          // barrido de hilos: anillo de proyectiles
          const n = b.phase === 2 ? 22 : 16;
          for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + b.anim;
            game.enemyProjectiles.push({
              x: b.x, y: b.y,
              vx: Math.cos(a) * 190, vy: Math.sin(a) * 190,
              damage: Math.round(b.damage * 0.5),
              radius: 7, life: 3.6, sprite: "hiloSeg", color: "#f03e3e", trail: false
            });
          }
          Particles.burst(b.x, b.y, 20, "#f03e3e");
          AudioSys.tone(180, 0.3, "sawtooth", 0.25, 0, 90);
        } else {
          // teletransporte detrás del jugador
          Particles.burst(b.x, b.y, 26, ["#495057", "#f03e3e"], { spMax: 280 });
          const a = U.angle(p.x, p.y, b.x, b.y) + U.rand(-0.6, 0.6);
          b.x = U.clamp(p.x + Math.cos(a) * 300, 80, WORLD.w - 80);
          b.y = U.clamp(p.y + Math.sin(a) * 300, 80, WORLD.h - 80);
          Particles.burst(b.x, b.y, 26, ["#495057", "#ffd43b"], { spMax: 280 });
          // ráfaga tras tele
          for (let i = 0; i < 8; i++) {
            const aa = U.angle(b.x, b.y, p.x, p.y) + (i - 3.5) * 0.14;
            game.enemyProjectiles.push({
              x: b.x, y: b.y,
              vx: Math.cos(aa) * 330, vy: Math.sin(aa) * 330,
              damage: Math.round(b.damage * 0.55),
              radius: 8, life: 3, sprite: "papel", color: "#f03e3e", trail: false
            });
          }
          AudioSys.tone(700, 0.16, "sine", 0.25, 0, 200);
        }
      }

      if (b.tSpawn <= 0) {
        b.tSpawn = (b.phase === 2 ? 6 : 9) * rage;
        for (let i = 0; i < (b.phase === 2 ? 5 : 3); i++) {
          const a = U.rand(Math.PI * 2);
          Enemies.spawn(game, U.pick(["sombra", "diablito"]), b.x + Math.cos(a) * 80, b.y + Math.sin(a) * 80,
            1 + game.stageIndex * 0.4, 1);
        }
      }
      break;
    }
  }

  b.x += (mvx + b.kbx) * dt;
  b.y += (mvy + b.kby) * dt;
  b.kbx *= Math.pow(0.002, dt);
  b.kby *= Math.pow(0.002, dt);
  b.x = U.clamp(b.x, 50, WORLD.w - 50);
  b.y = U.clamp(b.y, 50, WORLD.h - 50);

  if (U.circleHit(b.x, b.y, b.radius, p.x, p.y, p.radius)) {
    game.hurtPlayer(b.damage, b.x, b.y);
  }
}
