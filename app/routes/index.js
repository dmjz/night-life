'use strict';

var path = process.cwd();
var YelpHandler = require(path + '/app/controllers/yelpHandler.server.js');
var ShopHandler = require(path + '/app/controllers/shopHandler.server.js');
var UserHandler = require(path + '/app/controllers/userHandler.server.js');

module.exports = function (app, passport) {

	var yelpHandler = new YelpHandler();
	var shopHandler = new ShopHandler();
	var userHandler = new UserHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/api/yelp')
		.get(function (req, res) {
			console.log('In router: calling searchYelp');
			yelpHandler.searchYelp(req, res);
		});
		
	app.route('/api/shop')
		.get(function (req, res) {
			shopHandler.searchShop(req, res);
		});
		
	app.route('/api/userino')
		.get(function (req, res) {
			if (req.isAuthenticated()) {
				res.json(req.user);
			} else {
				res.json({});
			}
		});
		
	app.route('/api/userino/signup')
		.get(function (req, res) {
			if (req.isAuthenticated()) {
				userHandler.signup(req, res);
			} else {
				res.json({ location: '/auth/twitter' });
			}
		});

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
};
