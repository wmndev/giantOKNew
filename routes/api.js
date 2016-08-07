var _ = require('underscore');
var db = require(__base + 'db/db.js');
var email = require(__base + 'util/email.js');


var exports = module.exports = {};

exports.order = function (req, res) {
    var body = _.pick(req.body, 'email', 'comments', 'status', 'payment', 'dishName');
    body.active = true;
    db.order.create(body).then(function (order) {
        console.info('Order persisted: ' + order.toJSON());
        email.sendConfirmOrderMail(order.email);
        res.status(200).send();
    }, function (err) {
        console.log(err);
        return res.status(400).send();
    });
};

exports.sendEmail = function(req, res){
    var body = _.pick(req.body, 'content', 'to', 'action');
    if (body.action === 'Prepared'){
        email.sendOrderPreparedMail(body);
        res.status(200).send();
    }


};

exports.getOrders = function (req, res) {
    var activeStr = req.query.active;
    var whereClasuse = {order: [['id', 'DESC']]};
    whereClasuse.where = {};

    if (typeof activeStr !== 'undefined' && typeof activeStr !== null) {
        if (activeStr === 'true') {
            whereClasuse.where = {
                active: true
            };
        }
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
    db.subscribe.create(body).then(function (subscribe) {
        console.info('Subscribed persisted: ' + subscribe.toJSON());
        res.status(200).send();
    }, function (err) {
        console.log(err);
        return res.status(400).send();
    });
}

exports.getAllSubscribers = function (req, res){
    db.subscribe.findAll().then(function(data){
        res.json(data);
    }, function(err){
        console.log(err);
        return res.status(500).send();
    });
}

exports.deactivateOrders = function (req, res){
    db.order.update({active: false}, {where:{active: true}}).then(function(data){
        console.log('Deactivation completed!');
        res.status(200).send();
    },function(err){
       return res.status(500).send();
    });
}


exports.createDishes = function (req, res) {
    var data = req.body;
    for (var item in data) {
        var object = _.pick(data[item], 'name', 'shortDesc', 'description', 'ingredients', 'isWeekly');
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


exports.getReviews = function (req, res) {
    var id = req.params.id;
    db.review.findAll({
        where: {
            dish: id
        },
        order: [['id', 'ASC']]
    }).then(function (reviews) {
        res.json(reviews);
    }, function (err) {
        console.log(err);
        res.status(500).send();
    });
}

exports.createReview = function (req, res) {
    var body = _.pick(req.body, 'email', 'name', 'content', 'dish', 'score');
    db.review.create(body).then(function (review) {
        console.info('Review persisted: ' + review.toJSON());
        res.json(review);
    }, function () {
        return res.status(400).send();
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
