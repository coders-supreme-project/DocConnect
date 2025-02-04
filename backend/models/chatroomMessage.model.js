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
        model: 'chatrooms',
        key: 'ChatroomID'
      }
    },
    SenderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'UserID'
      }
    },
    MessageText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    SentAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return ChatroomMessage;
};
