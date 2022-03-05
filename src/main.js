import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";


window.store = {
    rooms: new Set(),
    endpoints: new Set(),
    devices: new Set()
};

// monkey patch ws
window.events = null;



// create vue app
const app = createApp(App);


function promisfy(worker, cb) {

    let wrapper = new Promise((resolve, reject) => {
        worker((err, ...args) => {
            if (err) {
                reject(err);
            } else {

                // NOTE: GOOD PRACTICE?!
                if (args.length === 1 && !cb) {
                    resolve(args[0]);
                } else {
                    resolve(args);
                }

            }
        });
    });

    if (cb) {

        wrapper.then((args) => {
            cb(null, ...args);
        }).catch((err) => {
            cb(err);
        });

        //return undefined;

    } else {

        return wrapper;

    }

}


function request(url, options, cb) {

    if (!cb && options instanceof Function) {
        cb = options;
        options = null;
    }

    options = Object.assign({
        method: "GET"
    }, options);

    return promisfy((done) => {

        let controller = new AbortController();
        let id = setTimeout(() => controller.abort(), 1000);

        fetch(url, {
            ...options,
            signal: controller.signal
        }).then((response) => {
            return response.json();
        }).then((data) => {
            done(null, data);
        }).catch(done);

        clearTimeout(id);

    }, cb);

}



Promise.all([

    // for DOM to be ready
    new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {

            console.log("[pre] DOM Content ready");

            resolve();

        });
    }),

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

        ws.onmessage = (data) => {
            data = JSON.parse(data);
            console.log("[EVENT]", data);
            app.$emit("event", data);
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

            rooms.forEach(item => window.store.rooms.add(item));
            endpoints.forEach(item => window.store.endpoints.add(item));
            devices.forEach(item => window.store.devices.add(item));

            console.log("[pre] api resrouces fetched");

            resolve();

        }).catch((err) => {

            console.error("Could not fetch api resources", err);

            reject(err);

        });
    })

]).then(() => {

    console.log("Preshit done, mount vue app", window.store);

    app.use(router);
    app.mount("#app");

}).catch((err) => {

    alert("Could not start: " + err.message);
    console.warn("Display overlay with error", err);

});