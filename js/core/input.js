/* ============ Entrada: teclado + ratón ============ */
"use strict";

const Input = {
  keys: {},
  pressed: {},
  canvas: null,
  mouse: {
    x: 480, y: 270,     // coords lógicas del canvas (960x540)
    left: false,
    right: false,
    delta: 0             // acumulado de rueda (+sube / -baja) se consume por frame
  },

  init(canvas) {
    this.canvas = canvas || null;

    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      const k = e.key.toLowerCase();
      if (!this.keys[k]) this.pressed[k] = true;
      this.keys[k] = true;
    });
    window.addEventListener("keyup", (e) => { this.keys[e.key.toLowerCase()] = false; });
    window.addEventListener("blur", () => {
      this.keys = {};
      this.mouse.left = false;
      this.mouse.right = false;
    });

    if (this.canvas) {
      const cv = this.canvas;

      cv.addEventListener("mousemove", (e) => {
        const rect = cv.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        this.mouse.x = (e.clientX - rect.left) / rect.width * cv.width;
        this.mouse.y = (e.clientY - rect.top) / rect.height * cv.height;
      });

      cv.addEventListener("mousedown", (e) => {
        if (e.button === 0) this.mouse.left = true;
        if (e.button === 2) this.mouse.right = true;
        e.preventDefault();
      });
      window.addEventListener("mouseup", (e) => {
        if (e.button === 0) this.mouse.left = false;
        if (e.button === 2) this.mouse.right = false;
      });
      cv.addEventListener("contextmenu", (e) => e.preventDefault());

      cv.addEventListener("wheel", (e) => {
        e.preventDefault();
        // rueda hacia arriba = más hilo, hacia abajo = menos
        this.mouse.delta += e.deltaY < 0 ? 1 : -1;
      }, { passive: false });
    }
  },

  /* vector de movimiento WASD */
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
  consumeWheel() { const d = this.mouse.delta; this.mouse.delta = 0; return d; },
  endFrame() { this.pressed = {}; }
};
