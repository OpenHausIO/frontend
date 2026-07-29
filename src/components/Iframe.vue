<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    src: {
      type: String,
      default: "http://example.com"
    }
  },
  data() {
    return {
      isLoading: true,
      hasError: false,
      timeout: null,
      iframeKey: 0
    };
  },
  mounted() {
    this.timeout = setTimeout(() => {
      this.isLoading = false;
      this.hasError = true;
    }, 5000);
  },
  unmounted() {
    clearTimeout(this.timeout);
  },
  watch: {
    src() {
      this.isLoading = true;
      this.hasError = false;
    }
  },
  methods: {
    openInNewWindow() {
      //window.open("/api/plugins/68aafde263362b527fcbdc8e/proxy/", "_blank");
      // "width=800,height=600,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes"
      window.open(this.src, "iframeWindow", "menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes");
    },
    onIframeLoad() {
      clearTimeout(this.timeout);
      this.isLoading = false;
      this.hasError = false;
    },
    reload() {

      this.iframeKey++;
      this.hasError = false;
      this.isLoading = true;

      this.timeout = setTimeout(() => {
        this.isLoading = false;
        this.hasError = true;
      }, 5000);

    }
  }
});
</script>

<template>
  <div class="w-100 h-100 iframe-wrapper">

    <div v-if="isLoading && !hasError" class="loader-overlay text-center">
      <div class="spinner-border text-primary" style="width: 40px; height: 40px;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="loader-text">Lade {{ src }}...
      </div>
    </div>

    <div v-if="hasError && !isLoading" class="loader-overlay text-center">

      <i class="fa-solid fa-triangle-exclamation text-danger"></i>

      <div class="loader-text">
        Could not load <a :href="src" target="_blank">{{ src }}</a>
      </div>

      <button class="btn btn-outline-primary" style="width: 12rem;" @click="reload()">
        Reload
      </button>

    </div>

    <iframe :key="iframeKey" v-show="!isLoading && !hasError" :src="src" class="w-100 h-100"
      @load="onIframeLoad"></iframe>

  </div>
</template>

<style scoped>
iframe {
  display: block;
}

i.fa-solid {
  font-size: 50px;
}

.iframe-wrapper {
  position: relative;
}

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: rgba(0, 0, 0, 1);
  z-index: 10;
}

@keyframes stripes-move {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 56.57px 0;
  }
}

.hasError {
  background-color: #0a0a0a;
  background-image: repeating-linear-gradient(-45deg,
      #212529 0px,
      #212529 12px,
      transparent 12px,
      transparent 24px);
}
</style>