const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "users",
    {
      UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      FirstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      LastName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      Password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      Role: {
        type: DataTypes.ENUM("Doctor", "Patient", "Admin"),
        allowNull: false,
      },
      Speciality: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      LocationLatitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },
      LocationLongitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },
      Bio: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      MeetingPrice: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  return User;
};
