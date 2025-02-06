const express = require('express');
const router = express.Router();
const {createAppointment,getAppointments,getAppointmentById,updateAppointment,deleteAppointment,getAppointmentsByUserId} = require('../controller/appointment.controller');
const {authenticate} = require('../middleware/auth.middelware'); // Middleware to protect routes

// 📌 Create an Appointment (Patient books an appointment)
router.post('/create', authenticate,createAppointment);

// 📌 Get all Appointments (Admin or Doctor)
router.get('/all', authenticate, getAppointments);

// 📌 Get Appointment by ID
router.get('/:id', authenticate, getAppointmentById);

// 📌 Update an Appointment (Doctor confirms or cancels)
router.put('/update/:id', authenticate, updateAppointment);

// 📌 Delete an Appointment
router.delete('/delete/:id', authenticate, deleteAppointment);

// 📌 Get Appointments for the logged-in Doctor or Patient
router.get('/my-appointments', authenticate, getAppointmentsByUserId);

module.exports = router;
