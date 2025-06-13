import { reactive } from "vue";

const navigation = reactive([{
    path: "/dashboard",
    name: "Dashboard",
    icon: "fas fa-home",
    visible: true,
    component: () => import("../views/Dashboard.vue")
}, {
    path: "/rooms",
    name: "Rooms",
    icon: "fa-solid fa-door-open",
    visible: true,
    component: () => import("../views/Rooms.vue")
}, {
    path: "/endpoints",
    name: "Endpoints",
    icon: "fa-regular fa-lightbulb",
    visible: true,
    component: () => import("../views/Endpoints.vue")
}, {
    path: "/devices",
    name: "Devices",
    icon: "fa-solid fa-tv",
    visible: true,
    component: () => import("../views/Devices.vue")
}, {
    path: "/scenes",
    name: "Scenes",
    icon: "fa-solid fa-clone",
    visible: true,
    component: () => import("../views/Scenes.vue")
},/* {
    path: "/plugins",
    name: "Plugins",
    icon: "fa-solid fa-puzzle-piece",
    visible: true,
    component: () => import("../views/Plugins.vue")
}*/]);

export {
    navigation
};