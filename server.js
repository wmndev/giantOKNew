var express = require('express');
var _ = require('underscore');

var app = express();

app.use(express.static('static'));
app.use(express.static('pages'));


app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/dishes/:id', function(req, res) {
    console.log(req.params.id);
});

app.post('/dishes', function(req, res){
    res.status(200).send();
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log('Listening on port ' + PORT);
});

