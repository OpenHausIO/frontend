import { createRouter, createWebHashHistory } from "vue-router";
import { reactive } from "vue";
import { commonStore } from "../store.js";

const viewSettings = import("../views/Settings.vue");
/*disable lazy loading of settings page*/ 

const routes = reactive([{
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
        }, {
            path: "/test",
            name: "/test",
            component: () => import("../views/Test.vue")
        }, {
            path: "/test/tile",
            name: "/test/tile",
            component: () => import("../views/TestTile.vue")
        }, {
            path: "/test/chart",
            name: "/test/chart",
            component: () => import("../views/TestChart.vue")
        }, {
            path: "/test/updateIndicator",
            name: "/test/updateIndicator",
            component: () => import("../views/TestUpdateIndicator.vue")
        }, {
            path: "/test/grid",
            name: "/test/grid",
            component: () => import("../views/TestGrid.vue")
        }, {
            path: "/test/grid2",
            name: "/test/grid2",
            component: () => import("../views/TestGrid2.vue")
        }, {
            path: "/test/grid3",
            name: "/test/grid3",
            component: () => import("../views/TestGrid3.vue")
        }, {
            path: "/test/notifications",
            name: "/test/notifications",
            component: () => import("../views/TestNotifications.vue")
        }, {
            path: "/test/props",
            name: "/test/props",
            component: () => import("../views/TestProps.vue")
        }, {
            path: "/test/modal",
            name: "/test/modal",
            component: () => import("../views/TestModal.vue")
        }, {
            path: "/settings",
            name: "Settings",
            icon: "fa fa-gear",
            component: viewSettings
        }, {
            path: "/auth/login",
            name: "Login",
            component: () => import("../views/Login.vue")
        }, {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            redirect: "/dashboard"
            // use settings.startpage
        }]
});

// https://router.vuejs.org/guide/advanced/navigation-guards.html
router.beforeEach(async (to, from) => {

    // https://pinia.vuejs.org/core-concepts/outside-component-usage.html#single-page-applications
    let common = commonStore();
    let checked = sessionStorage.getItem("authenticated");
    let token = localStorage.getItem("x-auth-token");

    if (checked !== "true" && to.fullPath !== "/auth/login") {

        // do http request to /auth and check response code
        // if status code = 200, set authencited = true
        // if != 200 set to false & redirect

        let authenticated = await fetch("/auth/check", {
            headers: {
                "x-auth-token": token
            }
        }).then((response) => {
            console.log(response.status)
            return response.status === 200 || response.status === 404;
        });

        if (authenticated) {

            common.authenticated = true;
            sessionStorage.setItem("authenticated", true);
            return true;

        } else {

            localStorage.removeItem("x-auth-token");
            sessionStorage.removeItem("authenticated");

            router.replace({
                path: "/auth/login"
            });

        }

    } else {
        return true;
    }

});

export default router;
export { routes };