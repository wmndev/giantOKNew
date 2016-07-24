module.exports = function (sequelize, DataTypes) {
    return sequelize.define('dish', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 250]
            }
        },
        shortDesc: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 255]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        ingredients: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isWeekly: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
}
