'use strict';

var Shop = require('../models/shops.js');

function ShopHandler () {
    
    this.searchShop = function (req, res) {
        // search for shop with id = req.query.id
        // if not found, make one
        Shop.findOne({ shopId: req.query.id }, function (err, result) {
            if (err) { throw err; }
            
            if (result) {
                res.json(result);
            } else {
                var shop = new Shop({
                    shopId: req.query.id,
                    userCounter: 0
                });
                shop.save(function(err, doc) {
                    if (err) { throw err; }
                    
                    res.json(doc);
                });
            }
        });
    };

}

module.exports = ShopHandler;