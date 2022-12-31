import { createApp, watch } from "vue";
import App from "./App.vue";
import router from "./router";
import { routes } from "./router";
import { itemStore, settingsStore } from "./store";


import VueNotificationList from '@dafcoe/vue-notification';
import GridLayout from 'vue3-drr-grid-layout'
import 'vue3-drr-grid-layout/dist/style.css'

import { createPinia } from 'pinia';
const pinia = createPinia();

import { request } from "./helper.js";

import { useNotificationStore } from "@dafcoe/vue-notification";
const { setNotification } = useNotificationStore();


// monkey patch ws
window.events = null;

// persistent handle
// (in localStorage)
pinia.use(({ store, options }) => {
    if (options?.persistent) {

        if (window.localStorage.getItem(store.$id)) {
            console.log("Get item sotre", JSON.parse(window.localStorage.getItem(store.$id)))
            Object.assign(store, JSON.parse(window.localStorage.getItem(store.$id)));
        }

        store.$subscribe((mutation, state) => {
            console.log(`store: ${store.$id} .subscribe`, mutation, JSON.stringify(state));
            window.localStorage.setItem(store.$id, JSON.stringify(state));
        });

    }
});


pinia.use(({ store }) => {
    if (store.$id === "settings") {

        // listen for changes
        // `.watch()` in Settings.vue does not work.
        // see #42
        store.$subscribe((mutation, state) => {

            console.log("mutation", mutation);
            console.log("state", state);

            if (!store.groupItems) {
                store.groupRoomItems = false;
                store.groupEndpointItems = false;
                store.groupDeviceItems = false;
            }

            if (store.showGradientBackground) {
                document.getElementById("app").classList.remove("bg-dark");
                document.getElementById("app").classList.add("gardien-background");
            } else {
                document.getElementById("app").classList.add("bg-dark");
                document.getElementById("app").classList.remove("gardien-background");
            }

            if (!store.showSettingsButton) {
                setNotification({
                    message: "Tap 10x times on any empty space to go to this page again when the settings button is hidden.",
                    type: "info",
                    showIcon: false,
                    dismiss: {
                        manually: true,
                        automatically: false,
                    },
                    appearance: "dark",
                });
            }

            routes.forEach((route) => {
                route.visible = store[`show${route.name}Button`];
            });

        });

        // initial background settings
        if (store.showGradientBackground) {
            document.getElementById("app").classList.remove("bg-dark");
            document.getElementById("app").classList.add("gardien-background");
        } else {
            document.getElementById("app").classList.add("bg-dark");
            document.getElementById("app").classList.remove("gardien-background");
        }

    }
});


// create vue app
const app = createApp(App);

app.config.globalProperties.$window = window;
app.config.globalProperties.$console = console;


app.directive("repeat", {
    mounted(el, binding, vnode, prevVnode) {

        let timeout = null;
        let interval = null;

        el.addEventListener("mousedown", () => {
            timeout = setTimeout(() => {

                interval = setInterval(() => {
                    binding.value.handler(binding.value.command);
                }, binding.value.interval || 1000);

            }, 1000);
        });

        el.addEventListener("mouseup", () => {
            clearInterval(interval);
            clearTimeout(timeout);
        });

    }
});


Promise.all([

    // for DOM to be ready
    new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {

            console.log("[pre] DOM Content ready");

            resolve();

        });
    }),

    // websocket connection to <host>/api/events 
    new Promise((resolve, reject) => {

        console.log(window.location.host)

        let controller = new AbortController();
        let id = setTimeout(() => controller.abort(), 1000);

        let ws = new WebSocket(`ws://${window.location.host}/api/events`);

        console.log("connect to", ws.url);

        ws.onerror = (err) => {
            console.error(err);
            reject(err);
        };

        ws.onclose = () => {
            console.warn(`WebSocket connection ${ws.url} closed`);
        };


        ws.onopen = () => {
            console.log(`WebSocket connection ${ws.url} open`);
            clearTimeout(id);
            resolve();
        };

        ws.json = (data) => {
            return ws.send(JSON.stringify(data));
        };

        ws.onmessage = (msg) => {

            let data = JSON.parse(msg.data);

            //console.log("[EVENT]", data);
            //app.$emit("event", data);

        };

        window.events = ws;

    }),

    // mount vue plugins
    new Promise((resolve, reject) => {
        try {

            app.use(VueNotificationList)
            app.use(router);
            app.use(GridLayout);
            app.use(pinia);

            resolve();

        } catch (e) {

            reject(e);

        }
    }),

    // fetch /api resources
    new Promise((resolve, reject) => {
        Promise.all([
            request("/api/rooms"),
            request("/api/endpoints"),
            request("/api/devices"),
        ]).then(([rooms, endpoints, devices]) => {

            //rooms.forEach(item => window.store.rooms.add(item));
            //endpoints.forEach(item => window.store.endpoints.add(item));
            //devices.forEach(item => window.store.devices.add(item));


            const store = itemStore();

            store.rooms.push(...rooms);
            store.endpoints.push(...endpoints);
            store.devices.push(...devices);

            console.log("[pre] api resrouces fetched");

            resolve();

        }).catch((err) => {

            console.error("Could not fetch api resources", err);

            reject(err);

        });
    })

]).then(() => {

    console.log("Preshit done, mount vue app");


    app.mount("#app");

    let settings = settingsStore();

    // init navbar visibility
    // not reactive, this happens in settings
    routes.forEach((route) => {
        route.visible = settings[`show${route.name}Button`];
    });

    (() => {

        let counter = 0;
        let timer = null

        document.body.addEventListener("click", () => {
            if (!settings.showSettingsButton) {

                clearTimeout(timer);
                counter++;

                timer = setTimeout(() => {
                    console.log("counter reset", counter);
                    counter = 0;
                }, 400);

                if (counter >= 10) {

                    clearTimeout(timer);
                    counter = 0;

                    router.push({
                        path: "/settings"
                    });
                }

            }
        }, true);

    })();


}).catch((err) => {

    alert("Could not start: " + err.message);
    console.warn("Display overlay with error", err);

});