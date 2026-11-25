/* Smoke test: corre Assets.init y flujos clave con mocks de navegador */
"use strict";

// ---- Mocks mínimos de navegador ----
const calls = { drawImage: 0, fillRect: 0 };

function makeCtx(canvas) {
  const ctx = {
    canvas,
    fillStyle: "", strokeStyle: "", lineWidth: 1, globalAlpha: 1,
    font: "", textAlign: "left", textBaseline: "alphabetic",
    lineCap: "butt", lineDashOffset: 0, filter: "none", shadowBlur: 0, shadowColor: "",
    imageSmoothingEnabled: true,
    fillRect() { calls.fillRect++; },
    strokeRect() {},
    clearRect() {},
    beginPath() {},
    closePath() {},
    moveTo() {}, lineTo() {},
    arc() {}, ellipse() {}, quadraticCurveTo() {},
    fill() {}, stroke() {},
    save() {}, restore() {},
    translate() {}, rotate() {}, scale() {},
    setLineDash() {},
    drawImage() { calls.drawImage++; },
    measureText() { return { width: 10 }; },
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; },
    createPattern() { return { }; },
    fillText() {},
    getImageData() { return { data: new Uint8ClampedArray(4) }; },
    putImageData() {}
  };
  return ctx;
}

class FakeCanvas {
  constructor() {
    this.width = 300; this.height = 150;
    this._ctx = makeCtx(this);
    this.style = {};
  }
  getContext() { return this._ctx; }
  toDataURL() { return "data:image/png;base64,xxx"; }
  addEventListener() {}
  removeEventListener() {}
  getBoundingClientRect() { return { left: 0, top: 0, width: 960, height: 540 }; }
}

const elements = {};
function el(id) {
  if (!elements[id]) {
    if (id === "game") {
      const c = new FakeCanvas();
      c.clientWidth = 960;
      c.clientHeight = 540;
      c.getBoundingClientRect = () => ({ left: 0, top: 0, width: 960, height: 540 });
      elements[id] = c;
      return c;
    }
    elements[id] = {
      id,
      classList: { add() {}, remove() {}, toggle() {} },
      style: {},
      innerHTML: "",
      textContent: "",
      appendChild() {},
      querySelector() { return { addEventListener() {}, disabled: false }; },
      addEventListener() {},
      clientWidth: 960,
      clientHeight: 540,
      width: 0, height: 0,
      title: "",
      alt: "",
      src: ""
    };
  }
  return elements[id];
}

global.document = {
  getElementById: (id) => el(id),
  createElement: (tag) => {
    if (tag === "canvas") return new FakeCanvas();
    return {
      className: "", innerHTML: "", textContent: "", title: "", alt: "", src: "",
      classList: { add() {}, remove() {}, toggle() {} },
      style: {},
      appendChild() {},
      addEventListener() {},
      querySelector() { return { addEventListener() {} }; }
    };
  },
  addEventListener() {}
};

global.window = {
  addEventListener() {},
  AudioContext: undefined,
  webkitAudioContext: undefined
};

global.performance = { now: () => Date.now() };
global.requestAnimationFrame = () => 1;
global.localStorage = {
  _s: {},
  getItem(k) { return this._s[k] || null; },
  setItem(k, v) { this._s[k] = v; },
  removeItem(k) { delete this._s[k]; }
};
global.setInterval = () => 1;
global.clearInterval = () => {};
global.setTimeout = (fn) => { /* no ejecutar timers en test */ return 1; };
global.clearTimeout = () => {};

// ---- Cargar scripts en orden ----
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const files = [
  "js/core/utils.js",
  "js/core/input.js",
  "js/core/audio.js",
  "js/core/assets.js",
  "js/core/particles.js",
  "js/game/stages.js",
  "js/game/weapons.js",
  "js/game/enemies.js",
  "js/game/bosses.js",
  "js/game/player.js",
  "js/game/upgrades.js",
  "js/game/shop.js",
  "js/game/hud.js",
  "js/game/main.js"
];

const sandbox = global;
let failed = false;

for (const f of files) {
  const code = fs.readFileSync(path.join(root, f), "utf8");
  try {
    vm.runInThisContext(code, { filename: f });
    console.log("✓ carga:", f);
  } catch (e) {
    console.error("✗ error al cargar:", f, "\n  ", e.message);
    failed = true;
  }
}

if (!failed) {
  try {
    Assets.init();
    console.log("✓ Assets.init() — sprites:", Object.keys(Assets.sprites).length, "iconos:", Object.keys(Assets.icons).length);
  } catch (e) {
    console.error("✗ Assets.init():", e.stack);
    failed = true;
  }
}

if (!failed) {
  try {
    // simular arranque del juego
    Game.init();
    console.log("✓ Game.init()");

    // validar defs clave
    const stages = STAGES.length;
    const weapons = Object.keys(WEAPON_DEFS).length;
    const enemies = Object.keys(ENEMY_DEFS).length;
    const bosses = Object.keys(BOSS_DEFS).length;
    const shop = SHOP_ITEMS.length;
    console.log(`✓ contenido: ${stages} etapas, ${weapons} armas, ${enemies} enemigos, ${bosses} jefes, ${shop} mejoras tienda`);

    if (stages !== 3) throw new Error("Se esperaban 3 etapas");
    if (weapons < 8) throw new Error("Muy pocas armas");
    if (bosses < 3) throw new Error("Se esperaban 3 jefes de mundo");

    // simular partida: startRun + update varios frames
    Game.startRun();
    if (Game.state !== "intro") throw new Error("startRun no entró en intro, state=" + Game.state);
    console.log("✓ startRun() → state=intro");

    // saltar intro
    Game.state = "play";
    Game.running = true;

    // simular 600 frames (~10s)
    for (let i = 0; i < 600; i++) {
      Game.update(1 / 60);
      Game.render();
    }
    console.log(`✓ 600 frames simulados — enemigos: ${Game.enemies.length}, state: ${Game.state}`);

    // spawnear cada tipo de enemigo y actualizar
    for (const t of Object.keys(ENEMY_DEFS)) {
      const e = Enemies.spawn(Game, t, Game.player.x + 100, Game.player.y + 100, 1, 1);
      if (!e) throw new Error("No se pudo spawnear " + t);
    }
    for (let i = 0; i < 120; i++) Game.update(1 / 60);
    console.log("✓ todos los enemigos actualizados");

    // spawnear cada jefe y simular sus patrones
    for (const b of Object.keys(BOSS_DEFS)) {
      Game.bossSpawned = false;
      const boss = Bosses.spawn(Game, b);
      if (!boss) throw new Error("No se pudo spawnear boss " + b);
      for (let i = 0; i < 300; i++) {
        Game.player.dead = false;
        if (Game.player.hp < Game.player.maxHp) Game.player.hp = Game.player.maxHp;
        Game.player.invuln = 1; // el test no mueve al jugador
        Game.update(1 / 60);
        Game.render();
      }
      // matar jefe
      Game.player.invuln = 0;
      Game.damageEnemy(boss, 999999, "hilo", false);
      console.log(`✓ jefe ${b} simulado 300 frames y derrotado — state: ${Game.state}`);
      if (Game.stageEnding) break;
    }

    // probar level-up (forzar estado sano y jugable)
    Game.player.dead = false;
    Game.player.hp = Game.player.maxHp;
    Game.player.invuln = 0;
    Game.state = "play";
    Game.pendingLevelups = 1;
    Game.update(1 / 60);
    if (Game.state !== "levelup") throw new Error("No entró en levelup, state=" + Game.state);
    const box = elements["levelup-cards"];
    console.log("✓ levelup renderizado");

    // aplicar carta
    if (Game.onCardChosen) Game.onCardChosen();
    console.log("✓ carta elegida → state:", Game.state);

    // probar tienda
    Shop.render();
    console.log("✓ tienda renderizada");

    // probar hurt / game over
    Game.state = "play";
    Game.player.dead = false;
    Game.player.hp = Game.player.maxHp;
    Game.player.invuln = 0;
    Game.player.revives = 0;
    Game.hurtPlayer(99999, Game.player.x - 50, Game.player.y);
    if (!Game.player.dead) throw new Error("El jugador no murió con daño masivo");
    console.log("✓ game over por daño masivo");

    console.log("\n══════════════════════════");
    console.log("SMOKE TEST: TODO OK ✅");
    console.log("drawImage calls:", calls.drawImage, "| fillRect calls:", calls.fillRect);
  } catch (e) {
    console.error("\n✗ FALLA:", e.stack);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
