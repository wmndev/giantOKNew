global.__base = __dirname + '/';

var express = require('express');
var _ = require('underscore');
var bodyParser = require('body-parser');

var api = require('./routes/api.js');
var db = require('./db/db.js');


var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

app.use(express.static('static'));
app.use(express.static('pages'));


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.post('/api/orders', api.order);

app.patch('/api/orders', api.deactivateOrders);

app.patch('/api/orders/:id', api.updateOrder);

app.post('/api/subscribes',api.subscribe);

app.get('/api/subscribes',api.getAllSubscribers);

app.post('/api/review', api.createReview );

app.post('/api/dishes', api.createDishes);

app.get('/api/dishes/:id', api.findDishById);

app.get('/api/dishes', api.getDishes);

app.get('/api/orders', api.getOrders);

app.get('/api/review/:id', api.getReviews);

app.post('/api/email', api.sendEmail)


app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var PORT = process.env.PORT || 3000;



//------------
// Sequelize
//------------

db.sequelize.sync(/*{force:true}*/).then(function () {
    app.listen(PORT, function () {
        console.log('Listening on port ' + PORT);
    });
});
