const test = [{
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
}];

export {
    test
};