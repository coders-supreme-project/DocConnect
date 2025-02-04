const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Specialty = sequelize.define('Specialty', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {

    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return Specialty;
};
