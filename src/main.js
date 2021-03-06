import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import { request } from "./helper.js";


// monkey patch ws
window.events = null;



// create vue app
const app = createApp(App);


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

    app.use(router);
    app.mount("#app");

}).catch((err) => {

    alert("Could not start: " + err.message);
    console.warn("Display overlay with error", err);

});