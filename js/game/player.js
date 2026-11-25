/* ============ Jugador (el volantín) ============ */
"use strict";

const Player = {
  create() {
    return {
      x: WORLD.w / 2,
      y: WORLD.h / 2,
      radius: 13,
      hp: 100,
      maxHp: 100,
      level: 1,
      xp: 0,
      xpNext: 5,
      coins: 0,
      kills: 0,
      dead: false,
      // stats modificables
      stats: {
        damageMult: 1,
        speedMult: 1,
        cooldownMult: 1,
        areaMult: 1,
        xpMult: 1,
        coinMult: 1,
        armor: 0,
        crit: 0,
        regen: 0,
        magnet: 70
      },
      // movimiento / visual
      moveAngle: 0,
      aimAngle: 0,
      facing: 1,
      tilt: 0,
      invuln: 0,
      // estela del hilo
      trail: [],
      trailTimer: 0,
      regenTimer: 0,
      // revivir
      revives: 0
    };
  },

  update(dt, game) {
    const p = game.player;
    const ax = Input.axis();

    const speed = 205 * p.stats.speedMult;
    if (ax.x || ax.y) {
      p.x += ax.x * speed * dt;
      p.y += ax.y * speed * dt;
      p.moveAngle = Math.atan2(ax.y, ax.x);
      p.tilt = U.lerp(p.tilt, ax.x * 0.35, 0.15);
      if (ax.x !== 0) p.facing = ax.x > 0 ? 1 : -1;
    } else {
      p.tilt = U.lerp(p.tilt, 0, 0.1);
    }

    p.x = U.clamp(p.x, 30, WORLD.w - 30);
    p.y = U.clamp(p.y, 30, WORLD.h - 30);

    p.invuln = Math.max(0, p.invuln - dt);

    // regeneración
    if (p.stats.regen > 0 && p.hp < p.maxHp) {
      p.regenTimer += dt;
      if (p.regenTimer >= 1) {
        p.regenTimer = 0;
        p.hp = Math.min(p.maxHp, p.hp + p.stats.regen);
        Particles.spawn({ x: p.x, y: p.y - 14, vy: -30, life: 0.5, size: 3, color: "#69db7c", glow: true });
      }
    }

    // estela del hilo (detrás del volantín)
    p.trailTimer -= dt;
    if (p.trailTimer <= 0) {
      p.trailTimer = 0.03;
      p.trail.push({ x: p.x, y: p.y, life: 0.7 });
      if (p.trail.length > 40) p.trail.shift();
    }
    for (let i = p.trail.length - 1; i >= 0; i--) {
      p.trail[i].life -= dt;
      if (p.trail[i].life <= 0) p.trail.splice(i, 1);
    }

    // XP
    while (p.xp >= p.xpNext) {
      p.xp -= p.xpNext;
      p.level++;
      p.xpNext = Math.floor(5 + p.level * 3.2 + Math.pow(p.level, 1.55));
      game.pendingLevelups++;
    }
  },

  draw(ctx, game, camX, camY) {
    const p = game.player;

    // estela del hilo
    if (p.trail.length > 1) {
      ctx.lineCap = "round";
      for (let i = 1; i < p.trail.length; i++) {
        const a = p.trail[i - 1], b = p.trail[i];
        const alpha = Math.max(0, b.life / 0.7) * 0.5;
        ctx.strokeStyle = `rgba(229,219,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(a.x - camX, a.y - camY);
        ctx.lineTo(b.x - camX, b.y - camY);
        ctx.stroke();
      }
    }

    const sx = Math.round(p.x - camX);
    const sy = Math.round(p.y - camY);

    // sombra
    ctx.fillStyle = "rgba(0,0,0,.3)";
    ctx.beginPath();
    ctx.ellipse(sx, sy + 16, 12, 5, 0, 0, 7);
    ctx.fill();

    // parpadeo de invulnerabilidad
    if (p.invuln > 0 && Math.floor(p.invuln * 14) % 2 === 0) return;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(p.tilt * 0.4);
    if (p.facing < 0) ctx.scale(-1, 1);
    // flotación
    const bobY = Math.sin(game.time * 5) * 2;
    ctx.translate(0, bobY);
    const spr = Assets.get("player");
    ctx.drawImage(spr, -spr.width / 2, -spr.height / 2);
    ctx.restore();

    // aura al tener invuln
    if (p.invuln > 0.4) {
      ctx.strokeStyle = `rgba(255,212,59,${(0.4 + Math.sin(game.time * 20) * 0.2).toFixed(2)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx, sy, 20, 0, 7);
      ctx.stroke();
    }
  }
};
