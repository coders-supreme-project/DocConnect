const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChatroomMessage = sequelize.define('ChatroomMessage', {
    MessageID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ChatroomID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Chatrooms',
        key: 'ChatroomID'
      }
    },
    PatientID: {
      type: DataTypes.INTEGER,
      allowNull: true, // ✅ Allow NULL because the sender could be a doctor
      references: {
        model: 'Patients', // ✅ Ensure this matches the actual table name
        key: 'id' // ✅ Match the actual primary key of `Patients` table
      }
    },
    DoctorID: {
      type: DataTypes.INTEGER,
      allowNull: true, // ✅ Allow NULL because the sender could be a patient
      references: {
        model: 'Doctors', // ✅ Ensure this matches the actual table name
        key: 'id' // ✅ Match the actual primary key of `Doctors` table
      }
    },
    MessageText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    SentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // ✅ Auto-generate timestamp
    }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return ChatroomMessage;
};
