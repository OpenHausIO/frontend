<script>
import { defineComponent, defineAsyncComponent } from "vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "Battery",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  components: {
    Widget
  },
  data() {
    return {
      data: {
        showIcon: true
      },
      supported: false,
      source: "none", // 'fully' | 'battery-api' | 'mock'
      level: null,    // 0–1
      charging: null,
      _batteryManager: null,
    };
  },
  computed: {
    percent() {
      if (!this.supported || this.level === null) return "";
      return `${Math.round(this.level * 100)}%`;
    },
    status() {
      if (!this.supported) return "not supported";
      if (this.charging === null) return "";
      return this.charging ? "charging" : "discharging";
    },
  },
  methods: {
    updateFromBatteryManager() {
      this.level = this._batteryManager.level;
      this.charging = this._batteryManager.charging;
    },
    async initBattery() {

      // 1. Fully Kiosk Browser
      if (window.fully) {
        this.supported = true;
        this.source = "fully";
        this.level = window.fully.getBatteryLevel() / 100;
        this.charging = window.fully.isPlugged();
        return;
      }

      // 2. Standard Battery Status API
      if ("getBattery" in navigator) {
        try {
          this._batteryManager = await navigator.getBattery();
          this.supported = true;
          this.source = "battery-api";
          this.updateFromBatteryManager();
          this._batteryManager.addEventListener("levelchange", this.updateFromBatteryManager);
          this._batteryManager.addEventListener("chargingchange", this.updateFromBatteryManager);
          return;
        } catch (e) {
          // fällt durch zu "not supported" bzw. Dev-Mock
        }
      }

      // 3. Dev-Mock, nur im Dev-Modus, wenn nichts verfügbar ist
      if (import.meta.env.DEV) {
        this.supported = true;
        this.source = "mock";
        this.level = 0.42;
        this.charging = false;
      }

    },
    loaded(data) {
      Object.assign(this.data, data);
    }
  },
  mounted() {
    this.initBattery();
  },
  beforeUnmount() {
    if (this._batteryManager) {
      this._batteryManager.removeEventListener("levelchange", this.updateFromBatteryManager);
      this._batteryManager.removeEventListener("chargingchange", this.updateFromBatteryManager);
    }
  }
});
</script>

<template>
  <Widget name="Battery" :uuid="uuid" :data="data" @loaded="loaded">

    <!-- OPTIONS -->
    <template #options>

      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="showIcon" v-model="data.showIcon" />
        <label class="form-check-label small" for="showIcon">
          Show Icon
        </label>
      </div>

    </template>
    <!-- OPTIONS -->

    <div style="container-type: size; height: 100%;"
      class="bg-transparent h-100 w-100 d-flex align-items-center justify-content-center">
      <span style="font-size: 17cqw; white-space: nowrap; line-height: 1;">

        <i class="fa-solid fa-plug-circle-bolt" v-if="status === 'charging' && data.showIcon"></i>
        <i class="fa-solid fa-battery-three-quarters" v-if="status === 'discharging' && data.showIcon"></i>

        {{ percent }}

      </span>
    </div>

  </Widget>
</template>