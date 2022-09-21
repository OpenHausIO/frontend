import { reactive } from "vue";

import { defineStore } from "pinia"

export const settingsStore = defineStore('settings', {
    state() {
        return {
            groupItems: true,
            groupRoomItems: true,
            groupEndpointItems: true,
            groupDeviceItems: true,
            showSettingsButton: true,
            showBackButton: true,
            showVueTourOnNextVisit: true,
            showGradientBackground: true,
            editDashboardWidgets: false,
            showDashboardWidgets: true,
            screensaverOverlayDelay: 30,
            enableScreenSaverOverlay: false,
            startpage: "/dashboard",
        }
    }
});

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


export { store };

//export const device = store.devices;
//export const rooms = store.rooms;
//export const endpoints = store.endpoints;