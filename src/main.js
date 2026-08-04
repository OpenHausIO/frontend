import { createApp } from "vue";
import * as Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { routes, navigation } from "./router";
//import router from "./router";
import { createPinia } from 'pinia';
const pinia = createPinia();

import { itemStore, settingsStore, commonStore, userStore } from "./store";
import { addNotification } from "./components/Notifications.vue";
import { request, openDatabase } from "./helper.js";

import { visibility, statusText } from "./components/Splashscreen.vue";


// override console log when not on local machine
if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    console.log = () => { };
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}

window.deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();
    window.deferredPrompt = e;

});


// monkey patch ws
window.events = null;
window.notifications = null;
window.settings = {};

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

        store.$subscribe((mutation, state) => {

            console.log("mutation", mutation);
            console.log("state", state);

            if (!state.groupItems) {
                state.groupRoomItems = false;
                state.groupEndpointItems = false;
                state.groupDeviceItems = false;
            }

            if (state.showGradientBackground) {
                document.getElementById("app").classList.remove("bg-dark");
                document.getElementById("app").classList.add("gardien-background");
            } else {
                document.getElementById("app").classList.add("bg-dark");
                document.getElementById("app").classList.remove("gardien-background");
            }

            if (!state.navigation.showSettingsButton) {
                addNotification("Tap 10x times on any empty space to go to this page again when the settings button is hidden.", {
                    type: "primary",
                    dismiss: 3000
                });
            }

            // GEÄNDERT: liest jetzt aus state.navigation
            routes.forEach((route) => {
                route.visible = state.navigation[`show${route.name}Button`];
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

//app.use(VueNotificationList);
app.use(pinia);
app.use(router);

window.Vue = Vue;
window.app = app;
window.pinia = pinia;


const settings = settingsStore();
const common = commonStore();
const user = userStore();

app.directive("repeat", {
    mounted(el, binding) {

        let timeout = null;
        let interval = null;
        let isPressed = false;

        const clearTimers = () => {
            clearTimeout(timeout);
            clearInterval(interval);
            timeout = null;
            interval = null;
        };

        const onMouseDown = () => {

            isPressed = true;

            if (!settings.repeatCommand) {
                binding.value.handler(binding.value.command);
                return;
            }

            timeout = setTimeout(() => {
                if (!isPressed) return;

                interval = setInterval(() => {
                    binding.value.handler(binding.value.command);
                }, binding.value.interval || 1000);

            }, 1000);

        };

        const onMouseUp = () => {
            isPressed = false;
            clearTimers();
        };

        el.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        el._repeatCleanup = () => {
            clearTimers();
            el.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
        };

    },
    unmounted(el) {
        el?._repeatCleanup();
    }
});



function fetchData() {
    return new Promise((resolve, reject) => {

        // spashscreen status text
        statusText("Fetch component items");

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

            // THIS IS NEVER REACHED!!!!
            // TODO: redirect here to login page or show error message (based on http response)?

            console.error("Could not fetch api resources", err);

            reject(err);

        });

    });
}

function connectToEvents(options = { retry: 0 }) {
    return new Promise((resolve, reject) => {

        statusText("Connect to WebSocket events");

        // fix #119, see:
        // https://github.com/OpenHausIO/backend/issues/403
        // command = draft for sync between browsers / clients
        let events = ["add", "update", "remove"/*, "command"*/].map((intent) => {
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

            window.events = null;

            console.warn(`WebSocket connection ${ws.url} closed`);

            if (settings.showOverlayForConnectionLost) {
                //common.overlay = true;
                visibility(true);
                statusText("Connection to WebSocket lost, reconnect");
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
                }, 3000);
            } else {

                addNotification("<h5>Initial Error:</h5>Could not connect to WebSocket", {
                    type: "danger",
                    dismiss: false
                });

                throw new Error("Retry attempts exceede");

            }

        };


        ws.onopen = () => {
            console.warn(`WebSocket connection ${ws.url} open`);

            // otherwise the splashscreen is closed on init request
            if (options.retry > 0) {
                visibility(false);
            }

            options.retry = 0;
            //common.overlay = false;
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

                valid &= ["add", "remove", "update", "command"].includes(data.event);
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

function connectToNotifications(options = { retry: 0 }) {
    return new Promise((resolve, reject) => {

        // use needs admin rights
        // notifications is protected by "/system" route
        if (!user.isAdmin) {
            return resolve();
        }

        // prevents race condition setting status text
        // "notifications" are not so important
        if (window.events) {
            statusText("Connect to Notifications");
        }

        let proto = window.location.protocol === "https:" ? "wss://" : "ws://";
        let ws = new WebSocket(`${proto}${window.location.host}/api/system/notifications?x-auth-token=${localStorage.getItem("x-auth-token")}`);

        console.log("Try to connect:", ws.url);

        ws.addEventListener("error", (err) => {
            console.error(err);
            reject(err);
        });

        ws.addEventListener("close", () => {

            console.warn(`WebSocket connection ${ws.url} closed`);

            if (options.retry <= 3) {
                setTimeout(async () => {
                    try {
                        console.log("Retry connection to:", ws.url, options)
                        options.retry += 1;
                        await connectToNotifications(options);
                    } catch (err) {
                        console.error(err);
                    }
                }, 3000);
            } else {

                console.error(`Could not connect to Notifications WebSocket "${ws.url}"`);
                throw new Error("Retry attempts exceede");

            }

        });

        ws.addEventListener("open", () => {
            console.warn(`WebSocket connection ${ws.url} open`);
            options.retry = 0;
            resolve();
        });


        ws.addEventListener("message", (msg) => {
            if (settings.showNotifications) {
                try {

                    let data = JSON.parse(msg.data);

                    let type = "info";

                    switch (data.type) {
                        case "info": type = "primary"; break;
                        case "warn": type = "warning"; break;
                        case "error": type = "danger"; break;
                        case "success": type = "success"; break;
                        default: type = "info"; break;
                    }

                    let obj = {
                        message: `<b>${data.title}</b><br />${data.message}`,
                        type,
                        dismiss: false
                    };

                    if (settings.permissionsNotifications) {

                        let notification = new Notification(`OpenHaus - ${data.title}`, {
                            body: data.message,
                            icon: "/favicon.png",
                            requireInteraction: false,
                            silent: false
                        });

                        notification.addEventListener("error", (err) => {

                            console.error("❌ Notification error:", err);

                            addNotification(obj.message, obj);

                        });

                    } else {

                        addNotification(obj.message, obj);

                    }

                } catch (err) {
                    console.error("Could not handle message", err);
                }
            }
        });

        window.notifications = ws;

    });
}


Promise.all([

    // for DOM to be ready
    new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {

            console.log("[pre] DOM Content ready");

            app.mount("#app");

            resolve();

        });
    }),

    // fetch settings.json
    new Promise(async (resolve, reject) => {
        try {

            // spashscreen status text
            statusText("Load settings.json");

            const url = new URL("settings.json", window.location.href);
            const res = await fetch(url, {
                cache: "no-store"
            });

            if (res.status === 404) {
                console.log("[pre] Keine settings.json gefunden, überspringe custom config");
                resolve();
            }

            if (!res.ok) {
                console.warn("[pre] settings.json konnte nicht geladen werden:", res.status, res.statusText);
            }

            window.settings = await res.json();

            resolve();

        } catch (err) {
            console.warn("[pre] settings.json konnte nicht geladen/geparsed werden", err);
            resolve();
        }
    }),

]).then(() => {
    return new Promise((resolve) => {

        statusText("Apply Server Settings");

        if (window.settings?.navigation) {
            window.settings.navigation.forEach((route) => {

                //settings[`show${route.name}Button`] = route.visible ?? true;
                settings.navigation[`show${route.name}Button`] = route.visible ?? true;

                navigation.push({
                    path: route.path ?? "/dashboard",
                    name: route.name ?? "Default",
                    icon: route.icon ?? "fa-solid fa-circle-question",
                    visible: settings[`show${route.name}Button`],
                    props: () => {
                        return {
                            src: route.url
                        };
                    },
                    component: () => import("./components/Iframe.vue")
                });

            });
        }

        resolve();

    });
}).then(() => {
    return new Promise(async (resolve, reject) => {

        // spashscreen status text
        statusText("Check Authentication");

        await user.checkAuth();

        console.log("[pre] Check authenticated", user.isAuthenticated);

        // stores
        //let settings = settingsStore();
        //let common = commonStore();

        if (user.isAuthenticated) {

            // authenticated
            // fetch stuff & show navbar
            await fetchData();
            await connectToEvents();
            await connectToNotifications();

            common.navbar = true;

        } else {

            // wait for store changes
            // then proceed with loading stuff
            console.log("[pre] Wait for store changed");

            user.$subscribe(async (mutation, state) => {

                console.log(mutation, state)

                if (state.authenticated.value) {

                    console.log("[pre] store changed, authenciated", mutation, state);

                    await fetchData();
                    await connectToEvents();
                    await connectToNotifications();

                    common.navbar = true;

                }
            });

        }

        resolve();

    });
}).then(() => {

    return Promise.resolve();

    // splashscreen status text
    statusText("Fetch plugin manifests");

    // THIS LODS PLUGINS SCRIPTS DYNMACLIY FROM THE BACKEND
    // DO NOT ENABLE IN PRODUCTION!
    // THIS IS A DRAFT - AND NOT PRODUCTION READY
    return request("/api/plugins/manifests").then((manifests) => {

        let prmoises = manifests.map(({ url, components }) => {
            return new Promise(async (resolve, reject) => {

                // splashscreen status text
                statusText(`Load plugin "${url}"`);

                console.log("Load externe JS", url);

                /*
                import(url).then((module) => {

                    console.log("Module", module);

                    const CounterComponent = module.default
                    app.component('CounterComponent', CounterComponent);

                })
                */

                let load = (url) => {
                    return new Promise((resolve, reject) => {

                        if (document.querySelector(`script[src="${url}"]`)) {
                            resolve();
                            return;
                        }

                        const script = document.createElement('script');

                        script.type = 'text/javascript';
                        //script.type = "module";
                        script.src = url;
                        script.onload = resolve;
                        script.onerror = reject;

                        document.head.appendChild(script);

                    });
                }

                await load(url);

                components.forEach((url) => {
                    load(url);
                });

                resolve();


            });

        })

        return Promise.all(prmoises);

    });

}).then(() => {

    const minDelay = new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const windowLoaded = new Promise((resolve) => {
        if (document.readyState === "complete") {

            // splashscreen status text
            statusText("Render items");

            resolve();

        } else {

            // splashscreen status text
            statusText("Waiting for remaining network requests");

            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {

                    const name = entry.name.split("/").pop().split("?")[0];
                    statusText(`Waiting for remaining network requests "${name}"`);

                });
            });

            observer.observe({
                entryTypes: ["resource"]
            });

            window.addEventListener("load", () => {
                observer.disconnect();
                resolve();
            }, {
                once: true
            });

        }
    });

    return Promise.all([
        document.fonts.ready,
        windowLoaded,
        minDelay
    ]);

}).then(async () => {

    //const elem = document.getElementById("app");
    //elem.style.backgroundImage = `url(${this.imageUrl})`;
    //elem.style.backgroundSize = "cover";
    //elem.style.backgroundPosition = "center";
    //elem.style.backgroundAttachment = "fixed";

    const db = await openDatabase();

    const file = await new Promise((resolve, reject) => {

        const tx = db.transaction("images", "readonly");
        const store = tx.objectStore("images");

        const request = store.get("background");

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);

    });

    if (file instanceof File) {

        let imageUrl = URL.createObjectURL(file);
        const elem = document.getElementById("app");

        elem.style.backgroundImage = `url(${imageUrl})`;
        elem.style.backgroundSize = "cover";
        elem.style.backgroundPosition = "center";
        elem.style.backgroundAttachment = "fixed";

    }

    // set tile background transparancy
    document.documentElement.style.setProperty("--item-alpha", settings.layout.itemTransparancy / 100);


    // init navbar visibility
    // not reactive, this happens in settings
    routes.forEach((route) => {
        const key = `show${route.name}Button`;
        if (settings.navigation[key] !== undefined) {
            route.visible = settings.navigation[key];
        }
    });

    // hide splashscreen
    statusText(null);
    visibility(false);

    (() => {

        let counter = 0;
        let timer = null

        document.body.addEventListener("click", () => {
            if (!settings.navigation.showSettingsButton) {

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