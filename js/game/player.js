/* ============ Jugador: el huaso + volantín con hilo físico ============ */
"use strict";

const ROPE_N = 16;

const Player = {
  create() {
    const p = {
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
      // volantín: sigue al ratón dentro del círculo del hilo
      kite: {
        x: WORLD.w / 2,
        y: WORLD.w / 2 - 140,
        len: 150,          // largo máximo de hilo (el círculo)
        minLen: 60,
        maxLen: 330,
        angle: -Math.PI / 2,
        bobT: 0
      },
      // cadena física del hilo (verlet)
      rope: { pts: [] },
      cutFlash: 0,         // aviso visual de que el hilo te cortó
      // movimiento / visual
      moveAngle: 0,
      aimAngle: -Math.PI / 2,
      facing: 1,
      tilt: 0,
      invuln: 0,
      trail: [],
      trailTimer: 0,
      regenTimer: 0,
      revives: 0
    };
    // cuerda inicial
    const hx = p.x + 11, hy = p.y - 2;
    for (let i = 0; i < ROPE_N; i++) {
      const t = i / (ROPE_N - 1);
      const x = U.lerp(hx, p.kite.x, t);
      const y = U.lerp(hy, p.kite.y, t);
      p.rope.pts.push({ x, y, px: x, py: y });
    }
    return p;
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
      if (ax.x !== 0) p.facing = ax.x > 0 ? 1 : -1; // la mano no sigue al ratón: el hilo puede cruzarte
    }

    p.x = U.clamp(p.x, 30, WORLD.w - 30);
    p.y = U.clamp(p.y, 30, WORLD.h - 30);

    // ---- Ratón: el volantín va donde va el ratón (dentro del círculo del hilo) ----
    const k = p.kite;
    const mouseWorldX = Input.mouse.x + game.camX;
    const mouseWorldY = Input.mouse.y + game.camY;
    const dxm = mouseWorldX - p.x;
    const dym = mouseWorldY - p.y;
    const dm = Math.sqrt(dxm * dxm + dym * dym);
    if (dm > 6) k.angle = Math.atan2(dym, dxm);
    p.aimAngle = k.angle;

    // click = más hilo · click der / rueda = menos
    const wheel = Input.consumeWheel();
    if (Input.mouse.left) k.len += 150 * dt;
    if (Input.mouse.right) k.len -= 150 * dt;
    k.len += wheel * 26;
    k.len = U.clamp(k.len, k.minLen, k.maxLen);

    // destino: exactamente donde está el ratón, limitado al círculo [24, len]
    k.bobT += dt;
    const targetDist = U.clamp(dm, 24, k.len);
    const sway = Math.sin(k.bobT * 2.8) * 4;
    const tx = p.x + Math.cos(k.angle) * targetDist + Math.cos(k.angle + Math.PI / 2) * sway;
    const ty = p.y + Math.sin(k.angle) * targetDist + Math.sin(k.angle + Math.PI / 2) * sway;
    const follow = 1 - Math.exp(-16 * dt); // rápido: el volantín va al ratón
    k.x = U.lerp(k.x, tx, follow);
    k.y = U.lerp(k.y, ty, follow);

    p.invuln = Math.max(0, p.invuln - dt);
    p.cutFlash = Math.max(0, p.cutFlash - dt);

    // regeneración
    if (p.stats.regen > 0 && p.hp < p.maxHp) {
      p.regenTimer += dt;
      if (p.regenTimer >= 1) {
        p.regenTimer = 0;
        p.hp = Math.min(p.maxHp, p.hp + p.stats.regen);
        Particles.spawn({ x: p.x, y: p.y - 14, vy: -30, life: 0.5, size: 3, color: "#69db7c", glow: true });
      }
    }

    // ---- FÍSICA DEL HILO (verlet con gravedad y viento) ----
    this.updateRope(dt, game);

    // ---- EL HILO TE CORRE SI TE CRUZA ----
    const handX = p.x + (p.facing >= 0 ? 11 : -11);
    const handY = p.y - 2;
    const pts = p.rope.pts;
    for (let i = 1; i < pts.length; i++) {
      const pt = pts[i];
      // zona segura en el agarre (los primeros tramos salen de la mano)
      if (U.dist(pt.x, pt.y, handX, handY) < 17) continue;
      if (U.dist(pt.x, pt.y, p.x, p.y) < 11) {
        p.cutFlash = 0.35;
        game.hurtPlayer(10, pt.x, pt.y);
        Particles.burst(pt.x, pt.y, 5, "#ff6b6b", { spMax: 160, life: 0.35 });
        break;
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

  /* cadena verlet: extremo 0 fijo en la mano, extremo final en el volantín */
  updateRope(dt, game) {
    const p = game.player;
    const k = p.kite;
    const pts = p.rope.pts;
    const handX = p.x + (p.facing >= 0 ? 11 : -11);
    const handY = p.y - 2;

    // largo de reposo: distancia real + un poco de holgura (se balancea)
    const base = U.dist(handX, handY, k.x, k.y);
    const restTotal = base * 1.07 + 6;
    const seg = restTotal / (ROPE_N - 1);

    // integración verlet
    const damp = Math.pow(0.975, dt * 60);
    const g = 620 * dt * dt;
    const wind = Math.sin(game.time * 1.7) * 14 * dt * dt;
    for (let i = 1; i < ROPE_N - 1; i++) {
      const pt = pts[i];
      const vx = (pt.x - pt.px) * damp;
      const vy = (pt.y - pt.py) * damp;
      pt.px = pt.x;
      pt.py = pt.y;
      pt.x += vx + wind;
      pt.y += vy + g;
    }
    // fijar extremos
    pts[0].x = handX; pts[0].y = handY;
    pts[0].px = handX; pts[0].py = handY;
    pts[ROPE_N - 1].x = k.x; pts[ROPE_N - 1].y = k.y;
    pts[ROPE_N - 1].px = k.x; pts[ROPE_N - 1].py = k.y;

    // restricciones de distancia
    for (let iter = 0; iter < 5; iter++) {
      for (let i = 0; i < ROPE_N - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        let dx = b.x - a.x, dy = b.y - a.y;
        let d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.0001) d = 0.0001;
        const diff = (d - seg) / d;
        const ox = dx * diff, oy = dy * diff;
        const aFixed = (i === 0);
        const bFixed = (i + 1 === ROPE_N - 1);
        if (aFixed && bFixed) continue;
        if (aFixed) { b.x -= ox; b.y -= oy; }
        else if (bFixed) { a.x += ox; a.y += oy; }
        else {
          a.x += ox * 0.5; a.y += oy * 0.5;
          b.x -= ox * 0.5; b.y -= oy * 0.5;
        }
      }
    }
  },

  draw(ctx, game, camX, camY) {
    const p = game.player;
    const k = p.kite;
    const pts = p.rope.pts;

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

    // ---- HILO FÍSICO (curva suave por la cadena) ----
    const hiloLv = WeaponSystem.get("hilo");
    const lv = hiloLv ? hiloLv.level : 1;
    const width = 2 + lv * 0.3;
    const cut = p.cutFlash > 0;

    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = cut ? "rgba(255,107,107,.95)" : "rgba(229,219,255,.9)";
    ctx.shadowColor = cut ? "#ff6b6b" : "#e5dbff";
    ctx.shadowBlur = 7;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(pts[0].x - camX, pts[0].y - camY);
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = (pts[i].x + pts[i + 1].x) / 2;
      const yc = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x - camX, pts[i].y - camY, xc - camX, yc - camY);
    }
    ctx.lineTo(pts[pts.length - 1].x - camX, pts[pts.length - 1].y - camY);
    ctx.stroke();
    // brillo interior
    ctx.strokeStyle = cut ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.7)";
    ctx.lineWidth = Math.max(1, width - 2);
    ctx.stroke();
    ctx.restore();

    // chispa recorriendo el hilo
    const sparkIdx = Math.floor(((game.time * 9) % 1) * (pts.length - 1));
    const sp = pts[sparkIdx];
    ctx.fillStyle = cut ? "#ff6b6b" : "#fff";
    ctx.fillRect(Math.round(sp.x - camX) - 1, Math.round(sp.y - camY) - 1, 3, 3);

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
      if (p.facing < 0) ctx.scale(-1, 1);
      const bob = Math.sin(game.time * 6) * 1.2;
      const spr = Assets.get("huaso");
      ctx.drawImage(spr, -spr.width / 2, -spr.height / 2 + bob);
      ctx.restore();
    }

    // aura invulnerabilidad / aviso de corte
    if (p.invuln > 0.4) {
      ctx.strokeStyle = `rgba(255,212,59,${(0.4 + Math.sin(game.time * 20) * 0.2).toFixed(2)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hx, hy, 20, 0, 7);
      ctx.stroke();
    }
    if (p.cutFlash > 0) {
      ctx.strokeStyle = `rgba(255,107,107,${(p.cutFlash * 2).toFixed(2)})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(hx, hy, 16, 0, 7);
      ctx.stroke();
    }

    // ---- VOLANTÍN (el que hace daño) ----
    const ksx = Math.round(k.x - camX);
    const ksy = Math.round(k.y - camY);
    ctx.fillStyle = "rgba(0,0,0,.22)";
    ctx.beginPath();
    ctx.ellipse(ksx, ksy + 16, 10, 4, 0, 0, 7);
    ctx.fill();

    ctx.save();
    ctx.translate(ksx, ksy);
    const lean = Math.sin(k.bobT * 2.6) * 0.2;
    ctx.rotate((k.angle + Math.PI / 2) * 0.1 + lean);
    const kspr = Assets.get("player");
    ctx.drawImage(kspr, -kspr.width / 2, -kspr.height / 2);
    ctx.restore();

    // aura de daño del volantín
    ctx.strokeStyle = "rgba(255,212,59,.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ksx, ksy, 15, 0, 7);
    ctx.stroke();
  }
};
