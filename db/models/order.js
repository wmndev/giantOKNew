module.exports = function (sequelize, DataTypes) {
    return sequelize.define('order', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [5, 255]
            }
        },
        comments: {
            type: DataTypes.STRING,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        payment: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dishName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount:{
            type: DataTypes.DOUBLE,
            allowNull: false
        }

    });
}
