<script setup>
//import { settingsStore, widgetStore } from "../store.js";
//const settings = settingsStore(); // why here no .$state?!
//const widgets = widgetStore().$state; // why here .$state and not in settings?
</script>

<script>
import { defineComponent } from "vue";
//import Widget from "../components/Widget.vue";

import { useNotificationStore } from "@dafcoe/vue-notification";
const { setNotification } = useNotificationStore();

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
        setNotification({
          message: `Please fill in your credentials correctly.<br />Login not possible!`,
          type: "alert",
          showIcon: false,
          dismiss: {
            manually: true,
            automatically: true,
          },
          appearance: "dark",
        });
        return;
      }

      let result = await user.login({
        email: email.value,
        password: password.value
      });

      if (result) {

        setNotification({
          message: `Login successfull!`,
          type: "success",
          showIcon: false,
          dismiss: {
            manually: true,
            automatically: true,
          },
          appearance: "dark",
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

        setNotification({
          message: `Login attempt invalid!`,
          type: "alert",
          showIcon: false,
          dismiss: {
            manually: true,
            automatically: true,
          },
          appearance: "dark",
        });

      }

    },
  },
});
</script>

<template>
  <div class="container-fluid">
    <div class="row h-100">
      <!-- LEFT -->
      <div class="col-3 bg-dark border-end" style="border-color: #000 !important">
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
      <div class="col-9" style="background-color: #2e3236">
        <div class="container">
          <div class="row">
            <div class="col-md-4 col-sm-12">
              <div class="login-form">
                <form @submit.prevent="login">
                  <div class="mb-3">
                    <label for="loginEmail" class="form-label">E-Mail address</label>
                    <input type="email" class="form-control bg-dark text-white" style="border-color: #000" name="email"
                      id="loginEmail" />
                  </div>
                  <div class="mb-3">
                    <label for="loginPassword" class="form-label">Password</label>
                    <input type="password" class="form-control bg-dark text-white" style="border-color: #000"
                      name="password" id="loginPassword" />
                  </div>
                  <button type="submit" class="btn btn-outline-primary w-100 d-block">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- RIGHT -->
    </div>
  </div>
</template>

<style scope>
.main-head {
  height: 150px;
  background: #fff;
}

.main {
  padding: 0px 10px;
}

@media screen and (max-height: 450px) {
  .sidenav {
    padding-top: 15px;
  }
}

@media screen and (max-width: 450px) {
  .login-form {
    margin-top: 10%;
  }

  .register-form {
    margin-top: 10%;
  }
}

@media screen and (min-width: 768px) {
  .main {
    margin-left: 40%;
  }

  .sidenav {
    width: 40%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
  }

  .login-form {
    margin-top: 80%;
  }

  .register-form {
    margin-top: 20%;
  }
}

.login-main-text {
  margin-top: 20%;
  padding: 60px;
  color: #fff;
}

.login-main-text h2 {
  font-weight: 300;
}

.btn-black {
  background-color: #000 !important;
  color: #fff;
}
</style>