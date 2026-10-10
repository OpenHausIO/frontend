<script>
import { defineComponent, watch, defineAsyncComponent } from "vue";
import { notifications } from "../components/Notifications.vue";
import dateFormat from "dateformat";
import { settingsStore } from "../store.js";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));


export default defineComponent({
  name: "Notifications",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  components: {
    Widget
  },
  setup() {

    const settings = settingsStore();

    return {
      settings
    };

  },
  data() {
    return {
      data: {
        notifications: []
      },
      menu: [{
        title: "Clear",
        method: "clear",
      }]
    };
  },
  mounted() {

    watch(notifications, (newVal) => {
      const known = new Set(this.data.notifications.map(n => `${n.uuid}-${n.timestamp}`));
      const added = newVal.filter(n => !known.has(`${n.uuid}-${n.timestamp}`));
      if (added.length) {
        this.data.notifications.unshift(...added);
      }
    }, {
      deep: true
    });

    /*
    opts = reactive(Object.assign({
      message,
      type: "primary",
      actions: [],
      dismiss: 3500,
      close,
      stop,
      onClose: () => { },
      onStop: () => { },
      timestamp: Date.now(),
      uuid: v4()
    }, opts));
    */


  },
  computed: {
    list() {

      return this.data.notifications.map((obj) => {

        // "yyyy.mm.dd - HH:MM",
        // "dd.mm.yyyy - HH:MM:ss",
        // split dateformat by dash and seperate date & time
        let [date, time] = this.settings.dateformat.split("-");
        obj.date = dateFormat(obj.timestamp, date);
        obj.time = dateFormat(obj.timestamp, time);

        return obj;

      });

    }
  },
  methods: {
    selectedMenu(menu) {
      this[menu.method]();
    },
    loaded(data) {
      Object.assign(this.data, data);
    },
    clear() {
      this.data.notifications = [];
    },
    removeNotification(index) {
      this.data.notifications.splice(index, 1);
    }
  }
});
</script>


<template>
  <Widget name="Notifications" :menu="menu" @menu="selectedMenu" :uuid="uuid" :data="data" @loaded="loaded">

    <ul class="notification-list">
      <li v-for="(notification, index) in list" :key="index" @click="removeNotification(index)">

        <div class="toast show align-items-center text-white border-0"
          :class="{ 'toast-no-bottom-border-radius': notification.actions.length > 0 }">
          <div class="toast-indicator" :class="'bg-' + notification.type"></div>
          <div class="toast-body">
            <div class="d-block font-bold" v-if="notification?.title">
              {{ notification.title }}
            </div>
            <div style="white-space: pre-line">
              {{ notification.message }}
            </div>
          </div>
          <small class="toast-time">
            <span class="d-block">{{ notification.date }}</span>
            <span class="d-block">{{ notification.time }}</span>
          </small>
        </div>
        <div class="btn-group d-flex">
          <button type="button" class="btn flex-fill" :class="'btn-outline-' + notification.type"
            v-for="(action, index) in notification.actions" :key="index" @click="action.handler($event, notification)">
            {{ action.title }}
          </button>
        </div>
      </li>
    </ul>

  </Widget>
</template>

<style lang="css" scoped>
.btn-group button:nth-child(1) {
  border-top-left-radius: 0;
}

.btn-group button:last-child {
  border-top-right-radius: 0;
}

.btn-group button {
  pointer-events: auto;
  background-color: rgba(0, 0, 0, 0.65);
}

.notification-list {
  width: 100%;
  box-sizing: border-box;
  list-style: none;
  margin: 0;
  padding: 0;
}

.notification-list li {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
}

.toast {
  border-radius: 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #343a40 !important;
  margin-bottom: 1px;
}

.toast-body {
  flex: 1;
  min-width: 0;
  /* verhindert, dass langer Text den Toast aufbläht */
  overflow-wrap: break-word;
}

.toast-time {
  flex-shrink: 0;
  white-space: nowrap;
  text-align: right;
  padding: 0 10px;
  line-height: 1.3;
}

.toast-no-bottom-border-radius {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.toast-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 6px;
  height: 100%;
}

.toast-actions {
  margin: 0;
}

.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(380px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}





.form-control {
  text-transform: uppercase;
}
</style>