module.exports = function (sequelize, DataTypes) {
    return sequelize.define('order', {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len:[3, 250]
                }
            },
            comments: {
                type: DataTypes.STRING,
                allowNull: true
            }
        });

}
