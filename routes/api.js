var _ = require('underscore');
var db = require(__base + 'db/db.js');


var orders = [];

exports.order = function (req, res) {
    var body = _.pick(req.body, 'email', 'comments');

    db.order.create(body).then(function (order) {
        console.log('OK: '+order);
        res.json(order.toPublicJSON());
    }, function () {
        return res.status(400).send();
    });
};
