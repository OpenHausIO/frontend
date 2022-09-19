import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{
    path: "/dashboard",
    name: "Dasboard",
    icon: "fas fa-home",
    component: () => import("../views/Dashboard.vue")
}, {
    path: "/rooms",
    name: "Rooms",
    icon: "fa-solid fa-door-open",
    component: () => import("../views/Rooms.vue")
}, {
    path: "/endpoints",
    name: "Endpoints",
    icon: "fa-regular fa-lightbulb",
    component: () => import("../views/Endpoints.vue")
}, {
    path: "/devices",
    name: "Devices",
    icon: "fa-solid fa-tv",
    component: () => import("../views/Devices.vue")
}/*, {
    path: "/scenes",
    name: "Scenes",
    icon: "fa-solid fa-clone",
    component: () => import("../views/Scenes.vue")
},/* {
    path: "/plugins",
    name: "Plugins",
    icon: "fa-solid fa-puzzle-piece",
    component: () => import("../views/Plugins.vue")
}*/];



const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        ...routes,
        {
            path: "/rooms/:_id",
            name: "/rooms/:_id",
            component: () => import("../views/Room.vue"),
        },
        {
            path: "/endpoints/:_id",
            name: "/endpoints/:_id",
            component: () => import("../views/Endpoint.vue")
        },
        {
            path: "/endpoints/:_id/commands/:_command",
            name: "/endpoints/:_id/commands/:_command",
            component: () => import("../views/Command-parameter.vue")
        },
        {
            path: "/devices/:_id",
            name: "/devices/:_id",
            component: () => import("../views/Device.vue")
        },
        {
            path: "/test",
            name: "/test",
            component: () => import("../views/Test.vue")
        }, {
            path: "/settings",
            name: "Settings",
            icon: "fa fa-gear",
            component: () => import("../views/Settings.vue")
        }, {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            redirect: "/dashboard"
            // use settings.startpage
        }]
});

// https://router.vuejs.org/guide/advanced/navigation-guards.html
router.beforeEach((to, from) => {
    return true;
})

export default router;
export { routes };