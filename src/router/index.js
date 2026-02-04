import { createRouter, createWebHashHistory } from "vue-router";
import { commonStore, userStore } from "../store.js";

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

router.beforeEach(async (to, from, next) => {

    console.log("Bevore enter", to);

    const user = userStore();
    //const common = commonStore();

    const isAuthRoute = to.fullPath.startsWith("/auth");
    const isLoginRoute = to.fullPath === "/auth/login";

    await user.checkAuth();

    if (isLoginRoute && to.query.clean === "true") {
        return next();
    }
    if (isAuthRoute) {
        return next();
    }

    console.log("isAuthenticated", user.isAuthenticated);

    if (user.isAuthenticated) {
        return next();
    }

    next("/auth/login");

});

export default router;
export {
    navigation as routes,
    navigation,
    nested,
    test
};