'use strict';

var path = require('path');
var assert = require('assert');
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var edge = require('selenium-webdriver/edge');
require('dotenv').load();


var APP_URL = process.env['APP_URL'].slice(0, -1) + ':' + process.env['PORT'] + '/';

var browsers = ['chrome', 'MicrosoftEdge'];
var driverFilenames = {
    'chrome':           'chromedriver.exe',
    'MicrosoftEdge':    'msedgedriver.exe'
};
var driverModules = {
    'chrome':           chrome,
    'MicrosoftEdge':    edge
};
var services = {};
browsers.forEach((browser) => {
    let driverPath = path.join(__dirname, 'drivers', driverFilenames[browser]);
    services[browser] = new driverModules[browser].ServiceBuilder(driverPath);
})
function get_driver(browser) {
    return new webdriver.Builder()
        .forBrowser(browser)
        .setChromeService(services['chrome'])
        .setEdgeService(services['MicrosoftEdge'])
        .build();
}


browsers.forEach((browser) => {
    describe('Navigate to home page (' + browser + ')', function () {
        this.timeout(300000);
        var driver;

        before(function () {
            driver = get_driver(browser);
        });

        after(function () {
            driver.close();
            return driver.quit();
        });

        it('should get home page', function () {
            return driver.get(APP_URL);
        });

        it('should have correct home page title', function () {
            return driver.getTitle().then(function (title) {
                assert.strictEqual(title, 'nightlife-djmot');
            });
        });
    });
})