const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load environment variables

console.log("Initializing database...");

const db = {};

const connection = new Sequelize(
    process.env.Database,
    process.env.User,
    process.env.Password,
    {
        host: process.env.HOST,
        dialect: "mysql",
        logging: false, // Disable logging for cleaner console output
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
db.Doctor = require("./doctor.model")(connection, DataTypes);
db.Patient = require("./patient.model")(connection, DataTypes);
// db.Review=require("./review.model")(connection,DataTypes);

// ==================== Associations ==================== //

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
db.Media.belongsTo(db.User, { foreignKey: 'UserID', as: 'ProfileOwner' });

// ✅ One-to-One: Doctor and Media (Profile Picture)
db.Doctor.hasOne(db.Media, { foreignKey: 'doctorId', as: 'DoctorProfilePicture' });
db.Media.belongsTo(db.Doctor, { foreignKey: 'doctorId', as: 'DoctorProfile' });

// ✅ One-to-One: Patient and Media (Profile Picture)
db.Patient.hasOne(db.Media, { foreignKey: 'patientId', as: 'PatientProfilePicture' });
db.Media.belongsTo(db.Patient, { foreignKey: 'patientId', as: 'PatientProfile' });

// ✅ One-to-Many: User and Appointments (Doctor-Patient relation)
db.User.hasMany(db.Appointment, { foreignKey: 'PatientID', as: 'PatientAppointments' });
db.Appointment.belongsTo(db.User, { foreignKey: 'PatientID', as: 'Patient' });

db.User.hasMany(db.Appointment, { foreignKey: 'DoctorID', as: 'DoctorAppointments' });
db.Appointment.belongsTo(db.User, { foreignKey: 'PatientID', as: 'patient' });

// ✅ One-to-Many: Doctor Reviews
db.User.hasMany(db.DoctorReview, { foreignKey: 'DoctorID', as: 'reviews' });
db.DoctorReview.belongsTo(db.User, { foreignKey: 'PatientID', as: 'patient' });
db.DoctorReview.belongsTo(db.Doctor, { foreignKey: 'DoctorID', as: 'doctor'});

db.Doctor.hasMany(db.DoctorReview, { foreignKey: 'DoctorID', as: 'DoctorReviews' });
db.DoctorReview.belongsTo(db.User, { foreignKey: 'DoctorID', as: 'ReviewedDoctor' });

// ✅ One-to-Many: Chatrooms
db.User.hasMany(db.Chatrooms, { foreignKey: 'PatientID', as: 'PatientChatrooms' });
db.Chatrooms.belongsTo(db.User, { foreignKey: 'PatientID', as: 'Patient' });

db.User.hasMany(db.Chatrooms, { foreignKey: 'DoctorID', as: 'DoctorChatrooms' });
db.Chatrooms.belongsTo(db.User, { foreignKey: 'DoctorID', as: 'ChatroomDoctor' });

// ✅ One-to-Many: Chatroom Messages
db.Chatrooms.hasMany(db.ChatroomMessage, { foreignKey: 'ChatroomID', as: 'Messages' });
db.ChatroomMessage.belongsTo(db.Chatrooms, { foreignKey: 'ChatroomID', as: 'Chatroom' });

db.User.hasMany(db.ChatroomMessage, { foreignKey: 'SenderID', as: 'SentMessages' });
db.ChatroomMessage.belongsTo(db.User, { foreignKey: 'SenderID', as: 'Sender' });

// ✅ One-to-Many: Doctor Availability
db.Doctor.hasMany(db.Availability, { foreignKey: 'DoctorID', as: 'Availabilities' });
db.Availability.belongsTo(db.Doctor, { foreignKey: 'DoctorID', as: 'Doctor' });

// ✅ One-to-Many: Doctor Reviews
//    db. Doctor.hasMany(db.Review, { foreignKey: 'doctorId', as: 'reviews',});
//    db. Review.belongsTo(db.Doctor, { foreignKey: 'doctorId', as: 'Doctor',});

// Sync the database (uncomment only when necessary)
// connection.sync({ alter: true })
//     .then(() => console.log("✅ Database synced"))
//     .catch((err) => console.error("❌ Error syncing database:", err));

// Assign connection and Sequelize instance to db object
db.Sequelize = Sequelize;
db.connection = connection;

module.exports = db;
