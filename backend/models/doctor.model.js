const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Doctor = sequelize.define('Doctor', {
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
        Password: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        specialty: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "Number of years of experience"
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        
        LocationLatitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true,
          },
          LocationLongitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true,
          },
    }, 
    {
        timestamps: true
    });
    

    return Doctor;
};



