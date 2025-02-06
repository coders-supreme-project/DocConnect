const { Op } = require('sequelize');
const db = require('../models/index');

// Create a new Appointment
exports.createAppointment = async (req, res) => {
  try {
    console.log('Received appointment data:', req.body);
    const { DoctorID, AppointmentDate, DurationMinutes } = req.body;
    const PatientID = req.user.UserID; // Extracted from authenticated user

    if (!DoctorID || !AppointmentDate || !DurationMinutes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate doctor existence
    const doctor = await db.User.findOne({
      where: { UserID: DoctorID, Role: "Doctor" },
    });

    if (!doctor) {
      console.log('Doctor not found:', DoctorID);
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create and save the appointment
    const newAppointment = await db.Appointment.create({
      PatientID,
      DoctorID,
      AppointmentDate,
      DurationMinutes,
      Status: 'pending',
    });

    console.log('Appointment created successfully:', newAppointment);
    return res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ message: "Error creating appointment", error: error.message });
  }
};

// Get all Appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await db.Appointment.findAll({
      include: [
        { model: db.User, as: "Doctor", attributes: ['UserID', 'FirstName', 'LastName'] },
        { model: db.User, as: "Patient", attributes: ['UserID', 'FirstName', 'LastName'] }
      ],
      order: [['AppointmentDate', 'ASC']]
    });

    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving appointments", error: error.message });
  }
};

// Get a single Appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await db.Appointment.findByPk(req.params.id, {
      include: [
        { model: db.User, as: "Doctor", attributes: ['UserID', 'FirstName', 'LastName'] },
        { model: db.User, as: "Patient", attributes: ['UserID', 'FirstName', 'LastName'] }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res.status(200).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving appointment", error: error.message });
  }
};

// Update an Appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { AppointmentDate, DurationMinutes, Status } = req.body;
    const appointment = await db.Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.AppointmentDate = AppointmentDate;
    appointment.DurationMinutes = DurationMinutes;
    appointment.Status = Status;

    await appointment.save();
    return res.status(200).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: "Error updating appointment", error: error.message });
  }
};

// Delete an Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await db.Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.destroy();
    return res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting appointment", error: error.message });
  }
};

// Get Appointments for a Specific Doctor or Patient
exports.getAppointmentsByUserId = async (req, res) => {
  try {
    const userId = req.user.UserID;
    const userRole = req.user.Role;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const appointments = await db.Appointment.findAll({
      where: userRole === "Doctor" ? { DoctorID: userId } : { PatientID: userId },
      include: [
        { model: db.User, as: "Doctor", attributes: ['UserID', 'FirstName', 'LastName'] },
        { model: db.User, as: "Patient", attributes: ['UserID', 'FirstName', 'LastName'] }
      ],
      order: [['AppointmentDate', 'ASC']]
    });

    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting appointments", error: error.message });
  }
};
