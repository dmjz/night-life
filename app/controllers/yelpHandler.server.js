'use strict';

var oauthSignature = require('oauth-signature');  
var nonce = require('nonce')();
var request = require('request');

function yelpRequest(method, url, term, latitude, longitude, callback) {
    var parameters = { 
        term: term, 
        latitude: latitude,
        longitude: longitude,
        categories: 'nightlife' 
    };
    var options = { 
        url: url, 
        qs: parameters, 
        method: method, 
        headers: { Authorization: 'Bearer ' + process.env.YELP_API_KEY }
    };
    request(options, callback);
}


function YelpHandler () {
    
    this.searchYelp = function (req, res) {
        yelpRequest(
            'GET', 
            'https://api.yelp.com/v3/businesses/search',
            req.query.term,
            req.query.lat,
            req.query.lng,
            function (error, response, data) { res.send(data); }
        );
    };

}

module.exports = YelpHandler;
