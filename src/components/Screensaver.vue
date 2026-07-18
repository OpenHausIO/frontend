<template>
  <transition name="fade-overlay">
    <div v-if="visible && settings.screensaver.enabled" class="screensaver" :style="screensaverStyle"
      @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @mousedown="onMouseDown">

      <div class="screensaver-text-group" ref="textGroup" :class="{ 'is-visible': isTextVisible }" :style="textStyle">
        <h1 class="screensaver-heading " :data-text="title"
          :class="{ 'bf3-text': isGlitching || settings.screensaver.glitching }"
          :style="{ '--glitch-glow': glitchColor }">{{ title }}
        </h1>
        <p class="screensaver-sub">{{ subtitle }}</p>
      </div>

      <!-- optionaler dezenter Hinweis, nur kurz sichtbar -->
      <span class="swipe-hint text-center" :class="{ 'is-visible': showHint || isDragging }">
        <i class="fa fa-arrow-up d-block"></i>
        Swipe up to go back
      </span>

      <!-- Griff-Leiste unten: macht die Fläche als "hochschiebbares Tor" erkennbar -->
      <div class="garage-handle" aria-hidden="true" :class="{ 'is-visible': showHint || isDragging }"></div>

    </div>
  </transition>
</template>

<script>
import { settingsStore } from '../store';

// Fallback, falls im Store (noch) kein Wert gesetzt ist
const DEFAULT_IDLE_TIMEOUT = 60 * 1000;

// Statische Liste, unabhängig vom Instanz-Lifecycle: verhindert, dass
// beforeUnmount() auf eine Property zugreift, die eventuell erst in
// mounted() gesetzt wurde (z.B. bei Hot-Reload oder Abbruch von mounted()
// vor dieser Zeile) und dann noch undefined ist.
const ACTIVITY_EVENTS = ["mousedown", "mousemove", "keydown", "touchstart", "wheel", "scroll"];

export default {
  name: "Screensaver",

  props: {
    // aus der Splash-Screen-Komponente übernommen (Marken-Wortmarke)
    title: {
      type: String,
      default: "OpenHaus",
    },
    subtitle: {
      type: String,
      default: "SmartHome, IoT & Multimedia Solution",
    },
    // Dauer der Ein-/Ausblend-Transition in ms
    fadeDuration: {
      type: Number,
      default: 2000,
    },
    // Wie lange der Text komplett sichtbar bleibt, bevor er wieder ausfadet
    holdDuration: {
      type: Number,
      default: 10000,
    },
    // Ab wie vielen Pixeln nach oben gilt der Swipe als "Beenden"
    swipeThreshold: {
      type: Number,
      default: 200,
    },
    // idleTimeout kommt jetzt NICHT mehr als Prop rein, sondern
    // ausschließlich aus dem Settings-Store (settings.screensaver.timeout).
    // Siehe computed: effectiveIdleTimeout
  },
  setup() {

    const settings = settingsStore();

    return {
      settings
    }
  },
  data() {
    return {
      // interner Sichtbarkeits-State: wird komplett selbst verwaltet
      // (Inaktivitäts-Timer aktiviert, Swipe beendet)
      visible: false,

      isTextVisible: false,
      position: { top: "50%", left: "50%" },
      cycleTimeout: null,

      // Swipe-Handling
      touchStartY: null,
      isDragging: false,
      dragOffset: 0,

      showHint: false,
      hintTimeout: null,

      // Inaktivitäts-Erkennung
      idleTimer: null,

      // Glitch eye-catcher
      isGlitching: false,
      glitchInterval: null,
      glitchTimeout: null
    };
  },

  computed: {
    // Einzige Quelle der Wahrheit für den Idle-Timeout: der Settings-Store.
    // Kein eigener data()/prop-Zustand mehr nötig -> automatisch reaktiv,
    // wenn sich der Wert im Store ändert.
    effectiveIdleTimeout() {
      const stored = Number(this.settings.screensaver.timeout);
      return stored ? stored * 1000 : DEFAULT_IDLE_TIMEOUT;
    },

    // 0 = nicht gewischt, 1 = swipeThreshold erreicht (komplett durchsichtig)
    dragProgress() {
      if (!this.isDragging) return 0;
      return Math.min(1, Math.abs(this.dragOffset) / this.swipeThreshold);
    },

    textStyle() {
      const style = {
        top: this.position.top,
        left: this.position.left,
        // während des Ziehens sofort reagieren (kein Lag durch fadeDuration),
        // sonst normale Fade-Dauer für den Ein-/Ausblend-Zyklus
        transitionDuration: this.isDragging ? "0s" : `${this.fadeDuration}ms`,
        //transform: `translate(-50%, -50%) translateY(${this.dragOffset}px)`,
        transform: `translate(-50%, -50%)`,
      };
      // Während des Wischens die Opacity live an den Zug koppeln,
      // damit der Text "unter dem Finger" verblasst
      if (this.isDragging) {
        //style.opacity = 1 - this.dragProgress;
      }
      return style;
    },

    // Die Fläche wird beim Wischen wie ein Garagentor nach oben geschoben:
    // sie folgt 1:1 dem Finger (translateY), bekommt einen wachsenden
    // Schatten als "Lichtspalt" darunter und dimmt zusätzlich leicht ab.
    // Wird der Swipe nicht bis zur Schwelle durchgezogen, schnappt sie
    // per CSS-Transition sanft wieder an ihren Platz zurück.
    screensaverStyle() {

      const style = {
        transform: `translateY(${this.dragOffset}px)`,
        "--background-color": this.settings.screensaver.blackBackground ? "#000000" : "#101418",
        //"--splash-text": "green"
      };

      if (this.isDragging) {
        // während des Ziehens: sofort reagieren, keine Verzögerung
        style.transition = "none";
        //style.opacity = 1 - this.dragProgress * 0.1;
        //const shadowSpread = 20 + this.dragProgress * 60;
        //const shadowBlur = 30 + this.dragProgress * 70;
        //const shadowAlpha = 0.55 - this.dragProgress * 0.35;
        //style.boxShadow = `0 ${shadowSpread}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha})`;
        style.boxShadow = `0 50px 50px rgba(0, 0, 0, 0.5)`;
      } else {
        // losgelassen, aber nicht dismissed: sanft zurückschnappen
        style.transition = "transform 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease";
      }

      return style;
    },
  },

  watch: {
    // reagiert, egal ob "visible" durch den Inaktivitäts-Timer
    // oder durch dismiss() gesetzt wurde
    visible(active) {
      console.warn("Visibilty changed!", active);
      if (active) {
        this.start();
      } else {
        this.stop();
      }
    },

    // Ändert sich der Timeout im Store zur Laufzeit (z.B. über eine
    // Settings-UI), soll das SOFORT gelten und nicht erst beim nächsten
    // zufälligen Input-Event greifen -> Timer direkt neu aufsetzen.
    effectiveIdleTimeout() {
      this.resetIdleTimer();
    },

    // Wird der Screensaver in den Settings ein-/ausgeschaltet:
    // - aus: sofort ausblenden, egal wie weit der Countdown schon war
    // - ein: Countdown sauber bei 0 neu starten (nicht sofort anzeigen,
    //   auch wenn im Hintergrund vorher schon Zeit verstrichen ist)
    'settings.screensaver.enabled'(enabled) {
      if (!enabled) {
        this.visible = false;
      } else {
        this.resetIdleTimer();
      }
    },
  },
  mounted() {

    if (this.visible) this.start();

    // globale Inaktivitäts-Erkennung: reagiert auf jeden Input,
    // egal wo im DOM/body er stattfindet
    this.boundResetIdleTimer = this.resetIdleTimer.bind(this);
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, this.boundResetIdleTimer, { passive: true });
    });

    this.resetIdleTimer();
  },
  beforeUnmount() {
    this.stop();
    clearTimeout(this.idleTimer);
    // Guard: falls boundResetIdleTimer aus irgendeinem Grund nie gesetzt
    // wurde (z.B. Fehler vor dieser Zeile in mounted()), einfach nichts tun
    // statt eine Exception zu werfen.
    if (this.boundResetIdleTimer) {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, this.boundResetIdleTimer);
      });
    }
  },

  methods: {
    // Wird bei jeder Interaktion auf window/document aufgerufen.
    // Setzt den Countdown zurück; läuft er komplett ab, ohne dass
    // in der Zwischenzeit wieder Input kam, aktiviert sich der
    // Screensaver selbst (nur wenn er nicht schon aktiv ist).
    resetIdleTimer() {
      clearTimeout(this.idleTimer);

      this.idleTimer = setTimeout(() => {
        // nur aktivieren, wenn der Screensaver in den Settings
        // überhaupt eingeschaltet ist - sonst würde "visible" im
        // Hintergrund schon gesetzt, bevor der User ihn aktiviert,
        // und beim Einschalten poppt er dann sofort auf statt erst
        // nach dem konfigurierten Timeout.
        if (!this.visible && this.settings.screensaver.enabled) {
          this.visible = true;
        }
      }, this.effectiveIdleTimeout);
    },

    start() {

      this.startGlitchLoop();
      this.randomizePosition();
      this.fadeIn();

      // kurzer Hinweis auf die Wisch-Geste beim Start
      this.showHint = true;
      clearTimeout(this.hintTimeout);
      this.hintTimeout = setTimeout(() => {
        this.showHint = false;
      }, 4000);
    },

    stop() {
      clearTimeout(this.cycleTimeout);
      clearTimeout(this.hintTimeout);
      this.stopGlitchLoop();
      this.isTextVisible = false;
      this.dragOffset = 0;
    },

    randomizePosition() {
      // Text innerhalb eines sicheren Bereichs platzieren (Ränder aussparen)
      const top = 15 + Math.random() * 70; // 15% – 85%
      const left = 15 + Math.random() * 70; // 15% – 85%
      this.position = { top: `${top}%`, left: `${left}%` };
    },

    // Der komplette Ein-/Halte-/Ausblend-Zyklus läuft über setTimeout,
    // NICHT über das "transitionend"-Event. Grund: beim allerersten
    // Sichtbarwerden ändert sich die Opacity im selben Tick, in dem das
    // Element ins DOM kommt - der Browser hat dann noch keinen
    // Ausgangszustand gemalt, von dem aus transitioniert werden könnte.
    // Die Transition wird übersprungen und "transitionend" feuert nie,
    // wodurch der Text für immer sichtbar bliebe. Mit festen Timeouts,
    // die exakt fadeDuration/holdDuration entsprechen, ist der Zyklus
    // unabhängig vom Transition-Timing des Browsers.
    fadeIn() {

      // zwei rAF, damit der Browser den unsichtbaren Zustand erst malt,
      // bevor die Klasse (und damit die CSS-Transition) umschaltet
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.isTextVisible = true;
        });
      });

      clearTimeout(this.cycleTimeout);
      this.cycleTimeout = setTimeout(() => {
        this.fadeOut();
      }, this.fadeDuration + this.holdDuration);
    },

    fadeOut() {
      this.isTextVisible = false;

      clearTimeout(this.cycleTimeout);
      this.cycleTimeout = setTimeout(() => {
        // jetzt ist der Text unsichtbar -> Position ändern und neu einfaden
        this.randomizePosition();
        this.fadeIn();
      }, this.fadeDuration);
    },

    // --- Touch (Handy/Tablet) ---
    onTouchStart(e) {
      this.touchStartY = e.touches[0].clientY;
      this.isDragging = true;
      this.showHint = true;
    },

    onTouchMove(e) {
      if (this.touchStartY === null) return;
      const currentY = e.touches[0].clientY;
      const delta = currentY - this.touchStartY;
      // nur nach oben ziehen lassen (negative Werte)
      this.dragOffset = Math.min(0, delta);
    },

    onTouchEnd() {
      this.finishDrag();
    },

    // --- Maus (Desktop, zum Testen) ---
    onMouseDown(e) {
      this.touchStartY = e.clientY;
      this.isDragging = true;
      this.showHint = true;

      const onMouseMove = (ev) => {
        const delta = ev.clientY - this.touchStartY;
        this.dragOffset = Math.min(0, delta);
      };
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        this.finishDrag();
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },

    finishDrag() {
      if (this.touchStartY === null) return;

      const delta = this.dragOffset;
      this.isDragging = false;
      this.touchStartY = null;

      setTimeout(() => {
        this.showHint = false;
      }, 4000);

      if (Math.abs(delta) >= this.swipeThreshold) {
        this.dismiss();
      } else {
        // nicht weit genug gewischt -> zurückschnappen
        this.dragOffset = 0;
      }
    },

    dismiss() {
      this.dragOffset = 0;
      this.visible = false;
    },

    startGlitchLoop() {
      this.stopGlitchLoop();
      const scheduleNext = () => {
        const delay = 60000 + Math.random() * 60000; // 6-12s
        this.glitchInterval = setTimeout(() => {
          this.isGlitching = true;
          this.glitchTimeout = setTimeout(() => {
            this.isGlitching = false;
          }, 5000);
          scheduleNext();
        }, delay);
      };
      scheduleNext();
    },

    stopGlitchLoop() {
      clearTimeout(this.glitchInterval);
      clearTimeout(this.glitchTimeout);
      this.isGlitching = false;
    },

  },
};
</script>

<style scoped>
.screensaver {
  position: fixed;
  inset: 0;
  background: var(--background-color, #101418);
  z-index: 9999;
  overflow: hidden;
  touch-action: none;
  /* verhindert Scroll-Verhalten des Browsers beim Wischen */
  cursor: grab;
}

/* Orbitron/Exo 2 - wie in der Splash-Screen-Komponente verwendet */
/*@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@300;400&display=swap");*/

.screensaver-text-group {
  position: absolute;
  text-align: center;
  opacity: 0;
  transition-property: opacity;
  transition-timing-function: ease-in-out;
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
}

.screensaver-text-group.is-visible {
  opacity: 1;
}

.screensaver-heading {
  font-family: "Orbitron", sans-serif;
  font-weight: 900;
  font-size: clamp(2rem, 6vw, 4.5rem);
  color: var(--splash-text, #e8eef2);
  letter-spacing: 0.05em;
  margin: 0 0 0.25em;
}

.screensaver-sub {
  font-family: "Exo 2", sans-serif;
  font-weight: 300;
  font-size: clamp(0.7rem, 2vw, 0.80rem);
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--splash-text, #e8eef2);
  margin: 0;
  margin-top: -10px;
}

@media (max-width: 575.98px) {
  .screensaver-heading {
    font-size: 2.8rem;
  }
}

.swipe-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.swipe-hint.is-visible,
.garage-handle.is-visible {
  opacity: 1;
}

.garage-handle {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 46px;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.4s ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

/* --------- */




.bf3-text {
  position: relative;
  display: inline-block;
}

/* Zwei Kopien des Texts, die als "abgerissene" Zeilenbänder
   kurz horizontal verschoben werden. Keine Farbe, kein Glow -
   nur Versatz + harte Schnittkanten (clip-path). */
.bf3-text::before,
.bf3-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
}

.bf3-text::before {
  animation: bf3-hsync-a 4.2s infinite;
}

.bf3-text::after {
  animation: bf3-hsync-b 3.7s infinite;
}

/* steps() statt ease -> harte Sprünge statt weichem Gleiten,
   das erzeugt den "Riss" statt einer Animation.
   Die meiste Zeit (0%-90%) passiert nichts - erst kurz vor
   Ende des Zyklus kommt ein kurzer Störschub. */
@keyframes bf3-hsync-a {

  0%,
  88% {
    clip-path: inset(0 0 0 0);
    transform: translateX(0);
  }

  89% {
    clip-path: inset(22% 0 55% 0);
    transform: translateX(-18px);
  }

  90% {
    clip-path: inset(60% 0 15% 0);
    transform: translateX(14px);
  }

  91% {
    clip-path: inset(5% 0 80% 0);
    transform: translateX(-10px);
  }

  92%,
  100% {
    clip-path: inset(0 0 0 0);
    transform: translateX(0);
  }
}

@keyframes bf3-hsync-b {

  0%,
  93% {
    clip-path: inset(0 0 0 0);
    transform: translateX(0);
  }

  94% {
    clip-path: inset(45% 0 30% 0);
    transform: translateX(20px);
  }

  95% {
    clip-path: inset(10% 0 70% 0);
    transform: translateX(-16px);
  }

  96% {
    clip-path: inset(70% 0 5% 0);
    transform: translateX(12px);
  }

  97%,
  100% {
    clip-path: inset(0 0 0 0);
    transform: translateX(0);
  }
}
</style>