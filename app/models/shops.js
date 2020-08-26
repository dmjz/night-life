'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Shop = new Schema({
    shopId: String,
    userCounter: Number
});

module.exports = mongoose.model('Shop', Shop);