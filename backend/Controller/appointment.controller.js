const { Op } = require('sequelize');
const db = require('../models/index');

// Create a new Appointment
exports.createAppointment = async (req, res) => {
  try {
    console.log('Received appointment data:', req.body);
    const { doctorId, patientId,appointmentDate, DurationMinutes,type } = req.body;
    
    // Validate input
    if (!doctorId || !appointmentDate || !DurationMinutes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create the appointment
    const newAppointment = await db.Appointment.create({
      PatientID: patientId,
      DoctorID:doctorId,
      AppointmentDate:appointmentDate,
      DurationMinutes:DurationMinutes,
      Type:type
    });

    console.log('Appointment created successfully:', newAppointment);
    // Return the newly created appointment
    return res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ 
      message: "Error creating appointment", 
      error: error.message
    });
  }
};
// Get all Appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await db.Appointment.findAll();
    return res.status(200).json(appointments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving appointments", error });
  }
};

// Get a single Appointment by ID
exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;
   console.log(id,"doctoooooor")
  try {
    const appointments = await db.Appointment.findAll({
      where: { DoctorID: id },
      include: [
        {
          model: db.User,
          as: 'Patient',
          include: [{ model: db.Patient, as: 'PatientProfile' }],
        },
      ],
    });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an Appointment by ID
exports.updateAppointment = async (req, res) => {
  try {
    const { status } = req.body; // Extract the status from the request body
    const appointment = await db.Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update only the status
    appointment.Status = status;

    await appointment.save();
    return res.status(200).json(appointment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating appointment status", error });
  }
};

// Delete an Appointment by ID
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await db.Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.destroy();
    return res
      .status(204)
      .json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting appointment", error });
  }
};

exports.getAppointmentsByUserId = async (req, res) => {
  try {
    const doctorId = req.user.UserID;
    const appointments = await db.Appointment.findAll({
      where: { DoctorID: doctorId },
      include: [
        {
          model: db.User,
          as: "Patient",
          attributes: ['UserID', 'FirstName', 'LastName', 'Email']
        },
      ],
      order: [['AppointmentDate', 'ASC']]
    });
    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error getting appointments", error: error.message });
  }
};
