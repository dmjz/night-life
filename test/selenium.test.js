// # Selenium tests
//
// Selenium tests for interactive HTML elements, 
// search results, and links.
//
// --------------------------------------------------------


'use strict';

const path = require('path');
const assert = require('assert');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');
require('dotenv').load();


const APP_URL = process.env['APP_URL'];

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
    describe('Home page elements (' + browser + ')', function () {
        this.timeout(120 * 1000);
        var driver;

        before(function () {
            driver = get_driver(browser);
        });

        after(function () {
            driver.close();
            return driver.quit();
        });

        it('get home page', function () {
            return driver.get(APP_URL);
        });

        it('should have correct home page title', function () {
            return driver.getTitle().then(function (title) {
                assert.strictEqual(title, 'nightlife-djmot');
            });
        });

        it('should have interactive elements', function () {
            var checkElementIds = [
                'login-box',
                'search-text',
                'search-text'
            ];
            var id;
            for (id of checkElementIds) {
                assert.doesNotThrow(() => {
                    driver.findElement(webdriver.By.id(id));
                });
            }
        });
    });

    describe('Search results (' + browser + ')', function () {
        this.timeout(120 * 1000);
        var driver;

        before(function () {
            driver = get_driver(browser);
        });

        after(function () {
            driver.close();
            return driver.quit();
        });

        it('submit search', function () {
            return driver
                .get(APP_URL)
                .then(() => {
                    driver
                        .findElement(webdriver.By.id('search-text'))
                        .sendKeys('food')
                        .then(() => {
                            driver
                                .findElement(webdriver.By.id('search-text'))
                                .sendKeys(webdriver.Key.ENTER);
                        });
                });
        });

        it('should return nonempty results', function () {
            return driver
                .wait(
                    webdriver.until.elementLocated(webdriver.By.className('result-row')),
                    30 * 1000
                ).then(() => {
                    driver
                        .findElements(webdriver.By.className('result-row'))
                        .then((searchResultRows) => {
                            assert(searchResultRows.length > 0);
                        });
                });
        });

        it('should have interactive elements', function () {
            var checkElementClasses = [
                'result-name-text',
                'result-image',
                'result-add-button',
                'result-anchor'
            ];
            var className;
            for (className of checkElementClasses) {
                assert.doesNotThrow(() => {
                    driver.findElement(webdriver.By.className(className));
                });
            }
        });

        it('should link to business yelp page', function () {
            return driver
                .findElements(webdriver.By.className('result-anchor'))
                .then((resultAnchors) => {
                    resultAnchors[1]
                        .getAttribute('href')
                        .then((href) => {
                            assert(href.indexOf('www.yelp.com') > -1);
                        })
                });
        });
    });
})