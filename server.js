var express = require('express');
var _ = require('underscore');
var bodyParser = require('body-parser');

api = require('./routes/api.js');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('static'));
app.use(express.static('pages'));


app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.post('/api/order',api.order);

app.post('/api/subscribe', function(req, res){
    res.status(200).send();
});

app.get('/api/dishes/:id', function(req, res) {
    console.log(req.params.id);
     res.json({msg: 'ok'});
});



app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log('Listening on port ' + PORT);
});



