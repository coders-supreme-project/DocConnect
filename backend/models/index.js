const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

console.log("hello");
require('dotenv').config();
const db = {};

const connection = new Sequelize(
    process.env.Database,
    process.env.User,
    process.env.Password,
    {
        host: process.env.Host,
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
db.Specialty = require('./speciality.model')(connection, DataTypes);
db.Doctor = require("./doctor.model")(connection, DataTypes);  // Ensure model is properly required
db.Patient = require("./patient.model")(connection, DataTypes); // Ensure model is properly required

// Define Associations

// ✅ One-to-One: User and Doctor
db.User.hasOne(db.Doctor, { foreignKey: 'userId', as: 'DoctorProfile' });
db.Doctor.belongsTo(db.User, { foreignKey: 'userId', as: 'User' });

// ✅ One-to-One: User and Patient
db.User.hasOne(db.Patient, { foreignKey: 'userId', as: 'PatientProfile' });
db.Patient.belongsTo(db.User, { foreignKey: 'userId', as: 'User' });

// ✅ One-to-One: User and Specialty
db.User.hasOne(db.Specialty, { foreignKey: 'userId', as: 'Specialty' });
db.Specialty.belongsTo(db.User, { foreignKey: 'userId', as: 'User' });

// ✅ One-to-One: User and Media (Profile Picture)
db.User.hasOne(db.Media, { foreignKey: 'UserID', as: 'ProfilePicture' });
db.Media.belongsTo(db.User, { foreignKey: 'UserID', as: 'ProfilePicture' });

// ✅ One-to-Many: User and Appointments (Doctor-Patient relation)
db.User.hasMany(db.Appointment, { foreignKey: 'PatientID', as: 'PatientAppointments' });
db.Appointment.belongsTo(db.User, { foreignKey: 'PatientID', as: 'Patient' });

db.User.hasMany(db.Appointment, { foreignKey: 'DoctorID', as: 'DoctorAppointments' });
db.Appointment.belongsTo(db.User, { foreignKey: 'DoctorID', as: 'Doctor' });

// ✅ One-to-Many: Doctor Reviews
db.User.hasMany(db.DoctorReview, { foreignKey: 'PatientID', as: 'PatientReviews' });
db.DoctorReview.belongsTo(db.User, { foreignKey: 'PatientID', as: 'Patient' });

db.User.hasMany(db.DoctorReview, { foreignKey: 'DoctorID', as: 'DoctorReviews' });
db.DoctorReview.belongsTo(db.User, { foreignKey: 'DoctorID', as: 'Doctor' });

// ✅ One-to-Many: Chatrooms
db.User.hasMany(db.Chatrooms, { foreignKey: 'PatientID', as: 'PatientChatrooms' });
db.Chatrooms.belongsTo(db.User, { foreignKey: 'PatientID', as: 'Patient' });

db.User.hasMany(db.Chatrooms, { foreignKey: 'DoctorID', as: 'DoctorChatrooms' });
db.Chatrooms.belongsTo(db.User, { foreignKey: 'DoctorID', as: 'Doctor' });

// ✅ One-to-Many: Chatroom Messages
db.Chatrooms.hasMany(db.ChatroomMessage, { foreignKey: 'ChatroomID', as: 'Messages' });
db.ChatroomMessage.belongsTo(db.Chatrooms, { foreignKey: 'ChatroomID', as: 'Chatroom' });

db.User.hasMany(db.ChatroomMessage, { foreignKey: 'SenderID', as: 'SentMessages' });
db.ChatroomMessage.belongsTo(db.User, { foreignKey: 'SenderID', as: 'Sender' });

// ✅ One-to-Many: Doctor Availability
db.User.hasMany(db.Availability, { foreignKey: 'DoctorID', as: 'Availabilities' });
db.Availability.belongsTo(db.User, { foreignKey: 'DoctorID', as: 'Doctor' });



db.Patient.hasOne(db.Media, { foreignKey: 'patientId', as: 'ProfilePicture' });
db.Doctor.hasOne(db.Media, { foreignKey: 'doctorId', as: 'ProfilePicture' });
db.Media.belongsTo(db.Doctor, { foreignKey: 'doctorId', as: 'Doctor' });

// connection.sync({ alter: true })
//     .then(() => console.log("Database synced"))
//     .catch((err) => console.error("Error syncing database", err));

db.Sequelize = Sequelize;
db.connection = connection;
module.exports = db;
