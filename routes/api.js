var _ = require('underscore');
var db = require(__base + 'db/db.js');
var email = require(__base + 'util/email.js');


var exports = module.exports = {};

exports.order = function (req, res) {
    var body = _.pick(req.body, 'email', 'comments');
    console.info('Order recieved: ' + body);
    db.order.create(body).then(function (order) {
        console.info('Order persisted: ' + order.toJSON());
        email.sendOrderEmail(order.email);
        res.status(200).send();
    }, function () {
        return res.status(400).send();
    });
};

exports.subscribe = function(req, res){
    var body = _.pick(req.body, 'email');
    console.info('Subscribe recieved: ' + body);
    db.subscribe.create(body).then(function(subscribe){
        console.info('Subscribed persisted: ' + subscribe.toJSON());
       res.status(200).send();
    }, function () {
        return res.status(400).send();
    });
}
