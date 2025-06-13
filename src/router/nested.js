const nested = [{
    path: "/rooms/:_id",
    name: "/rooms/:_id",
    component: () => import("../views/Room.vue"),
}, {
    path: "/endpoints/:_id",
    name: "/endpoints/:_id",
    component: () => import("../views/Endpoint.vue")
}, {
    path: "/endpoints/:_id/commands/:_command",
    name: "/endpoints/:_id/commands/:_command",
    component: () => import("../views/Command-parameter.vue")
}, {
    path: "/devices/:_id",
    name: "/devices/:_id",
    component: () => import("../views/Device.vue")
}, {
    path: "/settings",
    name: "Settings",
    icon: "fa fa-gear",
    component: () => import("../views/Settings.vue")
}, {
    path: "/auth/login",
    name: "Login",
    component: () => import("../views/Login.vue")
}, {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/dashboard"
}];

export {
    nested
};