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

exports.subscribe = function (req, res) {
    var body = _.pick(req.body, 'email');
    console.info('Subscribe recieved: ' + body);
    db.subscribe.create(body).then(function (subscribe) {
        console.info('Subscribed persisted: ' + subscribe.toJSON());
        res.status(200).send();
    }, function () {
        return res.status(400).send();
    });
}

exports.getAllDishes = function (req, res) {
    db.dish.findAll().then(function (data) {
        var retObject = {};
        if (_.isEmpty(data)) {
            console.log('start from begining');
            var object = {
                name: 'N/A',
                shortDesc: 'N/A',
                description: 'N/A',
            };
            var i = 1
            for (; i <= 4; i++) {
                console.log('i is:' + i);
                db.dish.create(object).then(function (dish) {
                    console.log('new dish name:' + dish.name + '  ' + dish.id);
                    buildDishObject(i, retObject, dish);
                    if (i == 4) {
                        console.log(retObject);
                        res.json(retObject);
                    }
                }, function (err) {
                    console.log(err);
                });
            }
            console.log('end: ' + retObject.two);
        } else {
            var i = 1;
            data.forEach(function (result) {
                buildDishObject(i, retObject, result.dataValues);
                i++;
            });
            res.json(retObject);
        }



    }, function (err) {
        res.status(500).send();
    });

}

function buildDishObject(i, retObject, result) {

    switch (i) {
    case 1:
        retObject.one = result;
        break;
    case 2:
        retObject.two = result;
        break;
    case 3:
        retObject.three = result;
        break;
    case 4:
        retObject.four = result;
        break;
    }
}
