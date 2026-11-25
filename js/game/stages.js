/* ============ Etapas (mundos) del juego ============ */
"use strict";

const STAGES = [
  {
    id: 0,
    name: "Plaza de la Fiesta",
    kicker: "MUNDO 1",
    duration: 165, // segundos hasta el jefe
    boss: "castillo",
    ground: { base: "#3d4451", tile: "#4a5261", alt: "#353b47", line: "#2b303b" },
    skyTop: "#0b1628", skyBot: "#1a2f4d",
    props: ["flagPole", "table", "tree", "lantern", "bunting", "rock"],
    propCount: 26,
    enemies: [
      { type: "empanada", w: 40 },
      { type: "sopaipilla", w: 22 },
      { type: "choripan", w: 16 },
      { type: "luchador", w: 8 },
      { type: "diablito", w: 8 },
      { type: "carreta", w: 0.15 } // mini jefe raro
    ],
    minibossAt: 0.55,
    miniboss: "carreta",
    theme: "fiesta"
  },
  {
    id: 1,
    name: "Orillas del Mapocho",
    kicker: "MUNDO 2",
    duration: 190,
    boss: "lagarto",
    ground: { base: "#7a6248", tile: "#8a7052", alt: "#6b5540", line: "#5d4936" },
    skyTop: "#0a1424", skyBot: "#14324a",
    props: ["rock", "tree", "cactus", "flagPole", "lantern", "bunting"],
    propCount: 24,
    enemies: [
      { type: "empanada", w: 24 },
      { type: "choripan", w: 18 },
      { type: "piquero", w: 16 },
      { type: "guanaco", w: 12 },
      { type: "diablito", w: 12 },
      { type: "luchador", w: 10 },
      { type: "cochayuyo", w: 8 },
      { type: "sopaipilla", w: 14 }
    ],
    minibossAt: 0.5,
    miniboss: "carreta",
    theme: "rio"
  },
  {
    id: 2,
    name: "Cumbre del Volantín",
    kicker: "MUNDO 3",
    duration: 215,
    boss: "volantinOscuro",
    ground: { base: "#2c2540", tile: "#362d4f", alt: "#241e38", line: "#1c1730" },
    skyTop: "#05060f", skyBot: "#191033",
    props: ["rock", "tree", "flagPole", "lantern"],
    propCount: 20,
    enemies: [
      { type: "sombra", w: 24 },
      { type: "empanada", w: 16 },
      { type: "choripan", w: 14 },
      { type: "luchador", w: 12 },
      { type: "guanaco", w: 10 },
      { type: "diablito", w: 12 },
      { type: "cochayuyo", w: 10 },
      { type: "piquero", w: 12 },
      { type: "sopaipilla", w: 12 }
    ],
    minibossAt: 0.45,
    miniboss: "carreta",
    theme: "cumbre"
  }
];

const WORLD = { w: 3400, h: 3400 };

/* Genera el tile del suelo (canvas repetible) */
function makeGroundTile(def) {
  const S = 64;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const x = c.getContext("2d");
  x.fillStyle = def.ground.base;
  x.fillRect(0, 0, S, S);
  // bloques
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (U.chance(0.4)) {
        x.fillStyle = U.chance(0.5) ? def.ground.tile : def.ground.alt;
        x.fillRect(i * 8, j * 8, 8, 8);
      }
    }
  }
  // líneas sutiles
  x.strokeStyle = def.ground.line;
  x.lineWidth = 1;
  x.strokeRect(0.5, 0.5, S - 1, S - 1);
  // motas
  for (let i = 0; i < 26; i++) {
    x.fillStyle = U.chance(0.5) ? def.ground.line : def.ground.tile;
    x.fillRect(U.randInt(0, S - 2), U.randInt(0, S - 2), 2, 2);
  }
  return c;
}

function pickWeighted(list) {
  let total = 0;
  for (const e of list) total += e.w;
  if (total <= 0) return null;
  let r = Math.random() * total;
  for (const e of list) {
    r -= e.w;
    if (r <= 0) return e.type;
  }
  return list[list.length - 1].type;
}
