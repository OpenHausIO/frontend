//import { reactive } from "vue";
import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";

/*
export const commonStore = defineStore("common", {
    state() {
        return {};
    }
});
*/

export const settingsStore = defineStore("settings", {
    state() {
        return {
            groupItems: false,
            groupRoomItems: false,
            groupEndpointItems: false,
            groupDeviceItems: false,
            showSettingsButton: true,
            showBackButton: true,
            showVueTourOnNextVisit: true,
            showGradientBackground: true,
            editDashboardWidgets: false,
            showDashboardWidgets: true,
            transparentDashboardWidgets: false,
            screensaverOverlayDelay: 30,
            enableScreenSaverOverlay: false,
            dashboardGrid: {
                cols: 12,
                rows: 30
            },
            startpage: "/dashboard",
        }
    },
    persistent: true
});


export const itemStore = defineStore("items", {
    state() {
        return {
            rooms: [],
            endpoints: [],
            devices: [],
        }
    },
    actions: {
        update(key, data) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {

                console.log(`Update property set "${key}"`, data);

                let target = Array.from(this[key]).find((item) => {
                    return item._id === data._id;
                });

                if (!target) {
                    return;
                }

                Object.assign(target, data);

            } else {

                console.warn(`Could not update property "${key}" in store`);

            }
        },
        add(key, data) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {

                console.log(`Add property to store "${key}"`, data);
                this[key].push(data);

            } else {

                console.warn(`Could not add item to property "${key}" in store`);

            }
        },
        remove(key, data) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {

                console.log(`Remove property to store "${key}"`, data);

                let target = this[key].find((item) => {
                    return item._id === data._id;
                });

                if (!target) {
                    return;
                }

                let index = this[key].indexOf(target);
                this[key].splice(index, 1);

            } else {

                console.warn(`Could not remove item to property "${key}" in store`);

            }
        },
        getDeviceNameById(_id) {

            //TODO convert to array
            let device = this.$state.devices.find((obj) => {
                return obj._id === _id;
            });

            if (!device) {
                return "Device not set";
            }

            return device.name;

        },
        getRoomNameById(_id) {

            let room = this.$state.rooms.find((obj) => {
                return obj._id === _id;
            });

            if (!room) {
                return "Room not set";
            }

            return room.name;

        }
    }
});


export const widgetStore = defineStore("widgets", {
    state() {
        return [
            { x: 6, y: 0, w: 3, h: 12, widget: "Notes" },
            { x: 9, y: 0, w: 3, h: 12, widget: "Todo" },
            { x: 0, y: 12, w: 4, h: 18, widget: "Notes" },
        ].map((widget, i) => {
            widget.i = i;
            widget.uuid = uuid();
            widget.moved = false;
            return widget;
        });
    },
    actions: {
        add(widget, options) {

            let i = ((start) => {
                this.$state.every((a) => {
                    if (start === a) {
                        start = a + 1;
                        return true;
                    }
                });
                return start;
            })(this.$state.length + 1);

            let obj = Object.assign({
                x: 0,
                y: 0,
                z: 0,
                w: 4,
                h: 4,
                i,
                widget,
                moved: false,
                uuid: uuid()
            }, options);

            this.$state.push(obj);

            window.localStorage.setItem("widgets", JSON.stringify(this.$state));

            console.log("Widget added to store", obj);

        }
    },
    persistent: true
});


/*
const store = reactive({
    rooms: [],
    endpoints: [],
    devices: [],
    update(key, data) {
        if (Object.prototype.hasOwnProperty.call(this, key)) {

            console.log(`Update property set "${key}"`, data);

            let target = Array.from(this[key]).find((item) => {
                return item._id === data._id;
            });

            if (!target) {
                return;
            }

            Object.assign(target, data);

        } else {

            console.warn(`Could not update property "${key}" in store`);

        }
    },
    add(key, data) {
        if (Object.prototype.hasOwnProperty.call(this, key)) {

            console.log(`Add property to store "${key}"`, data);
            this[key].push(data);

        } else {

            console.warn(`Could not add item to property "${key}" in store`);

        }
    },
    remove(key, data) {
        if (Object.prototype.hasOwnProperty.call(this, key)) {

            console.log(`Remove property to store "${key}"`, data);

            let target = this[key].find((item) => {
                return item._id === data._id;
            });

            if (!target) {
                return;
            }

            let index = this[key].indexOf(target);
            this[key].splice(index, 1);

        } else {

            console.warn(`Could not remove item to property "${key}" in store`);

        }
    }
});
*/

//export { store };

//export const device = store.devices;
//export const rooms = store.rooms;
//export const endpoints = store.endpoints;