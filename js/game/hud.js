/* ============ HUD y overlays (DOM) ============ */
"use strict";

const HUD = {
  el(id) { return document.getElementById(id); },

  show(id) { this.el(id).classList.remove("hidden"); },
  hide(id) { this.el(id).classList.add("hidden"); },
  hideAllOverlays() {
    ["menu", "help", "stage-intro", "levelup", "shop", "gameover", "victory", "pause"]
      .forEach(id => this.hide(id));
  },

  update(game) {
    const p = game.player;
    const hpFrac = U.clamp(p.hp / p.maxHp, 0, 1);
    this.el("hp-fill").style.width = (hpFrac * 100).toFixed(1) + "%";
    this.el("hp-text").textContent = `${Math.ceil(p.hp)} / ${p.maxHp}`;
    const xpFrac = U.clamp(p.xp / p.xpNext, 0, 1);
    this.el("xp-fill").style.width = (xpFrac * 100).toFixed(1) + "%";
    this.el("xp-text").textContent = `NIV ${p.level}`;
    this.el("timer").textContent = U.fmtTime(game.time);
    this.el("coin-text").textContent = p.coins;
    this.el("kill-text").textContent = p.kills;
    this.el("stage-name").textContent = game.stage ? game.stage.name : "";

    // boss
    if (game.boss && !game.boss.dead) {
      this.show("boss-bar");
      this.el("boss-name").textContent = game.boss.def.name;
      this.el("boss-fill").style.width = (U.clamp(game.boss.hp / game.boss.maxHp, 0, 1) * 100).toFixed(1) + "%";
    } else {
      this.hide("boss-bar");
    }

    // armas
    const strip = this.el("weapon-strip");
    const want = WeaponSystem.list.map(w => `${w.id}:${w.level}`).join(",");
    if (strip._sig !== want) {
      strip._sig = want;
      strip.innerHTML = "";
      for (const w of WeaponSystem.list) {
        const def = WEAPON_DEFS[w.id];
        const slot = document.createElement("div");
        slot.className = "wslot";
        const img = document.createElement("img");
        img.src = Assets.icon(def.icon).toDataURL();
        img.alt = def.name;
        slot.appendChild(img);
        const lv = document.createElement("span");
        lv.className = "wlvl";
        lv.textContent = "L" + w.level;
        slot.appendChild(lv);
        slot.title = def.name;
        strip.appendChild(slot);
      }
    }
  },

  renderLevelup(game) {
    const list = UpgradeSystem.rollCards(game);
    const box = this.el("levelup-cards");
    box.innerHTML = "";
    list.forEach((c, i) => {
      const div = document.createElement("div");
      div.className = "card" +
        (c.type === "heal" ? " card-heal" : "") +
        (c.type === "weaponNew" ? " card-weapon" : "");
      const lvlLabel = c.type === "weaponNew" ? "NUEVA" :
        (c.level > 0 ? `Nv ${c.level} → ${c.level + 1}` : "");
      div.innerHTML = `
        ${lvlLabel ? `<div class="card-lvl">${lvlLabel}</div>` : ""}
        <img class="card-icon" src="${Assets.icon(c.icon).toDataURL()}" alt="">
        <div class="card-name">${c.name}</div>
        <div class="card-desc">${c.desc}</div>`;
      div.addEventListener("click", () => {
        UpgradeSystem.apply(game, c);
        AudioSys.ui();
        game.onCardChosen(i);
      });
      box.appendChild(div);
    });
  },

  renderStageIntro(stage) {
    this.el("intro-kicker").textContent = stage.kicker;
    this.el("intro-title").textContent = stage.name;
    this.el("intro-sub").textContent = `¡Sobrevive y derrota al jefe: ${BOSS_DEFS[stage.boss].name}!`;
  },

  renderGameOver(game) {
    const p = game.player;
    this.el("go-stats").innerHTML = `
      Etapa alcanzada: <b>${game.stageIndex + 1} — ${game.stage ? game.stage.name : "—"}</b><br>
      Nivel: <b>${p.level}</b> · Abatidos: <b>${p.kills}</b><br>
      Lucumí reunido: <b>🪙 ${p.coins}</b><br>
      Tiempo: <b>${U.fmtTime(game.time)}</b>`;
    const d = Shop.loadData();
    d.lucumi += p.coins;
    d.runs = (d.runs || 0) + 1;
    Shop.saveData(d);
  },

  renderVictory(game) {
    const p = game.player;
    this.el("vic-stats").innerHTML = `
      Nivel final: <b>${p.level}</b> · Abatidos: <b>${p.kills}</b><br>
      Lucumí reunido: <b>🪙 ${p.coins}</b><br>
      Tiempo total: <b>${U.fmtTime(game.time)}</b>`;
    const d = Shop.loadData();
    d.lucumi += p.coins;
    d.wins = (d.wins || 0) + 1;
    d.runs = (d.runs || 0) + 1;
    Shop.saveData(d);
  },

  updateMenuCoins() {
    const d = Shop.loadData();
    this.el("menu-coins").textContent = d.lucumi;
  }
};
