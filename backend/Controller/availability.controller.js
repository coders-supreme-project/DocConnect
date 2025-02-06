const db = require('../models');
// Create Availability
const createAvailability = async (req, res) => {
  const { DoctorID, AvailableDate, StartTime, EndTime } = req.body;

  try {
    const newAvailability = await db.Availability.create({
      DoctorID,
      AvailableDate,
      StartTime,
      EndTime,
    });

    res.status(201).json(newAvailability);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to create availability' });
  }
};

// Get All Availability for a Doctor
const getDoctorAvailability = async (req, res) => {
  const { DoctorID } = req.params;

  try {
    const availability = await db.Availability.findAll({ where: { DoctorID } });
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve availability' });
  }
};

// Delete Availability
const deleteAvailability = async (req, res) => {
  const { AvailabilityID } = req.params;

  try {
    await db.Availability.destroy({ where: { AvailabilityID } });
    res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete availability' });
  }
};



const { Op } = require('sequelize');

const getAvailableSlots = async (req, res) => {
  const { DoctorID } = req.params;

  try {
    // Fetch doctor's availability
    const availabilities = await db.Availability.findAll({
      where: { 
        DoctorID, 
        IsAvailable: true,
        AvailableDate: {
          [Op.gte]: new Date()
        }
      },
      attributes: ['AvailableDate', 'StartTime', 'EndTime'],
      order: [['AvailableDate', 'ASC'], ['StartTime', 'ASC']]
    });

    // Fetch confirmed appointments
    const confirmedAppointments = await db.Appointment.findAll({
      where: {
        DoctorID,
        Status: 'confirmed',
        AppointmentDate: {
          [Op.gte]: new Date()
        }
      },
      attributes: ['AppointmentDate', 'DurationMinutes']
    });

    // Process available slots
    const availableSlots = availabilities.flatMap(slot => {
      const date = slot.AvailableDate;
      const startTime = new Date(`${date}T${slot.StartTime}`);
      const endTime = new Date(`${date}T${slot.EndTime}`);
      const slots = [];

      while (startTime < endTime) {
        const slotEndTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour slots
        const isBooked = confirmedAppointments.some(appointment => {
          const appointmentStart = new Date(appointment.AppointmentDate);
          const appointmentEnd = new Date(appointmentStart.getTime() + appointment.DurationMinutes * 60 * 1000);
          return appointmentStart < slotEndTime && appointmentEnd > startTime;
        });

        if (!isBooked) {
          slots.push({
            date: date,
            startTime: startTime.toTimeString().slice(0, 5),
            endTime: slotEndTime.toTimeString().slice(0, 5)
          });
        }

        startTime.setTime(slotEndTime.getTime());
      }

      return slots;
    });

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error retrieving available slots:', error);
    res.status(500).json({ error: 'Failed to retrieve available slots' });
  }
};



module.exports = {
  createAvailability,
  getDoctorAvailability,
  deleteAvailability,
  getAvailableSlots,
};