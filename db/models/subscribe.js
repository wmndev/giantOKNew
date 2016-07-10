module.exports = function (sequelize, DataTypes) {
    return sequelize.define('subscribe', {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len:[3, 250]
                }
            }
        });

}
