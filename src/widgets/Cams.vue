<script>
import { defineComponent } from "vue";
import router, { routes } from "../router/index.js";

export const menu = [];

export default defineComponent({
  name: "Cams",
  data() {
    return {};
  },
  mounted() {
    let hasNavigationElement = routes.find((route) => {
      return route.path === "/cams";
    });

    console.log("Hello from Cams widget");
    if (!hasNavigationElement) {
      let r = {
        name: "Cams",
        path: "/cams",
        icon: "fa-solid fa-video",
        component: () => {
          return {
            template: "<div>cam page</div>",
          };
        },
      };
      router.addRoute(r);
      routes.push(r);
    }
  },
  menu: [],
});
</script>


<template>
  <div>
    <video muted autoplay loop>
      <!--<source src="flower.webm" type="video/webm" />-->
      <source src="http://cam.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<style scope>
video,
source {
  object-fit: fill;
  height: 100%;
  width: 100%;
}
</style>