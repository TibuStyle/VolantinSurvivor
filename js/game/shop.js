/* ============ Tienda del Huaso (mejoras permanentes con Lucumí) ============ */
"use strict";

const SHOP_ITEMS = [
  { id: "hp",     icon: "cielo",     name: "Corazón del Huaso",   desc: "+20 vida máxima",              max: 5, costs: [25, 50, 90, 150, 240] },
  { id: "dmg",    icon: "acero",     name: "Hilo de Acero",       desc: "+6% daño permanente",          max: 5, costs: [35, 70, 130, 210, 330] },
  { id: "spd",    icon: "viento",    name: "Zapatos de Baile",    desc: "+5% velocidad de vuelo",       max: 4, costs: [30, 65, 120, 200] },
  { id: "xp",     icon: "estrellaP", name: "Ojo de Águila",       desc: "+8% experiencia",              max: 4, costs: [40, 85, 155, 250] },
  { id: "coins",  icon: "lucumi",    name: "Lucumí del Pueblo",   desc: "+12% lucumí ganado",           max: 4, costs: [35, 75, 140, 230] },
  { id: "armor",  icon: "manta",     name: "Escudo del Sur",      desc: "-1 daño recibido por golpe",   max: 3, costs: [50, 110, 200] },
  { id: "cdr",    icon: "raya",      name: "Manos Rápidas",       desc: "-5% recarga de armas",         max: 3, costs: [55, 120, 220] },
  { id: "magnet", icon: "alcance",   name: "Imán Estelar",        desc: "+30% alcance de recolección",  max: 3, costs: [25, 60, 110] },
  { id: "crit",   icon: "suerte",    name: "Estrella Afortunada", desc: "+4% crítico",                  max: 3, costs: [60, 130, 240] },
  { id: "revive", icon: "revive",    name: "Segundo Aire",        desc: "Revives 1 vez al morir",       max: 2, costs: [200, 450] },
  { id: "start",  icon: "heal",      name: "Empanada de Regalo",  desc: "+40 vida al comenzar etapa",   max: 3, costs: [30, 70, 130] },
  { id: "weapon", icon: "volantin",  name: "Volantín de Bolsillo", desc: "Comienzas con Volantines (lv1)", max: 1, costs: [150] }
];

const Shop = {
  /* Carga progreso guardado */
  loadData() {
    const d = U.load("save", null);
    if (d && d.levels) return d;
    return { lucumi: 0, levels: {}, bestTime: 0, runs: 0, wins: 0 };
  },
  saveData(data) { U.save("save", data); },

  getLevel(data, id) { return (data.levels && data.levels[id]) || 0; },

  cost(item, level) {
    if (level >= item.max) return null;
    return item.costs[level];
  },

  applyAll(game) {
    const d = this.loadData();
    const p = game.player;
    p.maxHp = 100 + 20 * this.getLevel(d, "hp");
    p.hp = p.maxHp;
    p.stats.damageMult += 0.06 * this.getLevel(d, "dmg");
    p.stats.speedMult += 0.05 * this.getLevel(d, "spd");
    p.stats.xpMult += 0.08 * this.getLevel(d, "xp");
    p.stats.coinMult += 0.12 * this.getLevel(d, "coins");
    p.stats.armor += 1 * this.getLevel(d, "armor");
    p.stats.cooldownMult = Math.max(0.4, p.stats.cooldownMult - 0.05 * this.getLevel(d, "cdr"));
    p.stats.magnet *= 1 + 0.3 * this.getLevel(d, "magnet");
    p.stats.crit += 0.04 * this.getLevel(d, "crit");
    p.revives = this.getLevel(d, "revive");
    p.bonusStartHp = 40 * this.getLevel(d, "start");
    if (p.bonusStartHp) p.hp = Math.min(p.maxHp, p.hp + p.bonusStartHp);
    if (this.getLevel(d, "weapon") > 0) WeaponSystem.add("volantin", 1);
  },

  buy(data, item) {
    const lvl = this.getLevel(data, item.id);
    const cost = this.cost(item, lvl);
    if (cost === null || data.lucumi < cost) return false;
    data.lucumi -= cost;
    data.levels[item.id] = lvl + 1;
    this.saveData(data);
    return true;
  },

  render() {
    const data = this.loadData();
    document.getElementById("shop-coins").textContent = data.lucumi;
    const grid = document.getElementById("shop-grid");
    grid.innerHTML = "";
    for (const item of SHOP_ITEMS) {
      const lvl = this.getLevel(data, item.id);
      const cost = this.cost(item, lvl);
      const maxed = cost === null;
      const can = !maxed && data.lucumi >= cost;
      const div = document.createElement("div");
      div.className = "shop-item" + (maxed ? " maxed" : "");
      let pips = "";
      for (let i = 0; i < item.max; i++) pips += `<i class="${i < lvl ? "on" : ""}"></i>`;
      div.innerHTML = `
        <div class="si-icon">${iconEmoji(item.icon)}</div>
        <div class="si-name">${item.name}</div>
        <div class="si-desc">${item.desc}</div>
        <div class="si-pips">${pips}</div>
        <button class="btn ${can ? "btn-primary" : ""}" ${can ? "" : "disabled"}>
          ${maxed ? "MÁXIMO" : "🪙 " + cost}
        </button>`;
      const btn = div.querySelector("button");
      if (can) {
        btn.addEventListener("click", () => {
          if (this.buy(data, item)) {
            AudioSys.buy();
            this.render();
          } else {
            AudioSys.denied();
          }
        });
      }
      grid.appendChild(div);
    }
  }
};

/* pequeño mapa de iconos a emoji para la tienda */
function iconEmoji(icon) {
  const map = {
    cielo: "💗", acero: "⚔️", viento: "💨", estrellaP: "⭐", lucumi: "🪙",
    manta: "🧣", raya: "⚡", alcance: "🌀", suerte: "🍀", revive: "✨",
    heal: "🩹", volantin: "🪁"
  };
  return map[icon] || "🌀";
}
