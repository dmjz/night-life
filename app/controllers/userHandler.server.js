'use strict';

var User = require('../models/users.js');
var Shop = require('../models/shops.js');

function UserHandler () {
    
    this.signup = function (req, res) {
        User.findOne({ 'twitter.id': req.user.twitter.id }, function (err, user) {
            if (err) { throw err; }
            
            if (!user) {
                return res.json({ error: 'User not found.' });
            } else {
                Shop.findOne({ shopId: req.query.id }, function (err, shop) {
                    if (err) { throw err; }
                    
                    if (!shop) {
                        return res.json({ error: 'Shop not found' });
                    } else {
                        var i = user.shopList.indexOf(req.query.id);
                        switch (req.query.action) {
                            case 'add':
                                if (i > -1) { //if shop found in user's shopList
                                    res.json({ operation: '' });
                                } else {
                                    user.shopList.push(req.query.id);
                                    user.markModified('shopList');
                                    user.save();
                                    shop.userCounter++;
                                    shop.save();
                                    res.json({ operation: 'inc' });
                                }
                                break;
                            case 'remove':
                                if (i > -1) {
                                    user.shopList.splice(i, 1);
                                    user.markModified('shopList');
                                    user.save();
                                    shop.userCounter--;
                                    shop.save();
                                    res.json({ operation: 'dec' });
                                } else {
                                    res.json({ operation: '' });
                                }
                                break;
                            default:
                                res.json({ error: 'Bad action parameter.' });
                                break;
                        }
                    }
                });
            }
        });
    };
    
}

module.exports = UserHandler;