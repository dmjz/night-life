'use strict';

var path = require('path');
var assert = require('assert');
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
// var edge = require('selenium-webdriver/edge');
require('dotenv').load();

var APP_URL = process.env['APP_URL'].slice(0, -1) + ':' + process.env['PORT'] + '/';

var chromeDriverPath = path.join(__dirname, 'drivers', 'chromedriver.exe');
var chromeService = new chrome.ServiceBuilder(chromeDriverPath);


describe('Basic Selenium tests (Chrome)', function () {
    this.timeout(10000);
    var driver;

    before(function () {
        driver = new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeService(chromeService)
            .build();
    });

    after(function () {
        driver.close();
        return driver.quit();
    });

    it('should get home page', function () {
        return driver.get(APP_URL);
    });

    it('should have correct home page title', function () {
        return driver.getTitle().then(function(title) {
            assert.strictEqual(title, 'nightlife-djmot');
        });
    });
});