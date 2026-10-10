<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { commonStore, settingsStore } from "../store.js";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

import Overlay from "../components/Overlay.vue";

export default defineComponent({
  name: "Welcome",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  setup() {

    let settings = settingsStore();
    let common = commonStore();

    return {
      settings,
      common
    };

  },
  components: {
    Widget,
    Overlay
  },
  data() {
    return {
      options: {
        showTitleboxCheckbox: false
      },
      currentSlide: 0,
      lightboxOpen: false,
      confettiFired: false,
      // a better approach would be a seperate "subtitles" track
      // https://claude.ai/chat/d9536ced-417e-4e84-b2d8-0fd198b63d90
      // this has the benefit, that it could in fullscreen be shown in the video element
      // and in portrait mode, under the video element
      slides: [{
        title: "Willkommen",
        text: "Sie befinden sich im Dashboard, und erhalten eine kurze Einführung in OpenHaus.",
        img: "dashboard.png"
      }, {
        title: "Quick Introduction",
        text: "",
        video: "quick-start.mp4",
        poster: "quick-start-poster.png"
      }, {
        title: "Räume",
        text: "Räume gliedern Endpoints, und erlauben eine Räumliche trennung. So kann man schnell auf Endpoints in einem bestimmten Raum zugreifen.",
        img: "rooms.png"
      }, {
        title: "Endpoints",
        text: "Endpoints sind dinge die man Steuern kann, und von Devices bereit gestellt werden. Ein Gerät kann mehrer Endpoints bereitstellen. Z.b. ein AV-Receiver mit Multizonen unterstützung.",
        img: "endpoints.png"
      }, {
        title: "Devices",
        text: "Devices stellen Endpoints bereit und schnitstellen zu denen OpenHaus sich verbinden kann. Z.b. Shelly Aktoren oder Gateways für Zigbee/Thread/Matter.",
        img: "devices.png"
      }, {
        title: "Scenes",
        text: "Scenes erlauben vordefinierte Kommands auszuführen, und so Lichtszenen, Heimkino oder Gaming Abende auf Knopfdruck auszurufen, ohne jedes Gerät einzeln steuern zu müssen.",
        img: "scenes.png"
      }, {
        title: "External Sites/Music",
        text: "In das Frontend lassen sich beliebeig externe Seiten einbinden, wie eine Musik steuerung für Multiroom-Audio.",
        img: "external.png"
      }, {
        title: "Settings",
        text: `Über die Settings seite können Sie das Erscheinungsbild anpassen, Einstellungen zurücksetzen oder die <a href="/admin">Administration</a>s-Oberfläche aufrufen über die Sie Plugins & Geräte hinzufügen können.`,
        img: "settings.png"
      }],
      // Zoom/Pan-Status für die Lightbox
      zoomScale: 1,
      zoomX: 0,
      zoomY: 0,
      _pinchStartDist: 0,
      _pinchStartScale: 1,
      _panStart: null,
      _panStartOffset: { x: 0, y: 0 },
      _lastTapTime: 0,
      // video cues
      currentCaption: "Video Schnellstart",
      cues: [
        { time: 0, text: "Willkommen im Dashboard" },
        { time: 3, text: "Hier siehst du deine Räume" },
        { time: 9, text: "Mit einem Klick auf einen Raum, siehst du alle Endpoints darin" },
        { time: 12, text: "Endpoints sind dinge, die man steuern kann" },
        { time: 15, text: "Nach einem Klick auf einen Endpoint, sieht man alle Kommandos" },
        { time: 22, text: "Durch den Klick in der Navigation, sieht man alle Endpoints.\nNicht nur die in einem Raum." },
        { time: 37, text: "Auch hier gelangt man wieder durch einen Klick darauf zu den Kommands die man ausführen kann." },
        { time: 44, text: "Geräte sind dinge zu denen eine Verbindung aufgebaut werden kann, und Endpoints bereit stellen" },
        { time: 57, text: "Szenen bieten die möglichkeit Kommandos in abfolge auszuführen um so z.b. Lichtstimmungen zu definieren" },
        { time: 62, text: `Über <a href="#/settings">Settings</a> kann man Einstellungen am Frontend vornehmen, wie z.b. das Erscheinungsbild anzupassen.` },
        { time: 70, text: "Einstellungen sind reaktiv, und werden sofort angewendet." },
        { time: 86, text: "Widgets sind nützlicher helfer auf dem Dashboard." },
        { time: 100, text: "Sie lassen sich in Größe und position frei gestalten." },
        { time: 140, text: "Wenn Widgets gelockt sind, lassen sie sich nicht verändern." },
        { time: 146, text: "Manche Widgets haben spezielle optionen" },
        { time: 160, text: "Widgets lasssen sich im unlockt zustand oben das Menu löschen." },
        { time: 162, text: `Das war der Schnelleinstieg! <br />Viel Spaß mit Ihrer OpenHaus installation.` },
      ],
      layout: {
        gap: null,
        borderRadius: null,
        itemTransparancy: null
      }
    };
  },
  methods: {
    goToSlide(index) {
      this.currentSlide = index;
      this.currentCaption = "";
      this.shouldFireConfetti();
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      this.currentCaption = "";
      this.shouldFireConfetti();
    },
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
      this.currentCaption = "";
      this.shouldFireConfetti();
    },
    shouldFireConfetti() {
      if (this.slides.length - 1 === this.currentSlide && !this.confettiFired) {

        this.common.navbar = true;
        this.confettiFired = true;

        // firing confetti looks untrustworthy
        // import confetti from "canvas-confetti";

        /*
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        */

      }
    },
    openLightbox() {
      this.resetZoom();
      this.lightboxOpen = true;
    },
    closeLightbox() {
      this.lightboxOpen = false;
      this.resetZoom();
    },
    resetZoom() {
      this.zoomScale = 1;
      this.zoomX = 0;
      this.zoomY = 0;
    },

    // --- Touch-Handling für Pinch-Zoom & Pan ---------------------------
    touchDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    },
    onTouchStart(e) {
      if (e.touches.length === 2) {
        // Pinch startet
        this._pinchStartDist = this.touchDistance(e.touches);
        this._pinchStartScale = this.zoomScale;
      } else if (e.touches.length === 1) {
        if (this.zoomScale > 1) {
          // Pan startet (nur wenn bereits gezoomt)
          this._panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          this._panStartOffset = { x: this.zoomX, y: this.zoomY };
        } else {
          // Doppeltipp-Erkennung zum Rein-/Rauszoomen
          const now = Date.now();
          if (now - this._lastTapTime < 300) {
            this.zoomScale = this.zoomScale > 1 ? 1 : 2;
            this.zoomX = 0;
            this.zoomY = 0;
          }
          this._lastTapTime = now;
        }
      }
    },
    onTouchMove(e) {
      if (e.touches.length === 2) {
        // Pinch-Zoom
        e.preventDefault();
        const dist = this.touchDistance(e.touches);
        const scale = (dist / this._pinchStartDist) * this._pinchStartScale;
        this.zoomScale = Math.min(Math.max(scale, 1), 5); // zwischen 1x und 5x begrenzen
      } else if (e.touches.length === 1 && this._panStart && this.zoomScale > 1) {
        // Pan bei aktivem Zoom
        e.preventDefault();
        const dx = e.touches[0].clientX - this._panStart.x;
        const dy = e.touches[0].clientY - this._panStart.y;
        this.zoomX = this._panStartOffset.x + dx;
        this.zoomY = this._panStartOffset.y + dy;
      }
    },
    onTouchEnd(e) {
      if (e.touches.length < 2) {
        this._pinchStartDist = 0;
      }
      if (e.touches.length === 0) {
        this._panStart = null;
        // Wenn rausgezoomt bis <1, zurücksetzen
        if (this.zoomScale <= 1) {
          this.resetZoom();
        }
      }
    },
    onTimeUpdate(e) {
      const t = e.target.currentTime;
      // Letzten Cue finden, dessen "time" <= aktueller Zeit ist
      const active = [...this.cues].reverse().find((cue) => {
        return t >= cue.time;
      });
      this.currentCaption = active ? active.text : "";
      //this.slides[this.currentSlide].text = active ? active.text : "";
    }
  },
  created() {

    const backupRaw = localStorage.getItem("welcome-layout-backup");

    if (backupRaw) {
      try {

        const backup = JSON.parse(backupRaw);
        Object.assign(this.settings.layout, backup);

      } catch (e) {

        console.warn("Could not restore backup-layout", e);

      } finally {

        localStorage.removeItem("welcome-layout-backup");

      }
    }

  },
  mounted() {

    // hidding the navbar sounds good at first
    // but when removing the welcome widget
    // who to go back to settings page?
    // hide only when firstrun = true?
    //this.common.navbar = false;
    this.settings.firstrun = false;

    // save (custom) values
    Object.keys(this.layout).forEach((prop) => {
      this.layout[prop] = this.settings.layout[prop];
      this.settings.layout[prop] = "0";
    });

    // persistent temporary override, if unclean exit/reload
    localStorage.setItem("welcome-layout-backup", JSON.stringify(this.layout));

  },
  unmounted() {

    // restore (custom) values
    Object.keys(this.layout).forEach((prop) => {
      this.settings.layout[prop] = this.layout[prop];
    });

    // remove temporary override
    localStorage.removeItem("welcome-layout-backup");

  }
});
</script>

<template>
  <Widget name="Welcome" :uuid="uuid" :options="options">
    <div class="welcome-wrapper">

      <h1 class="text-center">
        Welcome to OpenHaus!
      </h1>

      <div class="slideshow">
        <div class="slide">

          <h2>
            {{ slides[currentSlide].title }}
          </h2>

          <!--
          <div class="browser-frame" @click="openLightbox">
            <div class="browser-topbar">
              <div class="browser-dots">
                <span class="dot-red"></span>
                <span class="dot-yellow"></span>
                <span class="dot-green"></span>
              </div>
              <div class="hide browser-address">http://localhost:3001/user/#/dashboard</div>
            </div>
            <img :src="`/user/docs/${slides[currentSlide].img}`" class="browser-img shadow">
          </div>
          -->
          <div class="media-frame shadow">
            <img :src="`/user/docs/${slides[currentSlide].img}`" v-if="slides[currentSlide].img" @click="openLightbox">

            <!-- Autoplay geht nicht -->
            <video :src="`/user/docs/${slides[currentSlide].video}`" controls @timeupdate="onTimeUpdate"
              v-if="slides[currentSlide].video" :poster="`/user/docs/${slides[currentSlide].poster}`" muted></video>

            <!-- Autoplay geht auf mobile
            <video autoplay="autoplay" loop="loop" muted defaultMuted playsinline controls oncontextmenu="return false;"
              :src="`/user/docs/${slides[currentSlide].video}`">
            </video>
            -->


          </div>

          <p v-html="slides[currentSlide].video ? currentCaption : slides[currentSlide].text"> </p>

        </div>
      </div>

      <div class="controls">

        <button class="nav-btn prev" @click="prevSlide" aria-label="Vorheriger Slide">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <div class="dots">
          <span v-for="(slide, index) in slides" :key="index" class="dot" :class="{ active: index === currentSlide }"
            @click="goToSlide(index)"></span>
        </div>

        <button class="nav-btn next" @click="nextSlide" aria-label="Nächster Slide">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

      </div>

    </div>

    <Teleport to="body">
      <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
        <Overlay />
        <img :src="`/user/docs/${slides[currentSlide].img}`" class="lightbox-img"
          :style="{ transform: `translate(${zoomX}px, ${zoomY}px) scale(${zoomScale})` }" @touchstart="onTouchStart"
          @touchmove="onTouchMove" @touchend="onTouchEnd" v-if="slides[currentSlide].img">
        <video class="lightbox-img" :src="`/user/docs/${slides[currentSlide].video}`" v-if="slides[currentSlide].video"
          controls></video>
      </div>
    </Teleport>

  </Widget>
</template>

<style scoped>
.media-frame {
  width: 100%;
  /*aspect-ratio: 16 / 9;*/
  /* oder das Verhältnis, das zu deinen Screenshots passt */
  overflow: hidden;
  border: 1px solid #000;
  border-radius: 4px;
  margin-bottom: 12px;
  /*background-color: #000*/
}

.media-frame img,
.media-frame video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* "cover" schneidet ab, "contain" zeigt alles mit Letterboxing */
  display: block;
}

.browser-frame {
  margin: 0 auto 12px;
  max-width: 100%;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  cursor: zoom-in;
}

.browser-topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #2a2a2e;
  padding: 8px 12px;
}

.browser-dots {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.browser-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot-red {
  background: #ff5f56;
}

.dot-yellow {
  background: #ffbd2e;
}

.dot-green {
  background: #27c93f;
}

.browser-address {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.browser-img {
  display: block;
  width: 100%;
  max-width: 100%;
}

.welcome-wrapper {
  padding: 0px;
  position: relative;
  height: 100%;
}

.slideshow {
  max-width: 600px;
  margin: 30px auto 0;
  min-height: 60vh;
}

.slide {
  min-height: 160px;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.slide h2 {
  margin: 0 0 12px;
  font-size: 1.2rem;
}

.slide p {
  margin: 0;
  line-height: 1.5;
  opacity: 0.85;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
}

.nav-btn {
  flex-shrink: 0;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: inherit;
  font-size: 0.8rem;
  line-height: 1;
  cursor: pointer;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
}

.dot.active {
  background: rgba(255, 255, 255, 0.9);
}

@media (max-width: 480px) {
  .controls {
    gap: 10px;
  }

  .slide {
    min-height: 140px;
    padding: 16px;
  }

  .nav-btn {
    width: 30px;
    height: 30px;
    font-size: 1.2rem;
  }
}

.media-frame>img {
  cursor: zoom-in;
}
</style>

<!-- unscoped: landet per Teleport außerhalb dieser Komponente im DOM -->
<style>
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  overflow: hidden;
  touch-action: none;
  /* verhindert Browser-eigenes Scroll-/Zoom-Verhalten während des Pinchens */
}

.lightbox-img {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  z-index: 1051;
  border-radius: 4px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  cursor: zoom-out;
  transition: transform 0.05s ease-out;
  touch-action: none;
  will-change: transform;
}
</style>