const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Chatrooms = sequelize.define('Chatrooms', {
    ChatroomID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PatientID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Patients', // ✅ Ensure this matches your actual table name (CASE-SENSITIVE)
        key: 'id' // ✅ This should match the actual primary key of `Patients` table
      }
    },
    DoctorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Doctors', // ✅ Ensure this matches your actual table name
        key: 'id' // ✅ Match the actual primary key of `Doctors`
      }
    },
    StartTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return Chatrooms;
};
