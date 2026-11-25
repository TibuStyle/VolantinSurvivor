# 🪁 Volantín Survivor

**Sobrevive al 18 de Septiembre** — un roguelike de oleadas inspirado en *Vampire Survivors* y *Megabonk*, con temática de **Fiestas Patrias de Chile**, estética de **volantines (cometas)** e **hilos** brillantes.

## ▶️ Cómo jugar

1. Abre `index.html` (o sirve la carpeta con cualquier servidor estático).
2. Pulsa **¡JUGAR!**
3. **WASD / flechas** mueven al huaso; el **ratón** guía el **volantín** — va donde va el mouse, dentro del círculo del hilo.
4. **Click = más hilo** · **click derecho / rueda = menos hilo**. **El volantín hace daño** por contacto a los enemigos.
5. Recolecta **⭐ estrellas (XP)** para subir de nivel y elegir mejoras; el resto de armas atacan solas.
6. ⚠️ **El hilo es vulnerable**: si un **enemigo toca el hilo**, **te quita vida a ti**. ¡Despeja la línea! Sobrevive a los 3 Jefes de Mundo.
7. Gasta **🪙 Lucumí** en la **Tienda del Huaso** entre mundos (mejoras permanentes).

## 🎮 Contenido

| Elemento | Detalle |
|---|---|
| **3 Mundos (Jefes de Mundo)** | Plaza de la Fiesta → *Castillo Ardiente* · Orillas del Mapocho → *Lagarto del Mapocho* · Cumbre del Volantín → *El Volantín Oscuro* |
| **9 Armas** | Volantín Cortante (daño de contacto del volantín), Volantines, Fuego Artificial, Estrella Fugaz, Papel Picado, Choripán Explosivo, Cueca Salvaje, Mote con Huesillo, Bandera Chilena |
| **9 Enemigos** | Empanada Rebelde, Sopaipilla Feroz, Choripán Salvaje, Luchador del 18, Piquero Alegre, Guanaco Maldiciente, Diablito de Carnaval, Cochayuyo Colosal, Volantín Sombrio |
| **Mini jefe** | Monito de la Carreta (aparece a mitad de cada etapa) |
| **10 Pasivas** | Velocidad, daño, vida, XP, lucumí, recarga, alcance, crítico, armadura, regeneración |
| **12 mejoras de tienda** | Progresión meta persistente con Lucumí (localStorage) |
| **Roguelike** | Cartas de mejora al subir de nivel, tienda entre mundos, revivir (Segundo Aire) |

## 🛠️ Tech

- **HTML5 Canvas + JavaScript puro** — sin dependencias ni build.
- **Todos los assets generados por código**: 35 sprites pixel-art + 32 iconos dibujados proceduralmente (`js/core/assets.js`).
- **Audio sintetizado** con WebAudio (SFX + loop de cueca) — `js/core/audio.js`.
- 2 fondos de pantalla generados para menú y tienda (`assets/`).

## 📁 Estructura

```
index.html          — entrada
css/style.css       — HUD y overlays (menú, cartas, tienda…)
js/core/            — utils, input, audio, assets, partículas
js/game/            — etapas, armas, enemigos, jefes, jugador,
                      mejoras, tienda, HUD, motor principal
assets/             — arte de menú y tienda
tools/smoke_test.js — test de humo (node tools/smoke_test.js)
```
