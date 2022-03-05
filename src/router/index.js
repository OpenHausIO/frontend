import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: "/dashboard",
        name: "/dasboard",
        component: () => import("../views/Dashboard.vue")
    }, {
        path: "/rooms",
        name: "/rooms",
        component: () => import("../views/Rooms.vue")
    }, {
        path: "/rooms/:_id",
        name: "/rooms/:_id",
        component: () => import("../views/Room.vue"),
    }, {
        path: "/endpoints",
        name: "/endpoints",
        component: () => import("../views/Endpoints.vue")
    }, {
        path: "/endpoints/:_id",
        name: "/endpoints/:_id",
        component: () => import("../views/Endpoint.vue")
    }, {
        path: "/endpoints/:_id/commands/:_command",
        name: "/endpoints/:_id/commands/:_command",
        component: () => import("../views/Command-parameter.vue")
    }, {
        path: "/devices",
        name: "/devices",
        component: () => import("../views/Devices.vue")
    }, {
        path: "/devices/:_id",
        name: "/devices/:_id",
        component: () => import("../views/Device.vue")
    }, {
        path: "/test",
        name: "/test",
        component: () => import("../views/Test.vue")
    }, {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        redirect: "/dashboard"
    }]
});

// https://router.vuejs.org/guide/advanced/navigation-guards.html
router.beforeEach((to, from) => {
    return true;
})

export default router;