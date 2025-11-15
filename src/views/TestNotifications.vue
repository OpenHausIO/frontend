<template>

  <!--
  <ul class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1050;">

    <li class="toast show align-items-center text-white border-0 mb-2 auto-dismiss">
      <div class="toast-indicator"></div>
      <div class="toast-body">
        Hello Wrodl Message

      </div>
      <div class="btn-group d-flex" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-primary flex-fill">Left</button>
        <button type="button" class="btn btn-outline-primary flex-fill">Middle</button>
        <button type="button" class="btn btn-outline-primary flex-fill">Right</button>
      </div>
    </li>

  </ul>
  -->


  <TransitionGroup name="list" tag="ul" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1050;">

    <li v-for="(notification, index) in notifications" :key="index" @click="removeNotification(index)" class="mb-2"
      :class="{ 'auto-dismiss': notification.dismiss }">
      <div class="toast align-items-center text-white border-0"
        :class="{ 'toast-no-bottom-border-radius': notification.actions.length > 0 }">
        <div class="toast-indicator" :style="{ 'animation-duration': `${notification.dismiss}ms` }"
          :class="'bg-' + notification.type"></div>
        <div class="toast-body" v-html="notification.message"></div>
      </div>
      <div class="btn-group d-flex">
        <button type="button" class="btn flex-fill" :class="'btn-outline-' + notification.type"
          v-for="(action, index) in notification.actions" :key="index" @click="action.handler($event, notification)">
          {{ action.title }}
        </button>
      </div>
    </li>

  </TransitionGroup>

  <Modal :visible="isModalVisible" @close="onCloseModal" @confirm="onModalConfirm" title="Enter pairing pin">
    <template #body>

      <div class="d-flex justify-content-center">
        <input type="text" class="form-control bg-dark text-primary text-center" placeholder="0" maxlength="1"
          ref="pin1" @input="moveFocus($event, 1)" style="font-size:40px">
        <span style="font-size: 50px" class="m-2">•</span>
        <input type="text" class="form-control bg-dark text-primary text-center" placeholder="8" maxlength="1"
          ref="pin2" @input="moveFocus($event, 2)" style="font-size:40px">
        <span style="font-size: 50px" class="m-2">•</span>
        <input type="text" class="form-control bg-dark text-primary text-center" placeholder="1" maxlength="1"
          ref="pin3" @input="moveFocus($event, 3)" style="font-size:40px">
        <span style="font-size: 50px" class="m-2">•</span>
        <input type="text" class="form-control bg-dark text-primary text-center" placeholder="5" maxlength="1"
          ref="pin4" @input="moveFocus($event, 4)" style="font-size:40px">
      </div>

    </template>
  </Modal>

</template>

<script>
import { defineComponent, reactive } from 'vue';
import Modal from "../components/Modal.vue";

export default defineComponent({
  name: "Notification",
  components: {
    Modal
  },
  data() {
    return {
      notifications: [],
      isModalVisible: false,
      pin: ['', '', '', '']
    };
  },
  methods: {
    addNotification(message, opts) {

      let timeout = null;

      let close = () => {
        if (this.notifications.length > 0) {

          let index = this.notifications.findIndex((n) => {
            return n.message === opts.message;
          });

          this.removeNotification(index);

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
        type: "primary",
        actions: [],
        dismiss: 3500,
        close,
        stop,
        onClose: () => { },
        onStop: () => { }
      }, opts));

      this.notifications.push(opts);

      if (opts.dismiss) {
        timeout = setTimeout(close, opts.dismiss);
      }

      return opts;

    },
    removeNotification(index) {
      this.notifications.splice(index, 1);
    },
    onCloseModal() {
      this.isModalVisible = false;
    },
    onModalConfirm() {
      this.isModalVisible = false;
    },
    moveFocus(event, nextIndex) {
      if (new RegExp('^[0-9,a-z]$').test(event.data) && event.inputType === "insertText") {
        if (nextIndex < this.pin.length) {
          this.$refs[`pin${nextIndex + 1}`].focus();
        }
      } else {
        this.$refs[`pin${nextIndex}`].value = "";
      }
    }
  },
  mounted() {

    ["primary",/* "success", "warning", "danger", "dark", "light"*/].forEach((color, i) => {

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


    /*
    ["info", "primary", "success", "warning", "danger"].forEach((color, i) => {
      setTimeout(() => {
        this.addNotification(`Sample notification #${i}`, {
          type: color
        });
      }, i * 5000);
    });
    */


    /*
    setTimeout(() => {
      this.addNotification(`<b>Plese enter device pairing pin</b>`);
    }, 3000);
    */


  },
});
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
  background-color: rgba(0, 0, 0, 0.2);
  */
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
