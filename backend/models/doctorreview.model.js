const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DoctorReview = sequelize.define('DoctorReview', {
    ReviewID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    DoctorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'UserID'
      }
    },
    PatientID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'UserID'
      }
    },
    Rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ReviewText: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ReviewDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return DoctorReview;
};
