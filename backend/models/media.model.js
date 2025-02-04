const { DataTypes } = require("sequelize");


module.exports = (sequelize) => {
    const Media = sequelize.define("Media", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Media;
};
