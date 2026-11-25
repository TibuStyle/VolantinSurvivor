/* ============ Entrada (teclado) ============ */
"use strict";

const Input = {
  keys: {},
  pressed: {},
  init() {
    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      const k = e.key.toLowerCase();
      if (!this.keys[k]) this.pressed[k] = true;
      this.keys[k] = true;
    });
    window.addEventListener("keyup", (e) => { this.keys[e.key.toLowerCase()] = false; });
    window.addEventListener("blur", () => { this.keys = {}; });
  },
  // vector de movimiento
  axis() {
    let x = 0, y = 0;
    if (this.keys["a"] || this.keys["arrowleft"]) x -= 1;
    if (this.keys["d"] || this.keys["arrowright"]) x += 1;
    if (this.keys["w"] || this.keys["arrowup"]) y -= 1;
    if (this.keys["s"] || this.keys["arrowdown"]) y += 1;
    if (x && y) { const inv = 1 / Math.SQRT2; x *= inv; y *= inv; }
    return { x, y };
  },
  wasPressed(k) { return !!this.pressed[k]; },
  endFrame() { this.pressed = {}; }
};
