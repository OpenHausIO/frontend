<script setup>
//import { settingsStore, widgetStore } from "../store.js";
//const settings = settingsStore(); // why here no .$state?!
//const widgets = widgetStore().$state; // why here .$state and not in settings?
</script>

<script>
import { defineComponent } from "vue";
//import Widget from "../components/Widget.vue";

import { addNotification } from "../components/Notifications.vue";

import router from "../router/index.js";

import { commonStore, settingsStore, userStore } from "../store.js";
const common = commonStore();
const settings = settingsStore();
const user = userStore();

export default defineComponent({
  components: {
    //Widget,
  },
  mounted() {
    common.navbar = false;
  },
  methods: {
    async login(event) {

      let { email, password } = event.target.elements;

      if (!email.value || !password.value) {

        // 3s duration
        addNotification("Please fill in your credentials correctly.<br />Login not possible!", {
          type: "danger",
          dismiss: 3000
        });

        return;

      }

      let result = await user.login({
        email: email.value,
        password: password.value
      });

      if (result) {

        addNotification("Login successfull!", {
          type: "success",
          dismiss: 3000
        });

        setTimeout(() => {

          console.log("Redirect to dashboard");

          // unset only password field
          // keep the E-Mail after logout
          // after a page refresh you have to re enter it anyways
          //email.value = "";
          password.value = "";
          common.navbar = true;

          router.push({
            path: "/dashboard",
          });

        }, 3000);

      } else {

        addNotification("Login attempt invalid!", {
          type: "danger",
          dismiss: false
        });

      }

    },
  },
});
</script>

<template>
  <div class="login-page">
    <div class="row h-100 g-0">

      <!-- LEFT -->
      <div class="col-md-4 col-lg-3 d-none d-md-flex bg-dark border-end login-left"
        style="border-color: #000 !important">
        <div class="login-main-text">
          <h2>OpenHaus</h2>
          <p>SmartHome/IoT solution</p>
          <p>
            Website:
            <a href="https://open-haus.io" target="_blank">open-haus.io</a><br />
            GitHub:
            <a href="https://github.com/OpenHausIO" target="_blank">OpenHausIO</a><br />
          </p>
          <p class="hide">
            Login to your existing account.<br />
            If you dont have any, ask your administrator.
          </p>
        </div>
      </div>
      <!-- LEFT -->

      <!-- RIGHT -->
      <div class="col-12 col-md-8 col-lg-9 login-right" style="background-color: #2e3236">
        <div class="login-form-wrapper">
          <form @submit.prevent="login" class="login-form">
            <div class="mb-3">
              <label for="loginEmail" class="form-label">E-Mail address</label>
              <input type="email" class="form-control bg-dark text-white" style="border-color: #000" name="email"
                id="loginEmail" />
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label">Password</label>
              <input type="password" class="form-control bg-dark text-white" style="border-color: #000" name="password"
                id="loginPassword" />
            </div>
            <button type="submit" class="btn btn-outline-primary w-100 d-block">
              Submit
            </button>
          </form>

          <div class="d-md-none login-footer-text mt-5">
            <p class="mb-1"><strong>OpenHaus</strong> <br />SmartHome/IoT solution</p>
            <p class="mb-0">
              <a href="https://open-haus.io" target="_blank">open-haus.io</a>
              &middot;
              <a href="https://github.com/OpenHausIO" target="_blank">GitHub</a>
            </p>
          </div>
        </div>
      </div>
      <!-- RIGHT -->

    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
}

.login-left {
  align-items: center;
  overflow: hidden;
}

.login-main-text {
  padding: clamp(20px, 6vw, 60px);
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-break: break-word;
}

.login-main-text h2 {
  font-weight: 300;
  font-size: clamp(1.4rem, 3vw, 2rem);
  white-space: normal;
}

.login-main-text p {
  font-size: clamp(0.85rem, 1.4vw, 1rem);
}

.login-right {
  display: flex;
  align-items: center;
  justify-content: start;
  min-height: 100vh;
  padding: 30px 15px;
  box-sizing: border-box;
}

@media screen and (max-width: 767.98px) {
  .login-right {
    justify-content: center;
  }
}

.login-form-wrapper {
  width: 100%;
  max-width: 360px;
}

.btn-black {
  background-color: #000 !important;
  color: #fff;
}

input.form-control {
  border: 1px solid #000;
}

.login-footer-text {
  font-size: 0.8rem;
  color: #aaa;
  text-align: center;
}

.login-footer-text a {
  color: #ccc;
}
</style>