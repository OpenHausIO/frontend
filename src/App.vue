<script setup>
//import { RouterLink, RouterView } from "vue-router";
//import HelloWorld from "@/components/HelloWorld.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { routes } from "./router";
</script>

<script>
export default {
  data() {
    return {
      overlay: false,
    };
  },
  methods: {
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input];
      return paths.some((path) => {
        return this.$route.path.indexOf(path) === 0; // current path starts with this path string
      });
    },
  },
};
</script>


<template>
  <!-- OVERLAY -->
  <div v-if="overlay" id="overlay" class="text-center">
    <div id="inner">
      <h1>Loading...</h1>
    </div>
  </div>
  <!-- OVERLAY -->

  <!-- NAVIGATION -->
  <nav
    class="
      navbar navbar-expand-lg navbar-dark
      bg-dark
      border-bottom border-secondary
      sticky-top
      p-0
    "
    style="max-width: 500px"
  >
    <div class="container-fluid p-0">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a
              class="nav-link h5 m-0 p-3"
              aria-current="page"
              @click="$router.go(-1)"
              >Back</a
            >
          </li>

          <RouterLink
            custom
            v-bind:to="route.path"
            v-slot="{ href, navigate, isActive }"
            v-bind:key="index"
            v-for="(route, index) in routes"
          >
            <li class="nav-item">
              <a
                class="nav-link h5 m-0 p-3"
                aria-current="page"
                :href="href"
                :class="{ active: isActive || subIsActive(route.path) }"
                @click="navigate"
                >{{ route.name }}</a
              >
            </li>
          </RouterLink>
        </ul>
      </div>
    </div>
  </nav>
  <!-- NAVIGATION -->

  <!-- VIEW -->
  <RouterView class="h-100" id="view" />
  <!-- VIEW -->
</template>

<style>
@import "@/assets/base.css";
/*@import "node_modules/bootstrap/dist/css/bootstrap.css";*/

#view {
  /*57 = navbar height */
  max-height: calc(100% - 65px);
  overflow-y: scroll;
}

#overlay {
  position: fixed; /* Sit on top of the page content */
  min-width: 100%; /* Full width (cover the whole page) */
  min-height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9); /* Black background with opacity */
  z-index: 9999; /* Specify a stack order in case you're using a different order for other elements */
}

#inner {
  margin: 0 auto;
  top: calc(100% - 50px);
}

nav {
  overflow-x: scroll;
}

.nav-link {
  text-transform: uppercase;
}
</style>
