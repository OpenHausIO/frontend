<template>
  <TransitionGroup name="list" tag="ul" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">

    <li v-for="(notification, index) in notifications" :key="index" @click="removeNotification(index)" class="mb-2"
      :class="{ 'auto-dismiss': notification.dismiss }">
      <div class="toast show align-items-center text-white border-0"
        :class="{ 'toast-no-bottom-border-radius': notification.actions.length > 0 }">
        <div class="toast-indicator" :style="{ 'animation-duration': `${notification.dismiss}ms` }"
          :class="'bg-' + notification.type"></div>
        <div class="toast-body">
          <div class="d-block font-bold" v-if="notification?.title">
            {{ notification.title }}
          </div>
          <div style="white-space: pre-line">
            {{ notification.message }}
          </div>
        </div>
      </div>
      <div class="btn-group d-flex">
        <button type="button" class="btn flex-fill" :class="'btn-outline-' + notification.type"
          v-for="(action, index) in notification.actions" :key="index" @click="action.handler($event, notification)">
          {{ action.title }}
        </button>
      </div>
    </li>

  </TransitionGroup>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { v4 } from "uuid";

const notifications = reactive([]);

const removeNotification = (index) => {
  notifications.splice(index, 1);
};

const addNotification = (message, opts) => {

  let timeout = null;

  let close = () => {
    if (notifications.length > 0) {

      let index = notifications.findIndex((n) => {
        //return /*n.message === opts.message &&*/ n.timestamp === opts.timestamp;
        return n.uuid === opts.uuid;
      });

      removeNotification(index);

      opts.onClose();

    }
  };

  let stop = () => {

    opts.dismiss = false;
    clearTimeout(timeout);

    opts.onStop();

  };

  opts = reactive(Object.assign({
    message,
    title: null,
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

  notifications.push(opts);

  if (opts.dismiss) {
    timeout = setTimeout(close, opts.dismiss);
  }

  return opts;
};

export default defineComponent({
  name: "Notification",
  data() {
    return {
      notifications
    };
  },
  methods: {
    addNotification,
    removeNotification
  },
  mounted() {

    /*
    ["primary", "success", "warning", "danger", "dark", "light"].forEach((color, i) => {

        let interval = null;
        let counter = 1;

        let msg = this.addNotification(`<b>Plese enter device pairing pin</b><br />To complete the integration, enter the pairing pin: ${counter++}`, {
            dismiss: false,
            type: color,
            actions: [{
                title: "Enter",
                handler: (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    msg.stop();
                    this.isModalVisible = true;
                },
            }, {
                title: "Later",
                handler: (event, { close }) => {
                    event.stopPropagation();
                    event.preventDefault();
                    close();
                },
            }],
            onClose() {
                clearInterval(interval);
            },
            onStop() {
                alert("auto close stopped");
            }
        });


        interval = setInterval(() => {
            console.log("Update counter")
            msg.message = `<b>Plese enter device pairing pin</b><br />To complete the integration, enter the pairing pin: ${counter++}`;
        }, 1000);

    });
    */

  },
});

export {
  addNotification,
  removeNotification,
  notifications
};

</script>

<style scoped>
.btn-group button:nth-child(1) {
  border-top-left-radius: 0;
}

.btn-group button:last-child {
  border-top-right-radius: 0;
}

.btn-group button {
  pointer-events: auto;
  /*
  border: 2px solid #000;
  border-top: 0;
  */
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
}

.toast-container {
  width: 380px;
  list-style: none;
}

.toast {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #343a40 !important
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

li.auto-dismiss>div.toast>.toast-indicator {
  animation: progress 2.4s linear forwards;
}

@keyframes progress {
  0% {
    height: 100%;
  }

  100% {
    height: 0;
  }
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
