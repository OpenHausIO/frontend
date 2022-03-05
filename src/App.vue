<script setup>
//import { RouterLink, RouterView } from "vue-router";
//import HelloWorld from "@/components/HelloWorld.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
</script>

<script>
export default {
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

  <RouterView class="mt-4" />
</template>

<style>
@import "@/assets/base.css";
/*@import "node_modules/bootstrap/dist/css/bootstrap.css";*/

html,
body {
  min-height: 100%;
  min-width: 100%;
}
</style>
