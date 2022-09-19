import { onMounted, onUnmounted } from 'vue'
import { store } from "@/store";

// TODO prefix with underscoe (_)?
export function promisfy(worker, cb) {

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


export function request(url, options, cb) {

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


// TODO prefix with underscoe (_)?
export function debounce(func, wait, immediate = false) {

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


export function groupObjByKey(arr, key) {
    return arr.reduce((obj, item) => {
        obj[item[key]] = obj[item[key]] || [];
        obj[item[key]].push(item);
        return obj;
    }, {});
}


export function getRoomNameById(_id) {

    let room = store.rooms.find((obj) => {
        return obj._id === _id;
    });

    if (!room) {
        return "Room not set";
    }

    return room.name;

}


export function getDeviceNameById(_id) {
    //TODO convert to array
    let device = Array.from(store.devices).find((obj) => {
        return obj._id === _id;
    });

    if (!device) {
        return "Device not set";
    }

    return device.name;

}


export function alert(...args) {
    return window.alert.apply(window, args);
}


export function toggleFullscreen(elem) {

    elem = elem || document.documentElement;

    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

}


export function isNumber(n) {
    if (new RegExp(/^\d+$/).test(n)) {
        return true;
    } else {
        return false;
    }
};

// from https://vuejs.org/guide/reusability/composables.html#mouse-tracker-example
export function useEventListener(target, event, callback) {

    onMounted(() => {
        target.addEventListener(event, callback);
    });

    onUnmounted(() => {
        target.removeEventListener(event, callback);
    });

};