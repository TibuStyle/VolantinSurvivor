/* ============ Jugador: el huaso + su volantín con hilo ============ */
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
      // volantín (guía el ratón) + hilo
      kite: {
        x: WORLD.w / 2,
        y: WORLD.h / 2 - 140,
        len: 140,
        minLen: 60,
        maxLen: 330,
        angle: -Math.PI / 2,
        bobT: 0
      },
      // movimiento / visual
      moveAngle: 0,
      aimAngle: -Math.PI / 2,
      facing: 1,
      tilt: 0,
      invuln: 0,
      // estela detrás del volantín
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

    // ---- WASD mueve al huaso ----
    const speed = 205 * p.stats.speedMult;
    if (ax.x || ax.y) {
      p.x += ax.x * speed * dt;
      p.y += ax.y * speed * dt;
      p.moveAngle = Math.atan2(ax.y, ax.x);
      if (ax.x !== 0) p.facing = ax.x > 0 ? 1 : -1;
    }

    p.x = U.clamp(p.x, 30, WORLD.w - 30);
    p.y = U.clamp(p.y, 30, WORLD.h - 30);

    // ---- Ratón guía el volantín alrededor del huaso ----
    const k = p.kite;
    const mouseWorldX = Input.mouse.x + game.camX;
    const mouseWorldY = Input.mouse.y + game.camY;
    const dxm = mouseWorldX - p.x;
    const dym = mouseWorldY - p.y;
    if (dxm * dxm + dym * dym > 4) {
      k.angle = Math.atan2(dym, dxm);
    }
    p.aimAngle = k.angle;

    // click izquierdo = más hilo · click derecho = menos · rueda = ajuste fino
    const wheel = Input.consumeWheel();
    if (Input.mouse.left) k.len += 150 * dt;
    if (Input.mouse.right) k.len -= 150 * dt;
    k.len += wheel * 26;
    k.len = U.clamp(k.len, k.minLen, k.maxLen);

    // destino del volantín: a la longitud del hilo en la dirección del ratón
    k.bobT += dt;
    const sway = Math.sin(k.bobT * 2.6) * 7;
    const sway2 = Math.cos(k.bobT * 3.7) * 5;
    const tx = p.x + Math.cos(k.angle) * k.len + Math.cos(k.angle + Math.PI / 2) * sway;
    const ty = p.y + Math.sin(k.angle) * k.len + Math.sin(k.angle + Math.PI / 2) * sway + sway2 * 0.4;
    // el volantín voltea hacia su destino (sensación de vuelo)
    const follow = 1 - Math.exp(-9 * dt);
    k.x = U.lerp(k.x, tx, follow);
    k.y = U.lerp(k.y, ty, follow);

    // hilo: mira al volantín
    if (Math.cos(k.angle) !== 0) p.facing = Math.cos(k.angle) >= 0 ? 1 : -1;

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

    // estela de viento detrás del volantín
    p.trailTimer -= dt;
    if (p.trailTimer <= 0) {
      p.trailTimer = 0.035;
      p.trail.push({ x: k.x, y: k.y, life: 0.55 });
      if (p.trail.length > 26) p.trail.shift();
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
    const k = p.kite;

    // ---- estela del volantín ----
    if (p.trail.length > 1) {
      ctx.lineCap = "round";
      for (let i = 1; i < p.trail.length; i++) {
        const a = p.trail[i - 1], b = p.trail[i];
        const alpha = Math.max(0, b.life / 0.55) * 0.45;
        ctx.strokeStyle = `rgba(229,219,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(a.x - camX, a.y - camY);
        ctx.lineTo(b.x - camX, b.y - camY);
        ctx.stroke();
      }
    }

    // ---- HILO: de la mano del huaso al volantín (arma cortante) ----
    const handX = p.x + (p.facing >= 0 ? 11 : -11);
    const handY = p.y - 2;
    const kx = k.x, ky = k.y;
    const midX = (handX + kx) / 2;
    const midY = (handY + ky) / 2 + k.len * 0.07; // soga ligeramente colgada

    const hiloLv = WeaponSystem.get("hilo");
    const lv = hiloLv ? hiloLv.level : 1;
    const width = 2 + lv * 0.35;

    ctx.save();
    ctx.strokeStyle = "rgba(229,219,255,.9)";
    ctx.shadowColor = "#e5dbff";
    ctx.shadowBlur = 7;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(handX - camX, handY - camY);
    ctx.quadraticCurveTo(midX - camX, midY - camY, kx - camX, ky - camY);
    ctx.stroke();
    // brillo interior del hilo
    ctx.strokeStyle = "rgba(255,255,255,.75)";
    ctx.lineWidth = Math.max(1, width - 2);
    ctx.stroke();
    ctx.restore();

    // chispa que recorre el hilo (indica que corta)
    const sparkT = (game.time * 1.7) % 1;
    const it = 1 - sparkT;
    const sx = (1 - it) * (1 - it) * handX + 2 * (1 - it) * it * midX + it * it * kx;
    const sy = (1 - it) * (1 - it) * handY + 2 * (1 - it) * it * midY + it * it * ky;
    ctx.fillStyle = "#fff";
    ctx.fillRect(Math.round(sx - camX) - 1, Math.round(sy - camY) - 1, 3, 3);

    // ---- sombra del huaso ----
    ctx.fillStyle = "rgba(0,0,0,.3)";
    ctx.beginPath();
    ctx.ellipse(Math.round(p.x - camX), Math.round(p.y - camY) + 17, 12, 5, 0, 0, 7);
    ctx.fill();

    // ---- HUASO ----
    const hx = Math.round(p.x - camX);
    const hy = Math.round(p.y - camY);
    const blink = p.invuln > 0 && Math.floor(p.invuln * 14) % 2 === 0;
    if (!blink) {
      ctx.save();
      ctx.translate(hx, hy);
      // mira hacia su volantín
      const face = k.x >= p.x ? 1 : -1;
      if (face < 0) ctx.scale(-1, 1);
      const bob = Math.sin(game.time * 6) * 1.2;
      const spr = Assets.get("huaso");
      ctx.drawImage(spr, -spr.width / 2, -spr.height / 2 + bob);
      ctx.restore();
    }

    // aura de invulnerabilidad
    if (p.invuln > 0.4) {
      ctx.strokeStyle = `rgba(255,212,59,${(0.4 + Math.sin(game.time * 20) * 0.2).toFixed(2)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hx, hy, 20, 0, 7);
      ctx.stroke();
    }

    // ---- VOLANTÍN ----
    const ksx = Math.round(k.x - camX);
    const ksy = Math.round(k.y - camY);
    ctx.fillStyle = "rgba(0,0,0,.22)";
    ctx.beginPath();
    ctx.ellipse(ksx, ksy + 16, 10, 4, 0, 0, 7);
    ctx.fill();

    ctx.save();
    ctx.translate(ksx, ksy);
    // inclinación según dirección del hilo + balanceo
    const lean = Math.sin(k.bobT * 2.6) * 0.22;
    ctx.rotate((k.angle + Math.PI / 2) * 0.12 + lean);
    const kspr = Assets.get("player");
    ctx.drawImage(kspr, -kspr.width / 2, -kspr.height / 2);
    ctx.restore();

    // aro sutil de contacto (el volantín también golpea)
    ctx.strokeStyle = "rgba(255,243,191,.22)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ksx, ksy, 13, 0, 7);
    ctx.stroke();
  }
};
