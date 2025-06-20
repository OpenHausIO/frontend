import { createApp, watch } from "vue";
import App from "./App.vue";
import router from "./router";
import { routes } from "./router";
//import router from "./router";
import { createPinia } from 'pinia';
const pinia = createPinia();

import { itemStore, settingsStore, commonStore } from "./store";

// override console log when not on local machine
if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    console.log = () => { };
}

import VueNotificationList from '@dafcoe/vue-notification';
import GridLayout from 'vue3-drr-grid-layout'
import 'vue3-drr-grid-layout/dist/style.css'


import { request } from "./helper.js";

import { useNotificationStore } from "@dafcoe/vue-notification";
const { setNotification } = useNotificationStore();


// monkey patch ws
window.events = null;

// persistent handle
// (in localStorage)
pinia.use(({ store, options }) => {
    if (options?.persistent) {

        //console.log("Store asdfasdfasfdasdfasfda", store.$state);

        if (window.localStorage.getItem(store.$id)) {
            //console.log("Get item sotre", JSON.parse(window.localStorage.getItem(store.$id)))
            Object.assign(store.$state, JSON.parse(window.localStorage.getItem(store.$id)));
        }

        store.$subscribe((mutation, state) => {
            //console.log(`store: ${store.$id} .subscribe`, mutation, JSON.stringify(state));
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

app.config.globalProperties.window = window;
app.config.globalProperties.console = console;

app.use(VueNotificationList);
app.use(pinia);
app.use(router);
app.use(GridLayout);


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



const settings = settingsStore();
const common = commonStore();


function fetchData() {
    return new Promise((resolve, reject) => {
        Promise.all([
            request("/api/rooms"),
            request("/api/endpoints"),
            request("/api/devices"),
            request("/api/scenes"),
        ]).then(([rooms, endpoints, devices, scenes]) => {

            const store = itemStore();

            store.rooms = rooms;
            store.endpoints = endpoints;
            store.devices = devices;
            store.scenes = scenes;

            console.log("API resrouces fetched");

            resolve();

        }).catch((err) => {

            console.error("Could not fetch api resources", err);

            reject(err);

        });
    });
}

function connectToEvents(options = { retry: 0 }) {
    return new Promise((resolve, reject) => {

        // fix #119, see:
        // https://github.com/OpenHausIO/backend/issues/403
        let events = ["add", "update", "remove"].map((intent) => {
            return `events[]=${intent}`;
        }).join("&");

        let components = ["rooms", "scenes", "devices", "endpoints"].map((intent) => {
            return `components[]=${intent}`;
        }).join("&");

        let proto = window.location.protocol === "https:" ? "wss://" : "ws://";

        let ws = new WebSocket(`${proto}${window.location.host}/api/events?${events}&${components}&x-auth-token=${localStorage.getItem("x-auth-token")}`);

        console.log("Try to connect:", ws.url);

        ws.onerror = (err) => {
            console.error(err);
            reject(err);
        };

        ws.onclose = () => {

            console.warn(`WebSocket connection ${ws.url} closed`);

            if (settings.showOverlayForConnectionLost) {
                common.overlay = true;
            }

            if (options.retry <= 3) {
                setTimeout(async () => {
                    try {
                        console.log("Retry connection to:", ws.url, options)
                        options.retry += 1;
                        await connectToEvents(options);
                    } catch (err) {
                        console.error(err);
                    }
                }, 1000);
            } else {

                setNotification({
                    message: "<h5>Initial Error:</h5>Could not connect to WebSocket",
                    type: "alert",
                    showIcon: false,
                    dismiss: {
                        manually: true,
                        automatically: false,
                    },
                    appearance: "dark",
                });

                throw new Error("Retry attempts exceede");

            }

        };


        ws.onopen = () => {
            console.warn(`WebSocket connection ${ws.url} open`);
            options.retry = 0;
            common.overlay = false;
            resolve();
        };

        ws.json = (data) => {
            return ws.send(JSON.stringify(data));
        };

        const store = itemStore();

        ws.onmessage = (msg) => {
            try {

                let data = JSON.parse(msg.data);
                let valid = 1;

                valid &= ["add", "remove", "update"].includes(data.event);
                valid &= ["endpoints", "rooms", "devices", "scenes"].includes(data.component);
                valid &= Object.prototype.hasOwnProperty.call(store, data.event);
                valid &= store[data.event] instanceof Function;

                //console.log("Handle websocket message", data, valid)

                if (valid) {
                    store[data.event](data.component, data.args[0]);
                } else {
                    // TODO: remove warning
                    console.warn("Handling condition failed. Methods:",
                        ["add", "remove", "update"].includes(data.event),
                        "Component:", ["endpoints", "rooms", "devices"].includes(data.component),
                        "hasOwnProperty:", Object.prototype.hasOwnProperty.call(store, data.event),
                        "instanceof function:", store[data.event] instanceof Function);
                }

            } catch (err) {
                console.error("Could not handle message", err);
            }
        };

        window.events = ws;

    })
}


Promise.all([

    // for DOM to be ready
    new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {

            console.log("[pre] DOM Content ready");

            resolve();

        });
    }),

]).then(() => {
    return new Promise(async (resolve, reject) => {

        console.log("[pre] Check authenticated");

        // stores
        //let settings = settingsStore();
        //let common = commonStore();

        common.authenticated = (sessionStorage.getItem("authenticated") == "true");

        if (common.authenticated) {

            // authenticated
            // fetch stuff & show navbar
            await fetchData();
            await connectToEvents();

            common.navbar = true;

        } else {

            // wait for store changes
            // then proceed with loading stuff
            console.log("[pre] Wait for store changed");

            common.$subscribe(async (mutation, state) => {

                console.log(mutation, state)

                // TODO Move this to a "global middleware" where set/get local/session-storage
                sessionStorage.setItem("authenticated", state.authenticated);
                // localStorage.setItem("x-auth-token", state["x-auth-token"]);

                if (state.authenticated) {

                    console.log("[pre] store changed, authenciated", mutation, state);

                    await fetchData();
                    await connectToEvents();

                    common.navbar = true;

                }

            });



        }

        resolve();

    });
}).then(() => {

    console.log("[pre] mount application");

    app.mount("#app");


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

    console.error(err);
    alert("Could not start: " + err);

});