<script setup>
//import { RouterLink, RouterView } from "vue-router";
//import HelloWorld from "@/components/HelloWorld.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@dafcoe/vue-notification/dist/vue-notification.css";

import { routes } from "./router";

import { settingsStore } from "./store.js";
const settings = settingsStore();

import { commonStore } from "./store.js";
const common = commonStore();
</script>

<script>
//import { reactive, provide, inject, watch } from "vue";
//import { mapState } from "pinia";

export default {
  name: "Frontend",
  data() {
    return {
      //overlay: false,
      //navbar: false,
    };
  },
  mounted() {
    console.log("App.vue mounted");

    /*
    // draft for #59
    let navItems = document.querySelectorAll("ul.navbar-nav > li.nav-item");
    let elements = Array.from(navItems);

    console.log("Navitems", navItems);

    let widths = elements.map((el) => {
      return el.scrollWidth;
    });

    console.log(widths)

    let maxWidth = Math.max(...widths);

    elements.forEach((el) => {
      //el.style.width = maxWidth;
      el.style.setProperty("width", `${maxWidth}px`);
      console.log("style", el.style)
    });

    console.log(elements);
    */


  },
  methods: {
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input];
      return paths.some((path) => {
        return this.$route.path.indexOf(path) === 0; // current path starts with this path string
      });
    },
  },
  computed: {
    routeEntrys() {
      return routes.filter(({ visible }) => {
        return visible;
      });
    },
  },
};
</script>


<template>
  <!-- OVERLAY -->
  <div v-if="common.overlay" id="overlay" class="text-center">
    <div id="inner">
      <h1>Connection to WebSocket lost</h1>
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden"></span>
      </div>
      <h1>Connecting....</h1>
      <div class="w-25 m-auto">
        <button class="btn btn-outline-primary m-1 w-25" @click="common.overlay = false">Close</button>
        <button class="btn btn-outline-primary m-1 w-25" @click="window.location.reload()">Reload</button>
      </div>
    </div>
  </div>
  <!-- OVERLAY -->

  <!-- NOTIFICATIONS -->
  <div id="notifications">
    <vue-notification-list position="top-right"></vue-notification-list>
  </div>
  <!-- NOTIFICATIONS -->

  <!-- NAVBAR -->
  <!--       border-bottom border-secondary -->
  <nav class="navbar navbar-expand navbar-dark bg-dark sticky-top p-0" style="border-bottom: 1px solid #000"
    v-if="common.navbar">
    <div class="collapse navbar-collapse w-100">
      <ul class="navbar-nav w-100 row m-0">
        <!-- STATIC BACK BUTTON -->
        <!-- set class .fixed-nav-item for small button -->
        <li class="nav-item col text-center p-0" v-if="settings.showBackButton">
          <a class="nav-link" @click="$router.go(-1)">
            <i class="d-block fa-solid fa-chevron-left"></i>
            <span>Back</span>
          </a>
        </li>
        <!-- LINK -->

        <!-- SPACEER -->
        <!-- style="width: 1px; background-color: rgba(0, 0, 0, 0.2)" -->
        <li class="p-0" style="width: 2px; background-color: #000"></li>
        <!-- SPACEER -->
        <!-- STATIC BACK BUTTON -->

        <!-- DYNAMIC LINKS -->
        <RouterLink custom v-bind:to="route.path" v-slot="{ href, navigate, isActive }" v-bind:key="index"
          v-for="(route, index) in routeEntrys">
          <!-- LINK -->
          <li class="nav-item col text-center p-0" :href="href" @click="navigate">
            <a class="nav-link" :class="{ active: isActive || subIsActive(route.path) }">
              <i class="d-block" :class="route.icon"></i>
              <span>{{ route.name }}</span>
            </a>
          </li>
          <!-- LINK -->

          <!-- SPACEER -->
          <li class="p-0" style="width: 2px; background-color: #000"></li>
          <!-- SPACEER -->
        </RouterLink>
        <!-- DYNAMIC LINKS -->

        <!-- STATIC SETTNGS BUTTON -->
        <li class="nav-item col text-center p-0" v-if="settings.showSettingsButton">
          <a class="nav-link" :class="{ active: subIsActive('/settings') }" @click="$router.push({ name: 'Settings' })">
            <i class="d-block fa fa-gear"></i>
            <span>Settings</span>
          </a>
        </li>
        <!-- LINK -->
        <!-- STATIC SETTNGS BUTTON -->
      </ul>
    </div>
  </nav>
  <!-- NAVBAR -->

  <!-- VIEW -->
  <RouterView class="h-100" :class="{ 'force-max-height': !common.navbar }" id="view" />
  <!-- VIEW -->
</template>

<style>
@import "@/assets/base.css";
/*@import "node_modules/bootstrap/dist/css/bootstrap.css";*/

#view {
  /*57 = navbar height */
  max-height: calc(100% - 66px);
  overflow-y: scroll;
}

#overlay {
  position: fixed;
  /* Sit on top of the page content */
  min-width: 100%;
  /* Full width (cover the whole page) */
  min-height: 100%;
  /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  /* Black background with opacity */
  z-index: 9999;
  /* Specify a stack order in case you're using a different order for other elements */
}

#inner {
  margin: 0 auto;
  top: calc(100% - 50px);
}

ul.navbar-nav li a i {
  display: block;
  font-size: 26px;
}

hr {
  border: 0;
  border-top-color: currentcolor;
  border-top-style: none;
  border-top-width: 0px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
}

.nav-link.active {
  /*
    --bs-info-rgb
    --bs-primary-rgb
  */
  color: rgba(var(--bs-primary-rgb), 1) !important;
}

a.nav-link {
  text-transform: uppercase;
  cursor: pointer;
}

.fixed-nav-item {
  width: 100px;
}

#notifications>* {
  z-index: 9999 !important;
}

/*
nav.navbar {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
*/

.notification-list-item--dark {
  background-color: #343a40 !important;
}

.force-max-height {
  min-height: 100% !important;
  max-height: 100% !important;
  height: 100% !important;
}

ul.navbar-nav {
  flex-wrap: nowrap;
  overflow-x: auto
}

ul.navbar-nav li a {
  min-width: 100px;
}
</style>
