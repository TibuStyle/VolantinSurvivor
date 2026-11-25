/* ============ Partículas y números de daño ============ */
"use strict";

const Particles = {
  list: [],
  texts: [],

  clear() { this.list = []; this.texts = []; },

  spawn(o) {
    this.list.push({
      x: o.x, y: o.y,
      vx: o.vx || 0, vy: o.vy || 0,
      life: o.life || 0.5, maxLife: o.life || 0.5,
      size: o.size || 3,
      color: o.color || "#fff",
      grav: o.grav || 0,
      drag: o.drag !== undefined ? o.drag : 0.9,
      glow: !!o.glow,
      shape: o.shape || "rect" // rect | star | circle
    });
  },

  burst(x, y, n, color, opt = {}) {
    for (let i = 0; i < n; i++) {
      const a = U.rand(Math.PI * 2), sp = U.rand(opt.spMin || 40, opt.spMax || 180);
      this.spawn({
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: U.rand(0.25, opt.life || 0.7),
        size: U.rand(2, opt.size || 5),
        color: Array.isArray(color) ? U.pick(color) : color,
        grav: opt.grav || 0,
        glow: opt.glow !== false,
        shape: opt.shape || "rect"
      });
    }
  },

  confetti(x, y, n = 14) {
    this.burst(x, y, n, ["#e03131", "#f8f9fa", "#1971c2", "#ffd43b"], {
      spMin: 60, spMax: 220, life: 1.1, size: 4, grav: 220, glow: false, shape: "rect"
    });
  },

  damageText(x, y, val, color = "#ffd43b", big = false) {
    if (this.texts.length > 60) this.texts.shift();
    this.texts.push({
      x: x + U.rand(-8, 8), y: y - 8,
      vy: -46, life: big ? 0.9 : 0.6, maxLife: big ? 0.9 : 0.6,
      text: String(val), color, big
    });
  },

  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.life -= dt;
      if (p.life <= 0) { this.list.splice(i, 1); continue; }
      p.vy += p.grav * dt;
      p.vx *= Math.pow(p.drag, dt * 60);
      p.vy *= Math.pow(p.drag, dt * 60);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      t.life -= dt;
      if (t.life <= 0) { this.texts.splice(i, 1); continue; }
      t.y += t.vy * dt;
      t.vy *= 0.94;
    }
  },

  draw(ctx, camX, camY) {
    for (const p of this.list) {
      const sx = Math.round(p.x - camX), sy = Math.round(p.y - camY);
      if (sx < -20 || sy < -20 || sx > ctx.canvas.width + 20 || sy > ctx.canvas.height + 20) continue;
      const a = U.clamp(p.life / p.maxLife, 0, 1);
      ctx.globalAlpha = a;
      if (p.glow) { ctx.shadowColor = p.color; ctx.shadowBlur = 6; }
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath(); ctx.arc(sx, sy, p.size * a, 0, 7); ctx.fill();
      } else if (p.shape === "star") {
        const s = p.size;
        ctx.fillRect(sx - 1, sy - s, 2, s * 2);
        ctx.fillRect(sx - s, sy - 1, s * 2, 2);
      } else {
        const s = Math.max(1, p.size * a);
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
      }
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
    // textos
    ctx.textAlign = "center";
    for (const t of this.texts) {
      const sx = Math.round(t.x - camX), sy = Math.round(t.y - camY);
      const a = U.clamp(t.life / t.maxLife, 0, 1);
      ctx.globalAlpha = a;
      ctx.font = (t.big ? "bold 18px" : "bold 13px") + " 'Arial Black', sans-serif";
      ctx.fillStyle = "#000";
      ctx.fillText(t.text, sx + 1, sy + 2);
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, sx, sy);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }
};
