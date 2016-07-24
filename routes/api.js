var _ = require('underscore');
var db = require(__base + 'db/db.js');
var email = require(__base + 'util/email.js');


var exports = module.exports = {};

exports.order = function (req, res) {
    var body = _.pick(req.body, 'email', 'comments');
    body.active = true;
    console.info('Order recieved: ' + body);
    db.order.create(body).then(function (order) {
        console.info('Order persisted: ' + order.toJSON());
        email.sendOrderEmail(order.email);
        res.status(200).send();
    }, function () {
        return res.status(400).send();
    });
};

exports.getOrders = function (req, res) {
    var active = req.query.isWeekly;
    var whereClasuse = {}

    if (typeof active !== 'undefined' && typeof active !== null && active === 'boolean') {
        whereClasuse.where = {
            active: active
        };
    }

    db.order.findAll(whereClasuse).then(function (activeOrders) {
        res.json(activeOrders);
    }, function (err) {
        console.log(err);
        return res.status(400).send();
    });
};

exports.subscribe = function (req, res) {
    var body = _.pick(req.body, 'email');
    console.info('Subscribe recieved: ' + body);
    db.subscribe.create(body).then(function (subscribe) {
        console.info('Subscribed persisted: ' + subscribe.toJSON());
        res.status(200).send();
    }, function (err) {
        console.log(err);
        return res.status(400).send();
    });
}


exports.createDishes = function (req, res) {
    var data = req.body;
    for (var item in data) {
        console.log(item);
        var object = _.pick(data[item], 'name', 'shortDesc', 'description', 'isWeekly');
        var objectId = _.pick(data[item], 'id');
        db.dish.update(object, {
            where: objectId
        }).then(function (dish) {
            console.log('Done updating: ' + dish);
        });
    }
    res.status(200).send();

};

exports.findDishById = function (req, res) {
    var id = req.params.id;

    db.dish.findById(id).then(function (dish) {
        res.json(dish);
    }, function (err) {
        console.log(err);
        res.status(500).send();
    });

};

exports.getDishes = function (req, res) {
    var isWeekly = req.query.isWeekly;
    if (isWeekly) {
        db.dish.findOne({
            where: {
                isWeekly: true
            }
        }).then(function (weeklyDish) {
            res.json(weeklyDish);
        });
    } else {
        db.dish.findAll({
            order: [['id', 'ASC']]
        }).then(function (data) {

            if (_.isEmpty(data)) {
                console.log('start from begining');
                var object = {
                    name: 'N/A',
                    shortDesc: 'N/A',
                    description: 'N/A',
                };
                var i = 1
                for (; i <= 4; i++) {
                    var retObject = [];
                    db.dish.create(object).then(function (dish) {
                        retObject.push(dish);
                    }, function (err) {
                        console.log(err);
                    });
                }
                res.json(retObject);
            } else {
                res.json(data);
            }
        }, function (err) {
            res.status(500).send();
        });
    }
};

//function buildDishObject(i, retObject, result) {
//
//    switch (i) {
//    case 1:
//        retObject.one = result;
//        break;
//    case 2:
//        retObject.two = result;
//        break;
//    case 3:
//        retObject.three = result;
//        break;
//    case 4:
//        retObject.four = result;
//        break;
//    }
//}
