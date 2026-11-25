/* ============ Utilidades ============ */
"use strict";

const U = {
  clamp(v, a, b) { return v < a ? a : (v > b ? b : v); },
  lerp(a, b, t) { return a + (b - a) * t; },
  rand(a = 1, b) { return b === undefined ? Math.random() * a : a + Math.random() * (b - a); },
  randInt(a, b) { return Math.floor(U.rand(a, b + 1)); },
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  chance(p) { return Math.random() < p; },
  dist(ax, ay, bx, by) { const dx = bx - ax, dy = by - ay; return Math.sqrt(dx * dx + dy * dy); },
  dist2(ax, ay, bx, by) { const dx = bx - ax, dy = by - ay; return dx * dx + dy * dy; },
  angle(ax, ay, bx, by) { return Math.atan2(by - ay, bx - ax); },
  // acercar ángulo
  angleLerp(a, b, t) {
    let d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return a + d * t;
  },
  fmtTime(s) {
    s = Math.max(0, Math.floor(s));
    const m = Math.floor(s / 60), r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  },
  circleHit(ax, ay, ar, bx, by, br) {
    const r = ar + br;
    return U.dist2(ax, ay, bx, by) <= r * r;
  },
  /* distancia de un punto al segmento A-B */
  distToSegment(px, py, ax, ay, bx, by) {
    const abx = bx - ax, aby = by - ay;
    const len2 = abx * abx + aby * aby || 1;
    let t = ((px - ax) * abx + (py - ay) * aby) / len2;
    t = t < 0 ? 0 : (t > 1 ? 1 : t);
    return U.dist(px, py, ax + abx * t, ay + aby * t);
  },
  // guardado local
  save(key, data) {
    try { localStorage.setItem("volantin_" + key, JSON.stringify(data)); } catch (e) { /* noop */ }
  },
  load(key, def) {
    try {
      const s = localStorage.getItem("volantin_" + key);
      return s ? JSON.parse(s) : def;
    } catch (e) { return def; }
  },
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};
