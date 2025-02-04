const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Patient = sequelize.define('Patient', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        medicalHistory: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Brief history of past medical conditions"
        }
    }, {
        timestamps: true
    });

    return Patient;
};
