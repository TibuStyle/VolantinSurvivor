/* ============ Mejoras de nivel (roguelike) y pasivas ============ */
"use strict";

const PASSIVE_DEFS = {
  viento: {
    id: "viento", name: "Velocidad del Viento", icon: "viento",
    desc: "+10% velocidad de vuelo por nivel.",
    maxLevel: 5, apply: (p) => { p.stats.speedMult += 0.10; }
  },
  acero: {
    id: "acero", name: "Hilo de Acero", icon: "acero",
    desc: "+12% de daño de todas las armas.",
    maxLevel: 5, apply: (p) => { p.stats.damageMult += 0.12; }
  },
  cielo: {
    id: "cielo", name: "Cielo Abierto", icon: "cielo",
    desc: "+25 puntos de vida máximos (y cura 25).",
    maxLevel: 5, apply: (p) => { p.maxHp += 25; p.hp = Math.min(p.maxHp, p.hp + 25); }
  },
  estrellaP: {
    id: "estrellaP", name: "Estrella Patria", icon: "estrellaP",
    desc: "+15% de experiencia ganada.",
    maxLevel: 4, apply: (p) => { p.stats.xpMult += 0.15; }
  },
  lucumi: {
    id: "lucumi", name: "Bolsillo del Pueblo", icon: "lucumi",
    desc: "+20% de lucumí ganado.",
    maxLevel: 4, apply: (p) => { p.stats.coinMult += 0.20; }
  },
  raya: {
    id: "raya", name: "Recarga Relámpago", icon: "raya",
    desc: "-8% tiempo de recarga de armas.",
    maxLevel: 4, apply: (p) => { p.stats.cooldownMult = Math.max(0.4, p.stats.cooldownMult - 0.08); }
  },
  alcance: {
    id: "alcance", name: "Alcance del Hilo", icon: "alcance",
    desc: "+10% de tamaño/alcance de armas.",
    maxLevel: 4, apply: (p) => { p.stats.areaMult += 0.10; }
  },
  suerte: {
    id: "suerte", name: "Fortuna del 18", icon: "suerte",
    desc: "+5% de probabilidad de crítico (x2 daño).",
    maxLevel: 4, apply: (p) => { p.stats.crit += 0.05; }
  },
  manta: {
    id: "manta", name: "Manta del Sur", icon: "manta",
    desc: "-2 de daño recibido por golpe.",
    maxLevel: 4, apply: (p) => { p.stats.armor += 2; }
  },
  corazon: {
    id: "corazon", name: "Corazón del Huaso", icon: "corazon",
    desc: "+1 de regeneración de vida por segundo.",
    maxLevel: 4, apply: (p) => { p.stats.regen += 1; }
  }
};

const UpgradeSystem = {
  /* Genera 3 cartas de mejora */
  rollCards(game) {
    const p = game.player;
    const cards = [];
    const pool = [];

    // armas mejorables
    for (const id of WeaponSystem.upgradeableIds()) {
      const w = WeaponSystem.get(id);
      const def = WEAPON_DEFS[id];
      pool.push({
        type: "weapon", id,
        name: def.name,
        desc: def.desc,
        icon: def.icon,
        level: w.level,
        maxLevel: def.maxLevel,
        weight: 3
      });
    }
    // armas nuevas (si hay menos de 6)
    if (WeaponSystem.list.length < 6) {
      for (const id of Object.keys(WEAPON_DEFS)) {
        if (!WeaponSystem.has(id)) {
          const def = WEAPON_DEFS[id];
          pool.push({
            type: "weaponNew", id,
            name: def.name,
            desc: "¡NUEVA ARMA! " + def.desc,
            icon: def.icon,
            level: 0, maxLevel: def.maxLevel,
            weight: 4
          });
        }
      }
    }
    // pasivas
    for (const id of Object.keys(PASSIVE_DEFS)) {
      const def = PASSIVE_DEFS[id];
      const lvl = game.passiveLevels[id] || 0;
      if (lvl < def.maxLevel) {
        pool.push({
          type: "passive", id,
          name: def.name,
          desc: def.desc,
          icon: def.icon,
          level: lvl, maxLevel: def.maxLevel,
          weight: 2.5
        });
      }
    }
    // curación si falta vida
    if (p.hp < p.maxHp * 0.85) {
      pool.push({
        type: "heal", id: "heal",
        name: "Curasión de la Abuela",
        desc: "Recupera el 45% de tu vida máxima.",
        icon: "heal", level: 0, maxLevel: 1, weight: 3
      });
    }

    if (!pool.length) {
      // fallback: cura o daño
      pool.push({ type: "heal", id: "heal", name: "Curasión", desc: "Recupera 50 de vida.", icon: "heal", level: 0, maxLevel: 1, weight: 1 });
    }

    // muestreo ponderado sin repetir
    const chosen = [];
    const work = pool.slice();
    while (chosen.length < 3 && work.length) {
      let total = 0;
      for (const c of work) total += c.weight;
      let r = Math.random() * total;
      let idx = 0;
      for (let i = 0; i < work.length; i++) {
        r -= work[i].weight;
        if (r <= 0) { idx = i; break; }
      }
      chosen.push(work[idx]);
      work.splice(idx, 1);
    }
    return chosen;
  },

  apply(game, card) {
    const p = game.player;
    if (card.type === "weapon") {
      WeaponSystem.add(card.id, 1);
    } else if (card.type === "weaponNew") {
      WeaponSystem.add(card.id, 1);
    } else if (card.type === "passive") {
      const def = PASSIVE_DEFS[card.id];
      game.passiveLevels[card.id] = (game.passiveLevels[card.id] || 0) + 1;
      def.apply(p);
    } else if (card.type === "heal") {
      p.hp = Math.min(p.maxHp, p.hp + Math.ceil(p.maxHp * 0.45));
      Particles.burst(p.x, p.y, 20, "#69db7c", { glow: true });
    }
    AudioSys.levelup();
  }
};
