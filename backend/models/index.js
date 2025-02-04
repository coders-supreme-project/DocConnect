const { Sequelize, DataTypes } = require('sequelize');
console.log("hello");
const db = {};

const connection = new Sequelize(
    "docconnect",
    "root",
    "root",
    {
      host: "localhost",
      dialect: "mysql",
    }
);

// Import models
db.Media = require('./media.model')(connection, DataTypes);
db.User = require('./user.model')(connection, DataTypes);
db.DoctorReview = require('./doctorReview.model')(connection, DataTypes);
db.Chatrooms = require('./chatRoom.model')(connection, DataTypes);
db.Appointment = require('./appointment.model')(connection, DataTypes);
db.ChatroomMessage = require('./chatroomMessage.model')(connection, DataTypes);
db.Availability = require('./availability.model')(connection, DataTypes);

db.User.hasMany(db.Appointment, { foreignKey: 'PatientID', as: 'PatientAppointments' });
db.Appointment.belongsTo(db.User, { foreignKey: 'PatientID', as: 'Patient' });

db.User.hasMany(db.Appointment, { foreignKey: 'DoctorID', as: 'DoctorAppointments' });
db.Appointment.belongsTo(db.User, { foreignKey: 'DoctorID', as: 'Doctor' });

db.User.hasMany(db.DoctorReview, { foreignKey: 'PatientID', as: 'PatientReviews' });
db.DoctorReview.belongsTo(db.User, { foreignKey: 'PatientID', as: 'Patient' });

db.User.hasMany(db.DoctorReview, { foreignKey: 'DoctorID', as: 'DoctorReviews' });
db.DoctorReview.belongsTo(db.User, { foreignKey: 'DoctorID', as: 'Doctor' });

db.User.hasMany(db.Chatrooms, { foreignKey: 'PatientID', as: 'PatientChatrooms' });
db.Chatrooms.belongsTo(db.User, { foreignKey: 'PatientID', as: 'Patient' });

db.User.hasMany(db.Chatrooms, { foreignKey: 'DoctorID', as: 'DoctorChatrooms' });
db.Chatrooms.belongsTo(db.User, { foreignKey: 'DoctorID', as: 'Doctor' });

db.Chatrooms.hasMany(db.ChatroomMessage, { foreignKey: 'ChatroomID', as: 'Messages' });
db.ChatroomMessage.belongsTo(db.Chatrooms, { foreignKey: 'ChatroomID', as: 'Chatroom' });

db.User.hasMany(db.ChatroomMessage, { foreignKey: 'SenderID', as: 'SentMessages' });
db.ChatroomMessage.belongsTo(db.User, { foreignKey: 'SenderID', as: 'Sender' });

db.User.hasOne(db.Media, { foreignKey: 'UserID', as: 'ProfilePicture' });
db.Media.belongsTo(db.User, { foreignKey: 'UserID', as: 'ProfilePicture' });

db.User.hasMany(db.Appointment, { foreignKey: 'DoctorID' });
db.User.hasMany(db.Appointment, { foreignKey: 'PatientID' });

db.User.hasMany(db.ChatroomMessage, { foreignKey: 'SenderID' });
db.ChatroomMessage.belongsTo(db.User, { foreignKey: 'SenderID' });

db.User.hasMany(db.DoctorReview, { foreignKey: 'DoctorID' });
db.DoctorReview.belongsTo(db.User, { foreignKey: 'DoctorID' });

db.User.hasMany(db.DoctorReview, { foreignKey: 'PatientID' });
db.DoctorReview.belongsTo(db.User, { foreignKey: 'PatientID' });

db.User.hasMany(db.Availability, { foreignKey: 'DoctorID' });
db.Availability.belongsTo(db.User, { foreignKey: 'DoctorID' });

// (async () => {
//     try {
//         await connection.authenticate();
//         console.log('Connection has been established successfully.');
//         await connection.sync({ alter: true });
//         console.log('Database synced');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })();

db.Sequelize = Sequelize;
module.exports = db;