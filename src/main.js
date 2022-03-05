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

    console.log(`[REQUEST] ${options.method}: ${url}`)

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

function debounce(func, wait, immediate = false) {

    let timeout = null;

    return function (...args) {

        console.log("Debounce child claled")

        let later = () => {

            timeout = null;

            if (!immediate) {
                func.apply(this, args);
            }

        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (immediate && !timeout) {
            func.apply(this, args);
        }

    };

}


// fix for vue components
// vue components dont find if 
// not explicitly assign to window object
Object.assign(window, {
    promisfy,
    request,
    debounce
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

    console.log("Preshit done, mount vue app");

    app.use(router);
    app.mount("#app");

}).catch((err) => {

    alert("Could not start: " + err.message);
    console.warn("Display overlay with error", err);

});