/* ============ Assets: sprites pixel-art generados por código ============ */
"use strict";

const Assets = {
  sprites: {},
  icons: {},

  make(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const x = c.getContext("2d");
    x.imageSmoothingEnabled = false;
    draw(x, w, h);
    return c;
  },

  px(x, color, a, b, c2, d) { x.fillStyle = color; x.fillRect(a, b, c2, d); },

  /* ojo simple (blanco + pupila) */
  eye(x, ex, ey, size = 3, look = 0) {
    x.fillStyle = "#fff"; x.fillRect(ex, ey, size, size);
    x.fillStyle = "#111";
    x.fillRect(ex + (look > 0 ? size - 2 : 0) + (look < 0 ? 0 : 1), ey + 1, 2, 2);
  },
  angryBrows(x, ex, ey, w) {
    x.fillStyle = "#1a1b1e";
    x.fillRect(ex, ey, w, 1);
    x.fillRect(ex + w, ey + 1, 1, 1);
    x.fillRect(ex - 1 + 0, ey + 1, 1, 1);
  },

  init() {
    const S = this.sprites, I = this.icons;
    const R = "#e03131", RD = "#c92a2a", B = "#1c71d8", BD = "#1864ab",
          W = "#f8f9fa", K = "#1a1b1e", G = "#ffd43b", GD = "#e8a317",
          CR = "#fff3bf", BR = "#a0522d", BR2 = "#7b3f1d", GRN = "#2f9e44";

    /* ---------- JUGADOR: volantín chileno ---------- */
    S.player = this.make(30, 36, (x) => {
      // cola (bambalinas) con moños
      x.fillStyle = R; x.fillRect(13, 24, 2, 6);
      x.fillStyle = B; x.fillRect(13, 30, 2, 3);
      x.fillStyle = G; x.fillRect(11, 28, 6, 2);
      x.fillStyle = R; x.fillRect(11, 33, 6, 2);
      // cuerda inferior (hilo)
      x.fillStyle = "#d0bfff"; x.fillRect(14, 35, 1, 1);
      // diamante
      // mitad superior: cuadro azul con estrella + blanco
      x.fillStyle = K;
      x.beginPath(); x.moveTo(15, 0); x.lineTo(29, 13); x.lineTo(15, 26); x.lineTo(1, 13); x.closePath(); x.fill();
      // interior
      x.fillStyle = W;
      x.beginPath(); x.moveTo(15, 2); x.lineTo(27, 13); x.lineTo(15, 24); x.lineTo(3, 13); x.closePath(); x.fill();
      // franja roja inferior (bandera)
      x.fillStyle = R;
      x.beginPath(); x.moveTo(3, 14); x.lineTo(27, 14); x.lineTo(15, 24); x.closePath(); x.fill();
      // cantón azul arriba-izquierda
      x.fillStyle = B; x.fillRect(5, 6, 9, 8);
      // estrella blanca (5 puntas simplificada)
      x.fillStyle = W;
      x.fillRect(9, 7, 1, 5); x.fillRect(7, 9, 5, 1);
      x.fillRect(8, 8, 3, 3);
      x.fillRect(6, 8, 1, 1); x.fillRect(12, 8, 1, 1);
      x.fillRect(7, 12, 1, 1); x.fillRect(11, 12, 1, 1);
      // brillo
      x.fillStyle = "rgba(255,255,255,.5)";
      x.fillRect(16, 4, 1, 6);
      // cara
      this.eye(x, 17, 14, 3, 1);
      this.eye(x, 21, 14, 3, 1);
      x.fillStyle = K; x.fillRect(18, 18, 4, 1); // sonrisa
      // borde moño superior
      x.fillStyle = G; x.fillRect(14, 0, 3, 2);
    });

    /* ---------- ENEMIGOS ---------- */
    S.empanada = this.make(22, 18, (x) => {
      // masa dorada media luna
      x.fillStyle = K;
      x.beginPath(); x.arc(11, 12, 10, Math.PI, 0); x.fill();
      x.fillStyle = "#f4b860";
      x.beginPath(); x.arc(11, 12, 8.5, Math.PI, 0); x.fill();
      // base
      x.fillStyle = "#e09b3d"; x.fillRect(3, 11, 16, 4);
      x.fillStyle = K; x.fillRect(3, 15, 16, 1);
      // repulgue
      x.fillStyle = "#c9842f";
      for (let i = 0; i < 5; i++) x.fillRect(4 + i * 3, 11, 2, 2);
      // cara
      this.eye(x, 7, 7, 3, 0); this.eye(x, 13, 7, 3, 0);
      this.angryBrows(x, 7, 5, 4); this.angryBrows(x, 13, 5, 4);
      x.fillStyle = K; x.fillRect(9, 11, 5, 1);
      x.fillStyle = "#fff"; x.fillRect(9, 11, 1, 1); // diente
    });

    S.sopaipilla = this.make(16, 13, (x) => {
      x.fillStyle = K; x.fillRect(1, 3, 14, 8); x.fillRect(3, 1, 10, 12);
      x.fillStyle = "#f0c14b"; x.fillRect(2, 4, 12, 6); x.fillRect(4, 2, 8, 10);
      x.fillStyle = "#d9a521"; x.fillRect(3, 8, 10, 2);
      this.eye(x, 5, 4, 2, 0); this.eye(x, 10, 4, 2, 0);
      x.fillStyle = K; x.fillRect(6, 8, 4, 1);
    });

    S.choripan = this.make(28, 14, (x) => {
      // pan
      x.fillStyle = K; x.fillRect(1, 3, 26, 9);
      x.fillStyle = "#e8a33d"; x.fillRect(2, 4, 24, 7);
      x.fillStyle = "#f4c46a"; x.fillRect(2, 4, 24, 2);
      // salchicha
      x.fillStyle = "#b5451b"; x.fillRect(3, 5, 22, 4);
      x.fillStyle = "#d4622a"; x.fillRect(3, 5, 22, 1);
      // mostaza
      x.fillStyle = G;
      for (let i = 0; i < 6; i++) x.fillRect(4 + i * 4, 6 + (i % 2), 2, 1);
      // cara (en la salchicha)
      this.eye(x, 8, 5, 2, 0); this.eye(x, 17, 5, 2, 0);
      x.fillStyle = K; x.fillRect(12, 8, 5, 1);
    });

    S.luchador = this.make(22, 26, (x) => {
      // piernas
      x.fillStyle = K; x.fillRect(4, 20, 5, 6); x.fillRect(13, 20, 5, 6);
      x.fillStyle = "#2b2d42"; x.fillRect(5, 20, 3, 5); x.fillRect(14, 20, 3, 5);
      // cuerpo (malla)
      x.fillStyle = K; x.fillRect(3, 10, 16, 11);
      x.fillStyle = "#c92a2a"; x.fillRect(4, 11, 14, 9);
      x.fillStyle = "#8a1010";
      for (let i = 0; i < 4; i++) x.fillRect(5 + i * 3, 12, 1, 7);
      // brazos
      x.fillStyle = "#f1a57a"; x.fillRect(0, 11, 4, 4); x.fillRect(18, 11, 4, 4);
      // máscara
      x.fillStyle = K; x.fillRect(4, 1, 14, 10);
      x.fillStyle = "#1971c2"; x.fillRect(5, 2, 12, 8);
      x.fillStyle = "#74c0fc"; x.fillRect(5, 2, 12, 2);
      // ojos máscara
      x.fillStyle = W; x.fillRect(7, 5, 3, 2); x.fillRect(13, 5, 3, 2);
      x.fillStyle = K; x.fillRect(8, 5, 1, 2); x.fillRect(14, 5, 1, 2);
      // boquilla
      x.fillStyle = "#ffd43b"; x.fillRect(8, 8, 7, 1);
      // cinturón
      x.fillStyle = G; x.fillRect(4, 18, 14, 2);
    });

    S.piquero = this.make(24, 18, (x) => {
      // alas
      x.fillStyle = K;
      x.beginPath(); x.moveTo(8, 8); x.lineTo(0, 2); x.lineTo(2, 10); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(16, 8); x.lineTo(24, 2); x.lineTo(22, 10); x.closePath(); x.fill();
      x.fillStyle = "#6f4e37";
      x.beginPath(); x.moveTo(9, 9); x.lineTo(2, 4); x.lineTo(4, 10); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(15, 9); x.lineTo(22, 4); x.lineTo(20, 10); x.closePath(); x.fill();
      // cuerpo
      x.fillStyle = K; x.beginPath(); x.ellipse(12, 10, 7, 6, 0, 0, 7); x.fill();
      x.fillStyle = "#8b6b4a"; x.beginPath(); x.ellipse(12, 10, 6, 5, 0, 0, 7); x.fill();
      x.fillStyle = "#e9ecef"; x.beginPath(); x.ellipse(12, 12, 4, 3, 0, 0, 7); x.fill();
      // cabeza
      x.fillStyle = K; x.beginPath(); x.arc(17, 6, 4, 0, 7); x.fill();
      x.fillStyle = "#a0785a"; x.beginPath(); x.arc(17, 6, 3, 0, 7); x.fill();
      // pico
      x.fillStyle = "#f08c00";
      x.beginPath(); x.moveTo(20, 6); x.lineTo(24, 7); x.lineTo(20, 8); x.closePath(); x.fill();
      this.eye(x, 17, 5, 2, 1);
    });

    S.guanaco = this.make(26, 26, (x) => {
      // patas
      x.fillStyle = K; x.fillRect(5, 18, 4, 8); x.fillRect(16, 18, 4, 8);
      x.fillStyle = "#a0785a"; x.fillRect(6, 18, 2, 7); x.fillRect(17, 18, 2, 7);
      // cuerpo
      x.fillStyle = K; x.fillRect(3, 9, 20, 11);
      x.fillStyle = "#b5896a"; x.fillRect(4, 10, 18, 9);
      x.fillStyle = "#c9a585"; x.fillRect(4, 10, 18, 3);
      // cuello + cabeza
      x.fillStyle = K; x.fillRect(17, 2, 6, 9);
      x.fillStyle = "#b5896a"; x.fillRect(18, 3, 4, 8);
      x.fillStyle = K; x.fillRect(18, 1, 8, 6);
      x.fillStyle = "#b5896a"; x.fillRect(19, 2, 6, 4);
      // orejas
      x.fillStyle = K; x.fillRect(18, 0, 2, 2); x.fillRect(23, 0, 2, 2);
      // cara
      this.eye(x, 21, 3, 2, 1);
      x.fillStyle = K; x.fillRect(24, 5, 2, 1);
      // cola
      x.fillStyle = K; x.fillRect(2, 9, 2, 4);
      x.fillStyle = "#d9c1a8"; x.fillRect(2, 10, 1, 2);
    });

    S.diablito = this.make(20, 22, (x) => {
      // cuernos
      x.fillStyle = "#1a1b1e";
      x.beginPath(); x.moveTo(4, 6); x.lineTo(2, 0); x.lineTo(7, 4); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(16, 6); x.lineTo(18, 0); x.lineTo(13, 4); x.closePath(); x.fill();
      x.fillStyle = "#ffd43b";
      x.beginPath(); x.moveTo(4, 5); x.lineTo(3, 1); x.lineTo(6, 4); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(16, 5); x.lineTo(17, 1); x.lineTo(14, 4); x.closePath(); x.fill();
      // cuerpo
      x.fillStyle = K; x.beginPath(); x.arc(10, 11, 8, 0, 7); x.fill();
      x.fillStyle = "#e03131"; x.beginPath(); x.arc(10, 11, 7, 0, 7); x.fill();
      // máscara de diablito (carnaval)
      x.fillStyle = "#ffd43b"; x.fillRect(3, 8, 14, 5);
      x.fillStyle = "#1a1b1e"; x.fillRect(4, 9, 4, 2); x.fillRect(12, 9, 4, 2);
      x.fillStyle = "#e03131"; x.fillRect(5, 9, 2, 2); x.fillRect(13, 9, 2, 2);
      // sonrisa
      x.fillStyle = K; x.fillRect(6, 15, 8, 2);
      x.fillStyle = W; x.fillRect(7, 15, 2, 1); x.fillRect(11, 15, 2, 1);
      // capa
      x.fillStyle = "#7048e8"; x.fillRect(3, 16, 14, 4);
      x.fillStyle = "#5f3dc4"; x.fillRect(3, 19, 14, 1);
    });

    S.cochayuyo = this.make(24, 26, (x) => {
      // brazos de alga
      x.fillStyle = K;
      x.fillRect(0, 8, 5, 4); x.fillRect(19, 8, 5, 4);
      x.fillRect(1, 4, 3, 6); x.fillRect(20, 4, 3, 6);
      x.fillStyle = "#495057";
      x.fillRect(1, 9, 3, 2); x.fillRect(20, 9, 3, 2);
      // cuerpo marrón irregular
      x.fillStyle = K; x.fillRect(4, 4, 16, 20);
      x.fillStyle = "#6c584c"; x.fillRect(5, 5, 14, 18);
      x.fillStyle = "#7d6a5c"; x.fillRect(5, 5, 14, 4);
      // manchas
      x.fillStyle = "#57453b"; x.fillRect(7, 12, 4, 3); x.fillRect(14, 16, 4, 3);
      // ojos
      this.eye(x, 8, 9, 3, 0); this.eye(x, 14, 9, 3, 0);
      this.angryBrows(x, 8, 7, 4); this.angryBrows(x, 14, 7, 4);
      // boca
      x.fillStyle = K; x.fillRect(8, 16, 9, 2);
      x.fillStyle = "#d8f5a2"; x.fillRect(9, 16, 2, 1); x.fillRect(13, 16, 2, 1);
      // pies
      x.fillStyle = K; x.fillRect(5, 23, 5, 3); x.fillRect(14, 23, 5, 3);
    });

    /* sombra volante (minions etapa 3) */
    S.sombra = this.make(20, 22, (x) => {
      x.fillStyle = "#12b886"; // placeholder no usado
      x.fillStyle = "#343a40";
      x.beginPath(); x.moveTo(10, 0); x.lineTo(19, 10); x.lineTo(10, 20); x.lineTo(1, 10); x.closePath(); x.fill();
      x.fillStyle = "#212529";
      x.beginPath(); x.moveTo(10, 2); x.lineTo(17, 10); x.lineTo(10, 18); x.lineTo(3, 10); x.closePath(); x.fill();
      x.fillStyle = "#f03e3e"; x.fillRect(7, 7, 2, 3); x.fillRect(12, 7, 2, 3);
      x.fillStyle = "#ffd43b"; x.fillRect(9, 12, 3, 1);
      // hilo roto
      x.fillStyle = "#f03e3e"; x.fillRect(9, 20, 1, 2); x.fillRect(12, 21, 1, 1);
    });

    /* ---------- JEFES ---------- */
    S.castillo = this.make(72, 96, (x) => {
      // base de cajas
      const boxCols = ["#c92a2a", "#1971c2", "#ffd43b", "#2f9e44"];
      for (let row = 0; row < 5; row++) {
        const w = 64 - row * 10;
        const ox = (72 - w) / 2;
        const y = 88 - row * 16;
        x.fillStyle = K; x.fillRect(ox - 1, y - 1, w + 2, 15);
        for (let i = 0; i < Math.floor(w / 16); i++) {
          x.fillStyle = boxCols[(row + i) % 4];
          x.fillRect(ox + i * 16 + 1, y, 14, 13);
          x.fillStyle = "rgba(0,0,0,.25)"; x.fillRect(ox + i * 16 + 1, y + 11, 14, 2);
          // estrella decorativa
          x.fillStyle = "#fff"; x.fillRect(ox + i * 16 + 7, y + 4, 2, 5);
          x.fillRect(ox + i * 16 + 5, y + 6, 6, 1);
        }
      }
      // castillo superior (torre)
      x.fillStyle = K; x.fillRect(26, 14, 20, 30);
      x.fillStyle = "#8b0000"; x.fillRect(27, 15, 18, 28);
      x.fillStyle = "#a51818"; x.fillRect(27, 15, 18, 6);
      // mecha
      x.fillStyle = "#57453b"; x.fillRect(35, 4, 3, 12);
      // chispa
      x.fillStyle = "#ffd43b"; x.fillRect(34, 0, 5, 5);
      x.fillStyle = "#fff"; x.fillRect(35, 1, 2, 2);
      // cara
      this.eye(x, 31, 24, 4, 0); this.eye(x, 41, 24, 4, 0);
      this.angryBrows(x, 31, 21, 5); this.angryBrows(x, 41, 21, 5);
      x.fillStyle = K; x.fillRect(33, 33, 10, 3);
      x.fillStyle = W; x.fillRect(34, 33, 2, 2); x.fillRect(40, 33, 2, 2);
      // bordes de fuego
      x.fillStyle = "#ff922b";
      x.fillRect(24, 44, 4, 4); x.fillRect(44, 44, 4, 4);
      x.fillRect(20, 60, 4, 4); x.fillRect(48, 60, 4, 4);
    });

    S.lagarto = this.make(100, 64, (x) => {
      // cola
      x.fillStyle = K;
      x.beginPath(); x.moveTo(10, 34); x.lineTo(0, 26); x.lineTo(0, 40); x.closePath(); x.fill();
      x.fillStyle = "#2b8a3e";
      x.beginPath(); x.moveTo(12, 34); x.lineTo(2, 28); x.lineTo(2, 38); x.closePath(); x.fill();
      // cuerpo
      x.fillStyle = K; x.beginPath(); x.ellipse(52, 36, 38, 20, 0, 0, 7); x.fill();
      x.fillStyle = "#2f9e44"; x.beginPath(); x.ellipse(52, 36, 36, 18, 0, 0, 7); x.fill();
      x.fillStyle = "#40c057"; x.beginPath(); x.ellipse(52, 30, 32, 10, 0, 0, 7); x.fill();
      // cresta
      x.fillStyle = "#1864ab";
      for (let i = 0; i < 6; i++) {
        x.beginPath(); x.moveTo(30 + i * 9, 22); x.lineTo(34 + i * 9, 12); x.lineTo(38 + i * 9, 22); x.closePath(); x.fill();
      }
      // patas
      x.fillStyle = K; x.fillRect(30, 50, 10, 12); x.fillRect(66, 50, 10, 12);
      x.fillStyle = "#2b8a3e"; x.fillRect(31, 50, 8, 11); x.fillRect(67, 50, 8, 11);
      x.fillStyle = "#ffd43b"; x.fillRect(31, 59, 8, 2); x.fillRect(67, 59, 8, 2);
      // cabeza
      x.fillStyle = K; x.beginPath(); x.ellipse(84, 30, 16, 14, 0, 0, 7); x.fill();
      x.fillStyle = "#2f9e44"; x.beginPath(); x.ellipse(84, 30, 14, 12, 0, 0, 7); x.fill();
      // hocico
      x.fillStyle = "#40c057"; x.fillRect(88, 32, 12, 8);
      x.fillStyle = K; x.fillRect(96, 34, 2, 2); // fosa nasal
      // ojo
      x.fillStyle = "#ffd43b"; x.fillRect(80, 24, 7, 6);
      x.fillStyle = "#1a1b1e"; x.fillRect(83, 25, 3, 5);
      x.fillStyle = "#fff"; x.fillRect(83, 25, 1, 2);
      // ceja
      x.fillStyle = K; x.fillRect(79, 22, 9, 2);
      // boca con dientes
      x.fillStyle = K; x.fillRect(88, 38, 12, 3);
      x.fillStyle = W;
      x.fillRect(89, 38, 2, 2); x.fillRect(93, 38, 2, 2); x.fillRect(97, 38, 2, 2);
      // manchas bandera
      x.fillStyle = "#e03131"; x.fillRect(40, 38, 8, 5); x.fillRect(56, 42, 8, 5);
      x.fillStyle = "#f8f9fa"; x.fillRect(48, 40, 8, 5);
    });

    S.volantinOscuro = this.make(90, 96, (x) => {
      // hilos colgando
      x.fillStyle = "#f03e3e";
      x.fillRect(20, 70, 2, 24); x.fillRect(68, 70, 2, 24);
      x.fillRect(44, 74, 2, 22);
      // bambalinas
      x.fillStyle = "#495057"; x.fillRect(17, 84, 8, 3); x.fillRect(65, 84, 8, 3);
      // diamante grande oscuro
      x.fillStyle = "#000";
      x.beginPath(); x.moveTo(45, 0); x.lineTo(88, 46); x.lineTo(45, 92); x.lineTo(2, 46); x.closePath(); x.fill();
      x.fillStyle = "#212529";
      x.beginPath(); x.moveTo(45, 4); x.lineTo(84, 46); x.lineTo(45, 88); x.lineTo(6, 46); x.closePath(); x.fill();
      // franjas rojas sombrías
      x.fillStyle = "#870000";
      x.beginPath(); x.moveTo(8, 50); x.lineTo(82, 50); x.lineTo(45, 88); x.closePath(); x.fill();
      // cantón con estrella malvada (estrella invertida)
      x.fillStyle = "#495057"; x.fillRect(14, 18, 24, 24);
      x.fillStyle = "#f03e3e";
      x.fillRect(24, 22, 4, 16); x.fillRect(18, 27, 16, 4);
      x.fillRect(20, 24, 12, 3);
      x.fillRect(19, 36, 5, 3); x.fillRect(28, 36, 5, 3);
      // ojos malvados
      x.fillStyle = "#f03e3e"; x.fillRect(48, 34, 12, 7); x.fillRect(64, 34, 12, 7);
      x.fillStyle = "#ffd43b"; x.fillRect(50, 36, 4, 5); x.fillRect(66, 36, 4, 5);
      x.fillStyle = "#000"; x.fillRect(52, 37, 2, 4); x.fillRect(68, 37, 2, 4);
      // cejas
      x.fillStyle = "#000";
      x.fillRect(47, 31, 14, 3); x.fillRect(63, 31, 14, 3);
      x.fillRect(47, 31, 3, 5); x.fillRect(74, 31, 3, 5);
      // sonrisa malvada
      x.fillStyle = "#000"; x.fillRect(52, 54, 26, 6);
      x.fillStyle = "#f8f9fa";
      x.fillRect(54, 54, 4, 4); x.fillRect(62, 54, 4, 4); x.fillRect(70, 54, 4, 4);
      // brillo fantasmal
      x.fillStyle = "rgba(134,196,253,.15)";
      x.beginPath(); x.moveTo(45, 6); x.lineTo(70, 40); x.lineTo(45, 40); x.closePath(); x.fill();
    });

    /* mini jefe: monito de la carreta */
    S.carreta = this.make(56, 56, (x) => {
      // ruedas
      x.fillStyle = K; x.beginPath(); x.arc(14, 46, 9, 0, 7); x.fill();
      x.beginPath(); x.arc(42, 46, 9, 0, 7); x.fill();
      x.fillStyle = "#8b5e34"; x.beginPath(); x.arc(14, 46, 7, 0, 7); x.fill();
      x.beginPath(); x.arc(42, 46, 7, 0, 7); x.fill();
      x.fillStyle = K; x.fillRect(13, 40, 2, 12); x.fillRect(8, 45, 12, 2);
      x.fillRect(41, 40, 2, 12); x.fillRect(36, 45, 12, 2);
      // carroza
      x.fillStyle = K; x.fillRect(4, 24, 48, 18);
      x.fillStyle = "#c92a2a"; x.fillRect(5, 25, 46, 16);
      x.fillStyle = "#ffd43b"; x.fillRect(5, 25, 46, 4);
      x.fillStyle = "#1971c2"; x.fillRect(5, 37, 46, 4);
      // estrella
      x.fillStyle = "#fff"; x.fillRect(27, 30, 3, 7); x.fillRect(24, 33, 9, 2);
      // monito arriba
      x.fillStyle = K; x.beginPath(); x.arc(28, 14, 11, 0, 7); x.fill();
      x.fillStyle = "#f1a57a"; x.beginPath(); x.arc(28, 14, 10, 0, 7); x.fill();
      // sombrero huaso
      x.fillStyle = K; x.fillRect(14, 6, 28, 4); x.fillRect(20, 1, 16, 6);
      x.fillStyle = "#57453b"; x.fillRect(15, 7, 26, 2); x.fillRect(21, 2, 14, 4);
      x.fillStyle = "#c92a2a"; x.fillRect(21, 5, 14, 1);
      // cara
      this.eye(x, 23, 13, 3, 0); this.eye(x, 32, 13, 3, 0);
      this.angryBrows(x, 23, 11, 4); this.angryBrows(x, 32, 11, 4);
      x.fillStyle = K; x.fillRect(26, 18, 7, 1);
    });

    /* ---------- PROYECTILES ---------- */
    S.hiloSeg = this.make(10, 10, (x) => {
      x.fillStyle = "rgba(255,255,255,.35)"; x.fillRect(2, 2, 6, 6);
      x.fillStyle = "#e5dbff"; x.fillRect(3, 3, 4, 4);
      x.fillStyle = "#fff"; x.fillRect(4, 4, 2, 2);
    });
    S.rocket = this.make(14, 22, (x) => {
      x.fillStyle = K; x.fillRect(4, 0, 6, 16);
      x.fillStyle = "#f8f9fa"; x.fillRect(5, 1, 4, 12);
      x.fillStyle = "#e03131"; x.fillRect(5, 1, 4, 4);
      x.fillStyle = "#1971c2"; x.fillRect(5, 9, 4, 4);
      // fuego
      x.fillStyle = "#ff922b"; x.fillRect(5, 16, 4, 4);
      x.fillStyle = "#ffd43b"; x.fillRect(6, 17, 2, 3);
      // aletas
      x.fillStyle = "#e03131"; x.fillRect(2, 12, 3, 5); x.fillRect(9, 12, 3, 5);
    });
    S.star = this.make(16, 16, (x) => {
      x.fillStyle = "#ffd43b";
      x.fillRect(6, 0, 4, 16); x.fillRect(0, 6, 16, 4);
      x.fillRect(2, 2, 4, 4); x.fillRect(10, 2, 4, 4);
      x.fillRect(2, 10, 4, 4); x.fillRect(10, 10, 4, 4);
      x.fillStyle = "#fff8e1"; x.fillRect(6, 6, 4, 4);
    });
    S.papel = this.make(12, 12, (x) => {
      x.fillStyle = "#f03e3e"; x.fillRect(1, 2, 10, 5);
      x.fillStyle = "#ffd43b"; x.fillRect(1, 7, 10, 3);
      x.fillStyle = "#1971c2"; x.fillRect(3, 4, 3, 2);
      x.fillStyle = "#fff"; x.fillRect(8, 4, 2, 2);
    });
    S.choripanProj = this.make(18, 12, (x) => {
      x.fillStyle = K; x.fillRect(1, 2, 16, 8);
      x.fillStyle = "#b5451b"; x.fillRect(2, 3, 14, 6);
      x.fillStyle = "#e8a33d"; x.fillRect(2, 2, 14, 2);
      x.fillStyle = G; x.fillRect(4, 5, 10, 2);
      x.fillStyle = "#fff"; x.fillRect(6, 5, 2, 1);
    });
    S.mote = this.make(16, 16, (x) => {
      x.fillStyle = K; x.beginPath(); x.arc(8, 8, 7, 0, 7); x.fill();
      x.fillStyle = "#7c4a03"; x.beginPath(); x.arc(8, 8, 6, 0, 7); x.fill();
      // huesillo
      x.fillStyle = "#c9842f"; x.beginPath(); x.arc(8, 7, 3, 0, 7); x.fill();
      x.fillStyle = "#57453b"; x.fillRect(7, 6, 2, 3);
      // canela
      x.fillStyle = "#f8f9fa"; x.fillRect(5, 3, 1, 1); x.fillRect(10, 4, 1, 1); x.fillRect(8, 11, 1, 1);
    });
    S.banderaWave = this.make(40, 28, (x) => {
      x.fillStyle = "rgba(248,249,250,.85)"; x.fillRect(2, 4, 36, 9);
      x.fillStyle = "rgba(224,49,49,.9)"; x.fillRect(2, 14, 36, 9);
      x.fillStyle = "rgba(28,113,216,.95)"; x.fillRect(2, 4, 11, 9);
      x.fillStyle = "#fff"; x.fillRect(5, 6, 3, 5); x.fillRect(4, 8, 5, 1);
      x.fillStyle = "rgba(255,255,255,.4)"; x.fillRect(6, 4, 3, 24);
      x.fillStyle = "rgba(255,255,255,.25)"; x.fillRect(26, 4, 3, 24);
    });
    S.dancer = this.make(24, 30, (x) => {
      // sombrero
      x.fillStyle = K; x.fillRect(3, 2, 18, 4); x.fillRect(7, 0, 10, 3);
      x.fillStyle = "#57453b"; x.fillRect(4, 3, 16, 2); x.fillRect(8, 1, 8, 2);
      // cabeza
      x.fillStyle = K; x.beginPath(); x.arc(12, 10, 6, 0, 7); x.fill();
      x.fillStyle = "#e8b88a"; x.beginPath(); x.arc(12, 10, 5, 0, 7); x.fill();
      x.fillStyle = K; x.fillRect(9, 9, 2, 2); x.fillRect(14, 9, 2, 2);
      x.fillStyle = K; x.fillRect(11, 13, 4, 1);
      // cuerpo chaleco
      x.fillStyle = K; x.fillRect(5, 16, 14, 8);
      x.fillStyle = "#1864ab"; x.fillRect(6, 17, 12, 7);
      x.fillStyle = "#ffd43b"; x.fillRect(11, 17, 2, 7);
      // faldón
      x.fillStyle = "#c92a2a"; x.fillRect(5, 24, 14, 5);
      x.fillStyle = "#f8f9fa"; x.fillRect(5, 26, 14, 1);
      // brazos
      x.fillStyle = "#e8b88a"; x.fillRect(1, 17, 5, 3); x.fillRect(18, 15, 5, 3);
    });
    S.mustard = this.make(10, 10, (x) => {
      x.fillStyle = "#ffd43b"; x.beginPath(); x.arc(5, 5, 4, 0, 7); x.fill();
      x.fillStyle = "#fff"; x.fillRect(4, 3, 2, 2);
    });

    /* ---------- RECOLECTABLES ---------- */
    S.xp1 = this.make(10, 10, (x) => {
      x.fillStyle = "#4dabf7"; x.fillRect(3, 1, 4, 8); x.fillRect(1, 3, 8, 4);
      x.fillStyle = "#a5d8ff"; x.fillRect(4, 3, 2, 4); x.fillRect(3, 4, 4, 2);
    });
    S.xp2 = this.make(14, 14, (x) => {
      x.fillStyle = "#1971c2"; x.fillRect(5, 1, 4, 12); x.fillRect(1, 5, 12, 4);
      x.fillRect(3, 3, 8, 2); x.fillRect(3, 9, 8, 2);
      x.fillStyle = "#74c0fc"; x.fillRect(5, 5, 4, 4);
      x.fillStyle = "#e7f5ff"; x.fillRect(6, 6, 2, 2);
    });
    S.xp3 = this.make(18, 18, (x) => {
      x.fillStyle = "#ffd43b";
      x.fillRect(7, 1, 4, 16); x.fillRect(1, 7, 16, 4);
      x.fillRect(3, 3, 4, 4); x.fillRect(11, 3, 4, 4);
      x.fillRect(3, 11, 4, 4); x.fillRect(11, 11, 4, 4);
      x.fillStyle = "#fff8e1"; x.fillRect(7, 7, 4, 4);
    });
    S.coin = this.make(14, 14, (x) => {
      x.fillStyle = "#5c3b00"; x.beginPath(); x.arc(7, 7, 6, 0, 7); x.fill();
      x.fillStyle = "#ffd43b"; x.beginPath(); x.arc(7, 7, 5, 0, 7); x.fill();
      x.fillStyle = "#fff"; x.fillRect(6, 4, 2, 6); x.fillRect(4, 6, 6, 2);
      x.fillStyle = "#ffe8a3"; x.fillRect(4, 3, 4, 1);
    });
    S.heart = this.make(16, 14, (x) => {
      x.fillStyle = "#c92a2a";
      x.fillRect(2, 3, 5, 4); x.fillRect(9, 3, 5, 4);
      x.fillRect(3, 2, 3, 2); x.fillRect(10, 2, 3, 2);
      x.fillRect(3, 7, 10, 3); x.fillRect(5, 10, 6, 2); x.fillRect(7, 12, 2, 1);
      x.fillStyle = "#ff8787"; x.fillRect(4, 3, 2, 2);
    });

    /* ---------- PROPS DEL ESCENARIO ---------- */
    S.flagPole = this.make(28, 56, (x) => {
      x.fillStyle = "#8b5e34"; x.fillRect(13, 6, 3, 50);
      x.fillStyle = "#5c3b00"; x.fillRect(13, 6, 1, 50);
      // bandera
      x.fillStyle = K; x.fillRect(16, 6, 20, 16);
      x.fillStyle = "#f8f9fa"; x.fillRect(17, 7, 18, 6);
      x.fillStyle = "#e03131"; x.fillRect(17, 13, 18, 8);
      x.fillStyle = "#1971c2"; x.fillRect(17, 7, 8, 6);
      x.fillStyle = "#fff"; x.fillRect(19, 8, 3, 4); x.fillRect(18, 9, 5, 2);
      x.fillStyle = "#ffd43b"; x.beginPath(); x.arc(14, 5, 3, 0, 7); x.fill();
    });
    S.table = this.make(56, 34, (x) => {
      // mantel
      x.fillStyle = K; x.fillRect(2, 8, 52, 22);
      x.fillStyle = "#f8f9fa"; x.fillRect(3, 9, 50, 20);
      x.fillStyle = "#e03131";
      for (let i = 0; i < 5; i++) x.fillRect(3 + i * 10, 9, 5, 20);
      // patas
      x.fillStyle = "#8b5e34"; x.fillRect(5, 28, 4, 6); x.fillRect(47, 28, 4, 6);
      // comida
      x.fillStyle = "#f4b860"; x.beginPath(); x.arc(16, 14, 6, Math.PI, 0); x.fill();
      x.fillStyle = "#b5451b"; x.fillRect(30, 11, 16, 5);
      x.fillStyle = "#ffd43b"; x.fillRect(31, 12, 14, 1);
      x.fillStyle = "#7c4a03"; x.beginPath(); x.arc(48, 15, 5, 0, 7); x.fill();
      x.fillStyle = "#c9842f"; x.beginPath(); x.arc(48, 14, 3, 0, 7); x.fill();
    });
    S.tree = this.make(36, 48, (x) => {
      x.fillStyle = "#5c3b00"; x.fillRect(15, 30, 7, 18);
      x.fillStyle = "#8b5e34"; x.fillRect(16, 30, 4, 17);
      x.fillStyle = "#2b8a3e";
      x.beginPath(); x.arc(18, 18, 15, 0, 7); x.fill();
      x.fillStyle = "#40c057";
      x.beginPath(); x.arc(15, 15, 10, 0, 7); x.fill();
      x.fillStyle = "#69db7c"; x.beginPath(); x.arc(12, 12, 5, 0, 7); x.fill();
      // luciérnaga / guinda decorativa
      x.fillStyle = "#e03131"; x.fillRect(24, 20, 3, 3); x.fillRect(8, 22, 3, 3);
    });
    S.rock = this.make(30, 22, (x) => {
      x.fillStyle = "#343a40";
      x.beginPath(); x.moveTo(2, 20); x.lineTo(6, 6); x.lineTo(16, 2); x.lineTo(26, 8); x.lineTo(28, 20); x.closePath(); x.fill();
      x.fillStyle = "#495057";
      x.beginPath(); x.moveTo(6, 20); x.lineTo(9, 9); x.lineTo(17, 5); x.lineTo(24, 10); x.lineTo(25, 20); x.closePath(); x.fill();
      x.fillStyle = "#6c757d"; x.fillRect(11, 9, 6, 3);
    });
    S.lantern = this.make(16, 34, (x) => {
      x.fillStyle = "#343a40"; x.fillRect(7, 4, 3, 30);
      x.fillRect(4, 4, 9, 3);
      x.fillStyle = "#ffd43b"; x.fillRect(3, 12, 11, 12);
      x.fillStyle = "#ff922b"; x.fillRect(5, 14, 7, 8);
      x.fillStyle = "#fff3bf"; x.fillRect(7, 16, 3, 4);
      x.fillStyle = "#343a40"; x.fillRect(3, 10, 11, 3); x.fillRect(3, 23, 11, 3);
    });
    S.bunting = this.make(64, 20, (x) => {
      x.strokeStyle = "#adb5bd"; x.lineWidth = 1;
      x.beginPath(); x.moveTo(0, 2); x.quadraticCurveTo(32, 12, 64, 2); x.stroke();
      const cols = ["#e03131", "#f8f9fa", "#1971c2"];
      for (let i = 0; i < 8; i++) {
        const px = 2 + i * 8;
        const py = 3 + Math.sin((i / 8) * Math.PI) * 6;
        x.fillStyle = cols[i % 3];
        x.beginPath(); x.moveTo(px, py); x.lineTo(px + 6, py); x.lineTo(px + 3, py + 8); x.closePath(); x.fill();
      }
    });
    S.cactus = this.make(30, 44, (x) => {
      x.fillStyle = "#2b8a3e"; x.fillRect(11, 8, 9, 36);
      x.fillRect(3, 16, 9, 7); x.fillRect(3, 10, 5, 12);
      x.fillRect(19, 22, 8, 6); x.fillRect(23, 14, 5, 14);
      x.fillStyle = "#40c057"; x.fillRect(12, 8, 3, 35); x.fillRect(4, 16, 3, 6);
      x.fillStyle = "#ffd43b"; x.fillRect(13, 4, 3, 3);
      x.fillStyle = "#e03131"; x.fillRect(14, 5, 1, 1);
    });

    /* ---------- ICONOS DE MEJORAS (64px) ---------- */
    const iconDraw = (fn) => this.make(32, 32, fn);
    I.hilo = iconDraw((x) => {
      x.strokeStyle = "#e5dbff"; x.lineWidth = 3;
      x.beginPath(); x.arc(16, 16, 11, 0, 7); x.stroke();
      x.strokeStyle = "#fff"; x.lineWidth = 1;
      x.beginPath(); x.arc(16, 16, 11, 0, 4); x.stroke();
      x.fillStyle = "#f03e3e"; x.fillRect(14, 2, 4, 4);
    });
    I.volantin = iconDraw((x) => {
      x.fillStyle = K; x.beginPath(); x.moveTo(16, 2); x.lineTo(29, 16); x.lineTo(16, 30); x.lineTo(3, 16); x.closePath(); x.fill();
      x.fillStyle = W; x.beginPath(); x.moveTo(16, 4); x.lineTo(27, 16); x.lineTo(16, 28); x.lineTo(5, 16); x.closePath(); x.fill();
      x.fillStyle = R; x.beginPath(); x.moveTo(5, 17); x.lineTo(27, 17); x.lineTo(16, 28); x.closePath(); x.fill();
      x.fillStyle = B; x.fillRect(7, 9, 8, 7);
      x.fillStyle = "#fff"; x.fillRect(10, 10, 2, 5); x.fillRect(9, 12, 4, 1);
    });
    I.fuego = iconDraw((x) => {
      x.fillStyle = "#f8f9fa"; x.fillRect(13, 4, 6, 14);
      x.fillStyle = R; x.fillRect(13, 4, 6, 4);
      x.fillStyle = B; x.fillRect(13, 12, 6, 4);
      x.fillStyle = "#ff922b"; x.fillRect(14, 18, 4, 5);
      x.fillStyle = G; x.fillRect(15, 20, 2, 4);
      x.fillStyle = "#fff"; x.fillRect(15, 6, 2, 2);
    });
    I.estrella = iconDraw((x) => {
      x.fillStyle = G;
      x.fillRect(14, 2, 4, 28); x.fillRect(2, 14, 28, 4);
      x.fillRect(6, 6, 6, 6); x.fillRect(20, 6, 6, 6);
      x.fillRect(6, 20, 6, 6); x.fillRect(20, 20, 6, 6);
      x.fillStyle = "#fff"; x.fillRect(14, 14, 4, 4);
    });
    I.papel = iconDraw((x) => {
      x.fillStyle = R; x.fillRect(3, 6, 26, 7);
      x.fillStyle = G; x.fillRect(3, 17, 26, 6);
      x.fillStyle = B; x.fillRect(8, 9, 6, 4);
      x.fillStyle = "#fff"; x.fillRect(18, 18, 5, 4);
    });
    I.choripan = iconDraw((x) => {
      x.fillStyle = "#e8a33d"; x.fillRect(2, 10, 28, 14);
      x.fillStyle = "#b5451b"; x.fillRect(3, 13, 26, 8);
      x.fillStyle = G;
      for (let i = 0; i < 5; i++) x.fillRect(5 + i * 5, 15 + (i % 2), 3, 2);
      x.fillStyle = "#f4c46a"; x.fillRect(2, 10, 28, 3);
    });
    I.cueca = iconDraw((x) => {
      x.fillStyle = "#57453b"; x.fillRect(6, 4, 20, 5); x.fillRect(11, 1, 10, 4);
      x.fillStyle = "#e8b88a"; x.beginPath(); x.arc(16, 13, 7, 0, 7); x.fill();
      x.fillStyle = K; x.fillRect(12, 12, 3, 3); x.fillRect(18, 12, 3, 3);
      x.fillStyle = "#1971c2"; x.fillRect(7, 20, 18, 8);
      x.fillStyle = G; x.fillRect(15, 20, 3, 8);
      x.fillStyle = R; x.fillRect(7, 27, 18, 3);
    });
    I.mote = iconDraw((x) => {
      x.fillStyle = K; x.beginPath(); x.arc(16, 17, 12, 0, 7); x.fill();
      x.fillStyle = "#7c4a03"; x.beginPath(); x.arc(16, 17, 11, 0, 7); x.fill();
      x.fillStyle = "#c9842f"; x.beginPath(); x.arc(16, 14, 5, 0, 7); x.fill();
      x.fillStyle = "#57453b"; x.fillRect(15, 12, 3, 5);
      x.fillStyle = "#fff"; x.fillRect(9, 8, 2, 2); x.fillRect(22, 10, 2, 2);
    });
    I.bandera = iconDraw((x) => {
      x.fillStyle = "#8b5e34"; x.fillRect(4, 2, 3, 28);
      x.fillStyle = K; x.fillRect(7, 4, 23, 18);
      x.fillStyle = "#f8f9fa"; x.fillRect(8, 5, 21, 7);
      x.fillStyle = R; x.fillRect(8, 13, 21, 8);
      x.fillStyle = B; x.fillRect(8, 5, 9, 7);
      x.fillStyle = "#fff"; x.fillRect(11, 6, 3, 5); x.fillRect(10, 8, 5, 1);
    });
    I.viento = iconDraw((x) => {
      x.strokeStyle = "#74c0fc"; x.lineWidth = 3; x.lineCap = "round";
      x.beginPath(); x.moveTo(3, 10); x.lineTo(20, 10); x.quadraticCurveTo(27, 10, 27, 15); x.quadraticCurveTo(27, 19, 22, 19);
      x.stroke();
      x.beginPath(); x.moveTo(3, 18); x.lineTo(14, 18); x.quadraticCurveTo(19, 18, 19, 23); x.stroke();
      x.beginPath(); x.moveTo(3, 26); x.lineTo(22, 26); x.stroke();
    });
    I.acero = iconDraw((x) => {
      x.strokeStyle = "#dee2e6"; x.lineWidth = 4; x.lineCap = "round";
      x.beginPath(); x.moveTo(4, 28); x.lineTo(26, 6); x.stroke();
      x.fillStyle = "#fff"; x.beginPath(); x.moveTo(26, 6); x.lineTo(30, 2); x.lineTo(28, 10); x.closePath(); x.fill();
      x.fillStyle = "#ffd43b"; x.fillRect(4, 26, 6, 4);
    });
    I.cielo = iconDraw((x) => {
      x.fillStyle = "#ff8787";
      x.fillRect(6, 10, 8, 7); x.fillRect(18, 10, 8, 7);
      x.fillRect(8, 7, 5, 4); x.fillRect(19, 7, 5, 4);
      x.fillRect(8, 17, 16, 5); x.fillRect(11, 22, 10, 4); x.fillRect(14, 26, 4, 3);
      x.fillStyle = "#fff"; x.fillRect(9, 10, 3, 2);
    });
    I.estrellaP = iconDraw((x) => {
      x.fillStyle = B; x.fillRect(4, 4, 24, 24);
      x.fillStyle = "#fff"; x.fillRect(14, 7, 4, 14); x.fillRect(8, 12, 16, 4);
      x.fillRect(10, 9, 10, 3); x.fillRect(10, 18, 5, 3); x.fillRect(17, 18, 5, 3);
    });
    I.lucumi = iconDraw((x) => {
      x.fillStyle = "#5c3b00"; x.beginPath(); x.arc(16, 16, 13, 0, 7); x.fill();
      x.fillStyle = G; x.beginPath(); x.arc(16, 16, 11, 0, 7); x.fill();
      x.fillStyle = "#fff"; x.fillRect(14, 9, 4, 14); x.fillRect(9, 14, 14, 4);
      x.fillStyle = "#fff8e1"; x.fillRect(9, 8, 6, 2);
    });
    I.raya = iconDraw((x) => {
      x.fillStyle = G;
      x.beginPath(); x.moveTo(18, 2); x.lineTo(8, 17); x.lineTo(15, 17); x.lineTo(12, 30); x.lineTo(24, 13); x.lineTo(17, 13); x.closePath(); x.fill();
      x.fillStyle = "#fff"; x.fillRect(15, 6, 2, 6);
    });
    I.alcance = iconDraw((x) => {
      x.strokeStyle = "#e5dbff"; x.lineWidth = 3;
      x.beginPath(); x.arc(16, 16, 6, 0, 7); x.stroke();
      x.strokeStyle = "#74c0fc"; x.lineWidth = 2;
      x.beginPath(); x.arc(16, 16, 11, 0, 7); x.stroke();
      x.strokeStyle = "#ffd43b"; x.lineWidth = 2;
      x.beginPath(); x.arc(16, 16, 15, 0, 7); x.stroke();
    });
    I.suerte = iconDraw((x) => {
      x.fillStyle = GRN;
      x.fillRect(4, 14, 6, 12); x.fillRect(13, 10, 6, 16); x.fillRect(22, 6, 6, 20);
      x.fillStyle = "#b2f2bb"; x.fillRect(4, 14, 6, 3); x.fillRect(13, 10, 6, 3); x.fillRect(22, 6, 6, 3);
      x.fillStyle = G; x.fillRect(24, 3, 4, 4);
    });
    I.manta = iconDraw((x) => {
      x.fillStyle = "#f8f9fa"; x.fillRect(5, 8, 22, 18);
      x.fillStyle = R;
      for (let i = 0; i < 4; i++) x.fillRect(5, 8 + i * 5, 22, 2);
      x.fillStyle = B; x.fillRect(5, 8, 7, 18);
      x.fillStyle = "#fff"; x.fillRect(7, 14, 3, 6); x.fillRect(6, 16, 5, 2);
      x.fillStyle = "#adb5bd"; x.fillRect(5, 26, 22, 2);
    });
    I.corazon = iconDraw((x) => {
      x.fillStyle = "#c92a2a";
      x.fillRect(5, 9, 9, 8); x.fillRect(18, 9, 9, 8);
      x.fillRect(7, 6, 5, 4); x.fillRect(20, 6, 5, 4);
      x.fillRect(7, 17, 18, 5); x.fillRect(10, 22, 12, 4); x.fillRect(13, 26, 6, 3);
      x.fillStyle = "#ff8787"; x.fillRect(8, 9, 4, 3);
    });
    I.heal = iconDraw((x) => {
      x.fillStyle = "#f8f9fa"; x.fillRect(12, 4, 8, 24); x.fillRect(4, 12, 24, 8);
      x.fillStyle = "#2f9e44"; x.fillRect(13, 5, 6, 22); x.fillRect(5, 13, 22, 6);
      x.fillStyle = "#b2f2bb"; x.fillRect(13, 5, 6, 4);
    });
    I.revive = iconDraw((x) => {
      x.strokeStyle = "#ffd43b"; x.lineWidth = 4; x.lineCap = "round";
      x.beginPath(); x.arc(16, 16, 10, -0.5, 5); x.stroke();
      x.fillStyle = "#ffd43b";
      x.beginPath(); x.moveTo(24, 4); x.lineTo(30, 10); x.lineTo(22, 12); x.closePath(); x.fill();
      x.fillStyle = "#fff"; x.fillRect(14, 10, 4, 12); x.fillRect(10, 14, 12, 4);
    });
    I.armadura = iconDraw((x) => {
      x.fillStyle = "#868e96";
      x.beginPath(); x.moveTo(16, 3); x.lineTo(28, 8); x.lineTo(26, 22); x.lineTo(16, 29); x.lineTo(6, 22); x.lineTo(4, 8); x.closePath(); x.fill();
      x.fillStyle = "#ced4da";
      x.beginPath(); x.moveTo(16, 5); x.lineTo(26, 9); x.lineTo(24, 21); x.lineTo(16, 27); x.lineTo(8, 21); x.lineTo(6, 9); x.closePath(); x.fill();
      x.fillStyle = B; x.fillRect(13, 11, 6, 10); x.fillRect(11, 13, 10, 6);
      x.fillStyle = "#fff"; x.fillRect(15, 13, 2, 6); x.fillRect(14, 15, 4, 2);
    });
    I.vida = I.corazon;
    I.velocidad = I.viento;
    I.dano = I.acero;
    I.xp = I.estrellaP;
    I.monedas = I.lucumi;
    I.cdr = I.raya;
    I.area = I.alcance;
    I.crit = I.suerte;
    I.armor = I.manta;
    I.regen = I.corazon;
  },

  get(name) { return this.sprites[name]; },
  icon(name) { return this.icons[name] || this.icons.hilo; }
};
