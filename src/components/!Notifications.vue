<script>
import { defineComponent, reactive } from "vue";

const notifications = reactive([]);

const NotificationComponent = defineComponent({
  setup() {
    return {
      notifications
    };
  },
  mounted() {
    // Beispiel-Notification nach 1 Sekunde hinzufügen
    setTimeout(() => {
      notifications.push({
        title: "Notification nach 1 Sekunde",
        type: "success", // Typ: success, error, info, etc.
      });
    }, 1000);
  },
  methods: {
    // Hilfsfunktion zum Festlegen der Farbe des Indikators
    getIndicatorStyle(type) {

      const colors = {
        success: "var(--bs-green)",
        error: "var(--bs-red)",
        info: "var(--bs-blue)",
        warning: "var(--bs-yellow)",
      };

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue(colors[type] || "var(--bs-secondary)").trim();

      console.log("PrimaryColor", primaryColor)

      return {
        backgroundColor: primaryColor
      };

    }
  }
});

export default NotificationComponent;

// Funktion zum Hinzufügen von Notifications
export function addNotification({ title, type = "info" }) {
  notifications.push({
    title,
    type
  });
  // Entfernen nach 5 Sekunden
  setTimeout(() => {
    //notifications.shift();
  }, 5000);
}
</script>

<template>
  <ul class="notifications-list">
    <li class="notification-item" v-for="(notification, index) in notifications" :key="index"
      :class="`notification-${notification.type}`">
      <div class="notification-item-indicator" :style="getIndicatorStyle(notification.type)"></div>
      <div class="notification-item-content">
        {{ notification.title }}
      </div>
    </li>
  </ul>
</template>

<style>
.notifications-list {
  list-style: none;
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 300px;
  z-index: 1050;
  /* Bootstrap Modal z-index */
  padding: 0;
  margin: 0;
}

.notification-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--bs-gray-800);
  color: var(--bs-body-color);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  border: 1px solid #000;
}

.notification-item-indicator {

  position: absolute;
  bottom: 0;
  height: 5%;
  width: 6px;

  /*
  width: 8px;
  height: 100%;
  border-radius: 4px 0 0 4px;
  border-color: red
  */
}

.notification-item-content {
  flex: 1;
  padding-left: 1rem;
}

/* Notification Typen */
.notification-success {
  border-color: var(--bs-gray-800);
  background-color: var();
  color: var(--bs-success-text);
}

.notification-error {
  border-color: var(--bs-danger-border-color);
  background-color: var(--bs-danger-bg);
  color: var(--bs-danger-text);
}

.notification-info {
  border-color: var(--bs-info-border-color);
  background-color: var(--bs-info-bg);
  color: var(--bs-info-text);
}

.notification-warning {
  border-color: var(--bs-warning-border-color);
  background-color: var(--bs-warning-bg);
  color: var(--bs-warning-text);
}
</style>