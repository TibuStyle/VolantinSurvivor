/* ============ Enemigos ============ */

"use strict";

const ENEMY_DEFS = {
  empanada: {
    name: "Empanada Rebelde", sprite: "empanada",
    hp: 14, speed: 62, damage: 10, radius: 11, xp: 1, coins: 0.12,
    ai: "walker", scale: 1
  },
  sopaipilla: {
    name: "Sopaipilla Feroz", sprite: "sopaipilla",
    hp: 8, speed: 105, damage: 7, radius: 8, xp: 1, coins: 0.08,
    ai: "walker", scale: 1
  },
  choripan: {
    name: "Choripán Salvaje", sprite: "choripan",
    hp: 26, speed: 88, damage: 13, radius: 12, xp: 2, coins: 0.16,
    ai: "walker", scale: 1
  },
  luchador: {
    name: "Luchador del 18", sprite: "luchador",
    hp: 70, speed: 44, damage: 18, radius: 13, xp: 4, coins: 0.3,
    ai: "walker", scale: 1
  },
  piquero: {
    name: "Piquero Alegre", sprite: "piquero",
    hp: 18, speed: 130, damage: 9, radius: 10, xp: 2, coins: 0.12,
    ai: "swoop", scale: 1
  },
  guanaco: {
    name: "Guanaco Maldiciente", sprite: "guanaco",
    hp: 40, speed: 55, damage: 15, radius: 13, xp: 3, coins: 0.2,
    ai: "spitter", scale: 1
  },
  diablito: {
    name: "Diablito de Carnaval", sprite: "diablito",
    hp: 30, speed: 70, damage: 12, radius: 11, xp: 3, coins: 0.2,
    ai: "shooter", range: 320, scale: 1
  },
  cochayuyo: {
    name: "Cochayuyo Colosal", sprite: "cochayuyo",
    hp: 110, speed: 34, damage: 22, radius: 15, xp: 6, coins: 0.4,
    ai: "walker", scale: 1
  },
  sombra: {
    name: "Volantín Sombrio", sprite: "sombra",
    hp: 34, speed: 92, damage: 14, radius: 11, xp: 3, coins: 0.22,
    ai: "walker", scale: 1
  }
};

const MINIBOSS_DEFS = {
  carreta: {
    name: "Monito de la Carreta", sprite: "carreta",
    hp: 900, speed: 70, damage: 20, radius: 26, xp: 40, coins: 25,
    ai: "miniboss", scale: 1, isMini: true
  }
};

let ENEMY_ID = 1;

const Enemies = {
  spawn(game, type, x, y, hpMult = 1, dmgMult = 1) {
    const def = ENEMY_DEFS[type] || MINIBOSS_DEFS[type];
    if (!def) return null;
    const isMini = !!def.isMini;
    const e = {
      _id: ENEMY_ID++,
      type,
      def,
      x, y,
      hp: Math.round(def.hp * hpMult),
      maxHp: Math.round(def.hp * hpMult),
      speed: def.speed * (isMini ? 1 : U.rand(0.92, 1.08)),
      damage: Math.round(def.damage * dmgMult),
      radius: def.radius,
      xp: def.xp,
      coins: def.coins,
      ai: def.ai,
      dead: false,
      kbx: 0, kby: 0,
      // IA
      state: "chase",
      timer: U.rand(0, 1.5),
      windup: 0,
      angle: 0,
      flash: 0,
      bob: U.rand(Math.PI * 2),
      // miniboss
      isMini,
      isBoss: false
    };
    game.enemies.push(e);
    return e;
  }
};

/* update de un enemigo individual */
function updateEnemy(e, dt, game) {
  const p = game.player;
  e.timer -= dt;
  e.flash = Math.max(0, e.flash - dt);
  e.bob += dt * 6;

  const dx = p.x - e.x, dy = p.y - e.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const dirx = dx / dist, diry = dy / dist;

  let mvx = 0, mvy = 0;

  switch (e.ai) {
    case "walker": {
      mvx = dirx * e.speed; mvy = diry * e.speed;
      e.angle = U.angleLerp(e.angle, Math.atan2(diry, dirx), 0.1);
      break;
    }
    case "swoop": {
      // acercamiento con zigzag
      const wob = Math.sin(e.bob * 1.4) * 0.7;
      const a = Math.atan2(diry, dirx) + wob * 0.5;
      mvx = Math.cos(a) * e.speed; mvy = Math.sin(a) * e.speed;
      if (dist < 60) { mvx *= -0.6; mvy *= -0.6; }
      e.angle = a;
      break;
    }
    case "spitter": {
      // se detiene a rango medio y escupe
      if (dist > 260) { mvx = dirx * e.speed; mvy = diry * e.speed; }
      else if (dist < 160) { mvx = -dirx * e.speed * 0.7; mvy = -diry * e.speed * 0.7; }
      e.angle = Math.atan2(diry, dirx);
      if (e.timer <= 0 && dist < 420) {
        e.timer = U.rand(1.8, 2.6);
        const a = e.angle;
        game.enemyProjectiles.push({
          x: e.x, y: e.y,
          vx: Math.cos(a) * 260, vy: Math.sin(a) * 260,
          damage: Math.round(e.damage * 0.8),
          radius: 7, life: 3, sprite: "mustard",
          color: "#ffd43b"
        });
        AudioSys.tone(200, 0.1, "square", 0.12, 0, 140);
      }
      break;
    }
    case "shooter": {
      if (dist > e.def.range * 0.85) { mvx = dirx * e.speed; mvy = diry * e.speed; }
      else if (dist < 140) { mvx = -dirx * e.speed * 0.8; mvy = -diry * e.speed * 0.8; }
      e.angle = Math.atan2(diry, dirx);
      if (e.timer <= 0 && dist < e.def.range) {
        e.timer = U.rand(2.0, 2.8);
        for (let s = -1; s <= 1; s++) {
          const a = e.angle + s * 0.22;
          game.enemyProjectiles.push({
            x: e.x, y: e.y,
            vx: Math.cos(a) * 220, vy: Math.sin(a) * 220,
            damage: Math.round(e.damage * 0.7),
            radius: 6, life: 3.2, sprite: "papel",
            color: "#f03e3e"
          });
        }
        AudioSys.tone(440, 0.08, "square", 0.12, 0, 300);
      }
      break;
    }
    case "miniboss": {
      // persigue y embiste en ciclos
      if (e.state === "chase") {
        mvx = dirx * e.speed; mvy = diry * e.speed;
        if (e.timer <= 0 && dist < 400) {
          e.state = "windup"; e.windup = 0.7; e.timer = 3;
          e.chargeAngle = Math.atan2(diry, dirx);
        }
      } else if (e.state === "windup") {
        e.windup -= dt;
        if (e.windup <= 0) {
          e.state = "charge"; e.chargeTimer = 0.7;
          AudioSys.tone(160, 0.3, "sawtooth", 0.25, 0, 90);
        }
      } else if (e.state === "charge") {
        e.chargeTimer -= dt;
        mvx = Math.cos(e.chargeAngle) * 460;
        mvy = Math.sin(e.chargeAngle) * 460;
        Particles.spawn({
          x: e.x, y: e.y, vx: U.rand(-40, 40), vy: U.rand(-40, 40),
          life: 0.3, size: 4, color: "#ffd43b"
        });
        if (e.chargeTimer <= 0) { e.state = "chase"; e.timer = 2.2; }
      }
      // escupe estrellas cada tanto
      if (e.miniFire === undefined) e.miniFire = 2;
      e.miniFire -= dt;
      if (e.miniFire <= 0) {
        e.miniFire = 2.6;
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + U.rand(0.2);
          game.enemyProjectiles.push({
            x: e.x, y: e.y,
            vx: Math.cos(a) * 190, vy: Math.sin(a) * 190,
            damage: Math.round(e.damage * 0.6),
            radius: 8, life: 3.5, sprite: "star", color: "#ffd43b"
          });
        }
      }
      e.angle = Math.atan2(diry, dirx);
      break;
    }
  }

  // empuje
  e.x += (mvx + e.kbx) * dt;
  e.y += (mvy + e.kby) * dt;
  e.kbx *= Math.pow(0.0018, dt);
  e.kby *= Math.pow(0.0018, dt);

  // separación simple entre enemigos
  // (los enemigos con IA walker empujan a otros leves)
  if (e.ai === "walker" || e.ai === "miniboss") {
    for (const o of game.enemies) {
      if (o === e || o.dead) continue;
      const d2 = U.dist2(e.x, e.y, o.x, o.y);
      const rr = (e.radius + o.radius) * 0.8;
      if (d2 < rr * rr && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const push = (rr - d) * 2;
        e.x += ((e.x - o.x) / d) * push * dt;
        e.y += ((e.y - o.y) / d) * push * dt;
      }
    }
  }

  // mantener en el mundo
  e.x = U.clamp(e.x, 20, WORLD.w - 20);
  e.y = U.clamp(e.y, 20, WORLD.h - 20);

  // contacto con jugador
  if (U.circleHit(e.x, e.y, e.radius, p.x, p.y, p.radius)) {
    game.hurtPlayer(e.damage, e.x, e.y);
  }
}
