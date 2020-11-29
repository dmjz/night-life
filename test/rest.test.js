// # REST API tests
//
// Tests for app endpoints and Yelp API.
//
// --------------------------------------------------------


'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
require('dotenv').load();
chai.use(chaiHttp);
const expect = chai.expect;


describe('Routes', function () {
    var routes = [
        '/',
        '/api/yelp',
        '/api/shop',
        '/api/userino',
        '/api/userino/signup',
        '/auth/twitter',
        '/auth/twitter/callback'
    ];
    var endpoint;
    for (endpoint of routes) {
        it(endpoint, function (done) {
            chai.request(app)
                .get('/')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });
    }
});

describe('Yelp', function () {
    it('should return validation error without lat/lng', function (done) {
        chai.request(app)
            .get('/api/yelp')
            .query({'term': 'food'})
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                var dataObject = JSON.parse(res.text);
                expect(dataObject['error']['code']).to.equal('VALIDATION_ERROR');
                done();
            });
    });

    it('should get valid results by lat/lng', function (done) {
        chai.request(app)
            .get('/api/yelp')
            .query({'lat': '48.856614', 'lng': '2.3522219'})
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                var dataObject = JSON.parse(res.text);
                expect(dataObject['businesses'].length).to.be.gt(0);
                var business = dataObject['businesses'][0];
                var requiredFields = [
                    'name',
                    'image_url',
                    'url',
                    'categories'
                ];
                var field;
                for (field of requiredFields) { 
                    expect(business.hasOwnProperty(field));
                }
                done();
            });
    });
});