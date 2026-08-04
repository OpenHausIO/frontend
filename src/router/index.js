import { createRouter, createWebHashHistory } from "vue-router";
import { commonStore, userStore } from "../store.js";

import { navigation } from "./navigation.js";
import { nested } from "./nested.js";
import { test } from "./test.js";
import { watch } from "vue";

const routes = [
    ...navigation,
    ...nested,
    ...test
];


watch(navigation, () => {
    navigation.forEach((route) => {
        if (!router.hasRoute(route.name)) {
            router.addRoute(route);
        }
    });
}, {
    deep: true
});


const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach(async (to, from) => {

    //console.log("Bevore enter", to);

    const user = userStore();
    //const common = commonStore();

    const isAuthRoute = to.fullPath.startsWith("/auth");
    const isLoginRoute = to.fullPath === "/auth/login";

    await user.checkAuth();

    if (isLoginRoute && to.query.clean === "true") {
        return true;
    }
    if (isAuthRoute) {
        return true;
    }

    //console.log("isAuthenticated", user.isAuthenticated);

    if (user.isAuthenticated) {
        return true;
    }

    return "/auth/login";

});

export default router;
export {
    navigation as routes,
    navigation,
    nested,
    test
};