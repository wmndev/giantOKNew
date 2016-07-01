var orders = [];

exports.order = function(req, res){
    console.log(req.body);
    res.status(200).send();
};
