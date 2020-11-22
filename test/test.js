'use strict';

var assert = require('assert');

describe('Dummy Mocha tests', function () {
    it('should return 2+2=4', function () {
        assert.strictEqual(2+2, 4);
    });
    it('should return 2+3=5', function () {
        assert.strictEqual(2+3, 5);
    });
});