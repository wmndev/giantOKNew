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
                len: [3, 250]
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isWeekly: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
}
