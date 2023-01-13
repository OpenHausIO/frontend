const puppeteer = require("puppeteer");
const path = require("path");

const sleep = (n) => {
    return new Promise((resolve) => {
        setTimeout(resolve, n);
    });
};


const capture = async () => {

    // setup
    const browser = await puppeteer.launch({
        //headless: false,
        //args: ["--start-maximized"]
    });
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
    await sleep(3000);

    let groupItemsCheckbox = await page.waitForSelector("#groupItemsCheckbox");
    sleep(100);
    let groupItemsRoomCheckbox = await page.waitForSelector("#groupItemsRoomCheckbox");
    sleep(100);
    let groupItemsEndpointCheckbox = await page.waitForSelector("#groupItemsEndpointCheckbox");
    sleep(100);
    let groupItemsDeviceCheckbox = await page.waitForSelector("#groupItemsDeviceCheckbox");
    await sleep(3000);

    // TODO: clicking does not work!
    //page.click("#groupItemsCheckbox");
    groupItemsCheckbox.click();
    sleep(1000);
    //page.click("#groupItemsRoomCheckbox");
    //sleep(1000);
    //page.click("#groupItemsEndpointCheckbox");
    //sleep(1000);
    //page.click("#groupItemsDeviceCheckbox");
    //await sleep(1000);

    await page.goto(`http://127.0.0.1:3000/#/endpoints`);
    await sleep(1000);
    await page.screenshot({
        path: path.resolve(process.cwd(), `./docs/img/endpoints-grouping.png`)
    });
    sleep(1000);

    await page.goto(`http://127.0.0.1:3000/#/rooms`);
    await sleep(1000);
    await page.screenshot({
        path: path.resolve(process.cwd(), `./docs/img/rooms-grouping.png`)
    });
    sleep(1000);
    */

    await browser.close();

};

capture();