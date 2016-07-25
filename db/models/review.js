module.exports = function (sequelize, DataTypes) {
    return sequelize.define('review', {
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [3, 255]
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dish: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}
