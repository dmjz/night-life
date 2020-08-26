'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	twitter: { id: String },
    shopList: Object
});

module.exports = mongoose.model('User', User);
