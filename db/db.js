var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production'){
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect:'postgress'
    })
}else{
    sequelize = new Sequelize(undefined, undefined, undefined, {
        dialect: 'sqlite',
        storage: __dirname + '/data/dev-giant.sqlite'
    });
}

var db = {};
db.order = sequelize.import(__dirname + '/models/order.js');
db.subscribe = sequelize.import(__dirname + '/models/subscribe.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

