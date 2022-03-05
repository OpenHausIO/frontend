<script setup>
//import { RouterLink, RouterView } from "vue-router";
//import HelloWorld from "@/components/HelloWorld.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
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
    "
  >
    <div class="container-fluid">
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
            <a class="nav-link" aria-current="page" @click="$router.go(-1)"
              >Back</a
            >
          </li>

          <RouterLink
            custom
            to="/dashboard"
            v-slot="{ href, navigate, isActive }"
          >
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                :href="href"
                :class="{ active: isActive }"
                @click="navigate"
                >Dashboard</a
              >
            </li>
          </RouterLink>

          <RouterLink custom to="/rooms" v-slot="{ href, navigate, isActive }">
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                :href="href"
                :class="{ active: isActive || subIsActive('/rooms') }"
                @click="navigate"
                >Rooms</a
              >
            </li>
          </RouterLink>

          <RouterLink
            custom
            to="/endpoints"
            v-slot="{ href, navigate, isActive }"
          >
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                :href="href"
                :class="{ active: isActive || subIsActive('/endpoints') }"
                @click="navigate"
                >Endpoints</a
              >
            </li>
          </RouterLink>

          <RouterLink
            custom
            to="/devices"
            v-slot="{ href, navigate, isActive }"
          >
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                :href="href"
                :class="{ active: isActive || subIsActive('/devices') }"
                @click="navigate"
                >Devices</a
              >
            </li>
          </RouterLink>

          <RouterLink custom to="/test" v-slot="{ href, navigate, isActive }">
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                :href="href"
                :class="{ active: isActive }"
                @click="navigate"
                >Test</a
              >
            </li>
          </RouterLink>
        </ul>
      </div>
    </div>
  </nav>
  <!-- NAVIGATION -->

  <!-- VIEW -->
  <RouterView class="mt-4" />
  <!-- VIEW -->
</template>

<style>
@import "@/assets/base.css";
/*@import "node_modules/bootstrap/dist/css/bootstrap.css";*/

html,
body {
  min-height: 100%;
  min-width: 100%;
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
</style>
