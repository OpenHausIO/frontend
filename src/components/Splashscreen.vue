<template>
  <Transition name="splash-fade">
    <div v-if="visible" class="splash-overlay d-flex align-items-center justify-content-center">

      <div class="splash-content text-center px-3">

        <h1 class="splash-heading display-3 fw-bold mb-1">
          OpenHaus
        </h1>

        <p class="splash-sub text-uppercase ls-wide">
          SmartHome / IoT Solution
        </p>

        <div class="splash-progress-wrap" role="progressbar" :aria-valuenow="progress" aria-valuemin="0"
          aria-valuemax="100">
          <div class="splash-progress-track">
            <div class="splash-progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
        </div>

        <p class="splash-status mb-0">
          <span class="status-dot" aria-hidden="true"></span>
          <span v-if="statusText">{{ `${statusText}...` || '&nbsp;' }}</span>
        </p>

        <div style="min-height: 18px">
          <p class="text-secondary mt-1 mb-0" style="font-size: 0.75rem;"
            :style="{ visibility: showButtons ? 'visible' : 'hidden' }">
            This takes longer than normally
          </p>
        </div>

        <div class="mt-4 d-flex justify-content-center gap-3" style="min-height: 33px">
          <button class="btn btn-outline-secondary splash-btn"
            :style="{ visibility: showButtons ? 'visible' : 'hidden' }" @click="close()">Close</button>
          <button class="btn btn-outline-secondary splash-btn"
            :style="{ visibility: showButtons ? 'visible' : 'hidden' }" @click="reload()">Reload</button>
        </div>

        <div class="mt-4 d-flex justify-content-center gap-2 hide">
          <a href="https://open-haus.io" target="_blank" class="splash-link">Website</a>
          <span class="splash-link-dot">·</span>
          <a href="https://github.com/OpenHausIO" target="_blank" class="splash-link">GitHub</a>
          <span class="splash-link-dot">·</span>
          <a href="https://github.com/OpenHausIO" target="_blank" class="splash-link">Docs</a>
        </div>

      </div>

    </div>
  </Transition>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

const visible = ref(true);
const text = ref(null);

export function visibility(val) {
  visible.value = val;
}

export function statusText(txt) {
  text.value = txt;
}

export default defineComponent({
  name: 'SplashScreen',
  computed: {
    statusText() {
      return text.value;
    },
    visible() {
      return visible.value;
    },
    progress() {

      if (!text.value) {
        return null;
      }

    }
  },
  data() {
    return {
      showButtons: false,
      _timeout: null
    }
  },
  mounted() {

    this.startTimeout();

    watch(visible, (val) => {
      if (val) {

        this.showButtons = false;
        this.startTimeout();

      } else {
        clearTimeout(this._timeout);
      }
    });

  },
  methods: {
    startTimeout() {
      clearTimeout(this._timeout);
      this._timeout = setTimeout(() => {
        this.showButtons = true;
      }, 5000);
    },
    close() {
      visible.value = false;
    },
    reload() {
      window.location.reload();
    }
  }
});
</script>

<style scoped>
/*@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@300;400&display=swap');*/

.splash-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  /*background: radial-gradient(ellipse at 30% 40%, #212529 0%, #040d1a 70%);*/
  /*background: #212529;*/
  background: #101418;
  overflow: hidden;
}

.splash-grid {
  position: absolute;
  inset: -50%;
  background-size: 48px 48px;
  transform: perspective(600px) rotateX(20deg);
  pointer-events: none;
}


.splash-content {
  position: relative;
  z-index: 1;
  /*width: 100%;*/
  max-width: 500px;
}

.splash-icon {
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

.splash-heading {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  color: var(--splash-text);
  letter-spacing: 0.05em;
  /*text-shadow: 0 0 40px rgba(56, 189, 248, 0.4);*/
}

.splash-accent {
  color: var(--splash-accent);
}

.splash-sub {
  font-family: 'Exo 2', sans-serif;
  font-weight: 300;
  font-size: clamp(0.7rem, 2vw, 0.85rem);
  letter-spacing: 0.35em;
}

.splash-progress-wrap {
  width: 100%;
  margin: 25px 0;
}

.splash-progress-track {
  height: 3px;
  background: rgba(56, 189, 248, 0.1);
  border-radius: 99px;
  overflow: hidden;
  position: relative;
}

.splash-progress-bar {
  height: 100%;
  background: var(--bs-primary);
  border-radius: 99px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.7);

  /* Indeterminate fallback when width is 0% or null */
  animation: indeterminate 1.8s ease-in-out infinite;
}

/* Stop indeterminate when progress > 0 */
.splash-progress-bar[style*="width: 0%"],
.splash-progress-bar:not([style]) {
  animation: indeterminate 1.8s ease-in-out infinite;
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%) scaleX(0.4);
  }

  50% {
    transform: translateX(50%) scaleX(0.6);
  }

  100% {
    transform: translateX(200%) scaleX(0.4);
  }
}

.splash-status {
  font-family: 'Exo 2', sans-serif;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 1.5em;
  transition: opacity 0.3s ease;
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--splash-accent);
  flex-shrink: 0;
  animation: dotBlink 1.2s ease-in-out infinite;
}

@keyframes dotBlink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.2;
  }
}

.splash-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.splash-fade-leave-to {
  opacity: 0;
  transform: scale(1.04);
}

@media (max-width: 575.98px) {
  .splash-heading {
    font-size: 2.8rem;
  }
}

.splash-btn {
  width: 130px;
  font-family: 'Exo 2', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border-color: var(--bs-primary);
  background: transparent;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.splash-btn:hover {
  border-color: var(--splash-accent);
  color: var(--splash-accent);
  background: transparent;
}

.splash-link {
  font-family: 'Exo 2', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bs-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.splash-link:hover {
  color: var(--bs-primary);
}

.splash-link-dot {
  color: var(--bs-secondary);
  opacity: 0.4;
  font-size: 30px;
  line-height: 16px;
}

.splash-bottom {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  text-align: center;
}
</style>