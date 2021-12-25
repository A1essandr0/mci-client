const { Builder, By, Capabilities, until, Key, locateWith } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
import { describe, it } from 'mocha';
const assert = require('assert');

const caps = new Capabilities();
caps.setPageLoadStrategy('normal');

const credentials = {
    newAccountName: "mmm",
    newAccountEmail: "mmm@mmm.com",
    newAccountPwd: "1qazse4mmm",
}
const testConfig = {
    url: "https://localhost:4500",
}


async function memoricciLogin(driver: any, credentials: any, url: string) {
    await driver.get(url);
    let signupButton = await driver.wait(
        until.elementLocated(By.className("navButton toolBarRight")),
        2000
    )
    signupButton.sendKeys(Key.ENTER);
    return driver;
}


describe.skip("UI tests", function() {

    describe("#Signup", function() {

        it("test", async function() {
            let driver = new Builder()
                .withCapabilities(caps)
                .forBrowser('chrome')
                .setChromeOptions(new chrome.Options().addArguments('ignore-certificate-errors'))
                .build();

            let result = await memoricciLogin(driver, credentials, testConfig.url);
            console.log(await result);
            assert.strictEqual(result, 1);
        })
    })

})
