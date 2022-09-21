import { createApp, watch } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import { request } from "./helper.js";

import VueNotificationList from '@dafcoe/vue-notification';
import GridLayout from 'vue3-drr-grid-layout'
import 'vue3-drr-grid-layout/dist/style.css'

import { createPinia } from 'pinia';
const pinia = createPinia();

// monkey patch ws
window.events = null;

pinia.use(({ store }) => {

    if (window.localStorage.getItem("settings")) {
        Object.assign(store, JSON.parse(window.localStorage.getItem("settings")));
    }

    store.$subscribe(() => {
        window.localStorage.setItem("settings", JSON.stringify(store));
    });

    // initial background settings
    // TODO: Find a better way
    if (store.showGradientBackground) {
        document.getElementById("app").classList.remove("bg-dark");
        document.getElementById("app").classList.add("gardien-background");
    } else {
        document.getElementById("app").classList.add("bg-dark");
        document.getElementById("app").classList.remove("gardien-background");
    }

});


// create vue app
const app = createApp(App);

app.config.globalProperties.$window = window;
app.config.globalProperties.$console = console;





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

            console.log("[EVENT]", data);
            //app.$emit("event", data);

        };

        window.events = ws;

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

    app.use(VueNotificationList)
    app.use(router);
    app.use(GridLayout);
    app.use(pinia);
    app.mount("#app");


    (() => {

        let counter = 0;
        let timer = null

        document.body.addEventListener("click", () => {

            clearTimeout(timer);
            counter++;

            timer = setTimeout(() => {
                console.log("counter reset", counter);
                counter = 0;
            }, 600);

            if (counter >= 10) {

                clearTimeout(timer);
                counter = 0;

                router.push({
                    path: "/settings"
                });
            }

        }, true);

    })();


}).catch((err) => {

    alert("Could not start: " + err.message);
    console.warn("Display overlay with error", err);

});