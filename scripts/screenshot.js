const puppeteer = require("puppeteer");
const path = require("path");

const sleep = (n) => {
    return new Promise((resolve) => {
        setTimeout(resolve, n);
    });
};


const capture = async () => {

    // setup
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });

    // load default page
    // without this icons are not displayed
    await page.goto(`http://127.0.0.1:3000/`);

    let pages = [/*{
        path: "dashboard",
        name: "dashboard"
    }, */{
            url: "rooms",
            name: "rooms"
        }, {
            url: "devices",
            name: "devices"
        }, {
            url: "endpoints",
            name: "endpoints"
        }, {
            url: "settings",
            name: "settings"
        }];

    for (let { url, name } of pages) {

        console.log("Create screensho of", url);

        await page.goto(`http://127.0.0.1:3000/#/${url}`);
        await sleep(1000);

        console.log("Naviated")

        await page.screenshot({
            path: path.resolve(process.cwd(), `./docs/img/${name}.png`)
        });

        console.log("Screenshot saved")

    }

    /*
    // enable item grouping
    await page.goto(`http://127.0.0.1:3000/#/settings`);
    await sleep(1000);

    let groupItemsCheckbox = await page.waitForSelector("#groupItemsCheckbox");
    let groupItemsRoomCheckbox = await page.waitForSelector("#groupItemsRoomCheckbox");
    let groupItemsEndpointCheckbox = await page.waitForSelector("#groupItemsEndpointCheckbox");
    let groupItemsDeviceCheckboxawait = await page.waitForSelector("#groupItemsDeviceCheckbox");
    await sleep(1000);

    groupItemsCheckbox.click();
    groupItemsRoomCheckbox.click();
    groupItemsEndpointCheckbox.click();
    groupItemsDeviceCheckboxawait.click();
    await sleep(1000);

    await page.goto(`http://127.0.0.1:3000/#/endpoints`);
    await sleep(1000);
    await page.screenshot({
        path: `./endpoints-grouping.png`
    });
    sleep(1000);

    await page.goto(`http://127.0.0.1:3000/#/rooms`);
    await sleep(1000);
    await page.screenshot({
        path: `./rooms-grouping.png`
    });
    sleep(1000);
    */

    await browser.close();

};

capture();