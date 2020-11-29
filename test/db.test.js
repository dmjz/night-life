// # Database tests
//
// Tests for Shop counter database.
//
// --------------------------------------------------------


'use strict';

const chai = require('chai');
const app = require('../server');
const Shop = require('../app/models/shops.js');
require('dotenv').load();
const expect = chai.expect;


function basic_ID_check(err, doc, testId) {
    expect(err).to.be.null;
    expect(doc.shopId).to.equal(testId);
}


describe('Shop', function () {
    var testId = 'TEST_ID';

    before(function () {
        // Create a test shop that "already exists" when we run the tests
        var shop = new Shop({
            shopId: testId,
            userCounter: 0
        });
        return shop.save(function (err, doc) {
            if (err) { throw err; }
            else { console.log('Create <Shop ' + shop.shopId + '>'); }
        });
    });

    after(function () {
        // Destroy any shops that may have been created in tests
        Shop.findOneAndRemove({ 'shopId': testId }, function (err, doc) {
            if (err) {
                throw err;
            } else if (doc) {
                console.log('Delete <Shop ' + doc.shopId + '>');
            } else {
                console.log('<Shop ' + doc.shopId + '> not found');
            }
        });
    });

    it('should find by shopId', function (done) {
        Shop.findOne({ shopId: testId }, function (err, doc) {
            basic_ID_check(err, doc, testId);
            done();
        });
    });
        
    it('should update userCounter', function (done) {
        Shop.findOne({ shopId: testId }, function (err, doc) {
            basic_ID_check(err, doc, testId);
            expect(doc.userCounter).to.equal(0);
            doc.userCounter++;
            doc.save(function (err, doc) {
                Shop.findOne({ shopId: testId }, function (err, doc) {
                    basic_ID_check(err, doc, testId);
                    expect(doc.userCounter).to.equal(1);
                    done();
                });
            });
        });
    });
});
