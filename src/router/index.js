import { createRouter, createWebHashHistory } from "vue-router";
import { commonStore } from "../store.js";

import { navigation } from "./navigation.js";
import { nested } from "./nested.js";
import { test } from "./test.js";

const routes = [
    ...navigation,
    ...nested,
    ...test
];


const router = createRouter({
    history: createWebHashHistory(),
    routes
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
export {
    navigation as routes,
    navigation,
    nested,
    test
};