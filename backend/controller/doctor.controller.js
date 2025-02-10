const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../models/index');
const { haversineDistance } = require('../utils/haversine.js');
const { body, validationResult } = require('express-validator');
const { getAllSpeciality } = require('./speciality.controller.js');

// Common attributes for Doctor model
const doctorAttributes = [
  'id',
  'firstName',
  'lastName',
  'email',
  'phone',
  'specialty',
  'experience',
  'bio',
  'profilePicture',
  'isVerified',
  'LocationLatitude',
  'LocationLongitude',
];

module.exports = {
  // ✅ Search Doctors
  searchDoctors: async (req, res) => {
    const { specialization, city, zipCode, availableDate, availableTime, name } = req.query;

    try {
      const doctors = await db.Doctor.findAll({
        where: {
          [Op.and]: [
            specialization ? { specialty: { [Op.like]: `%${specialization}%` } } : {},
            name
              ? {
                  [Op.or]: [
                    { firstName: { [Op.like]: `%${name}%` } },
                    { lastName: { [Op.like]: `%${name}%` } },
                  ],
                }
              : {},
            city ? { city } : {},
            zipCode ? { zipCode } : {},
          ],
        },
        include: [
          {
            model: db.Availability,
            as: 'Availabilities',
            required: availableDate || availableTime ? true : false,
            where: {
              ...(availableDate && { availableDate }),
              ...(availableTime && {
                startTime: { [Op.lte]: availableTime },
                endTime: { [Op.gte]: availableTime },
              }),
            },
          },
        ],
        attributes: doctorAttributes,
      });

      res.status(200).json(doctors);
    } catch (error) {
      console.error('Error searching doctors:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  },

  // ✅ Get Nearest Doctors by Location
  getLocationDoctors: async (req, res) => {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    try {
      const doctors = await db.Doctor.findAll({
        attributes: [...doctorAttributes, 'LocationLatitude', 'LocationLongitude'],
      });

      const doctorsWithDistance = doctors.map((doctor) => ({
        ...doctor.toJSON(),
        distance: haversineDistance(lat, lng, doctor.LocationLatitude, doctor.LocationLongitude),
      }));

      const nearestDoctors = doctorsWithDistance.sort((a, b) => a.distance - b.distance);

      res.status(200).json(nearestDoctors);
    } catch (error) {
      console.error('Error fetching nearest doctors:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  },

  // ✅ Create Doctor Profile (with validation)
  createDoctorProfile: [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('specialty').notEmpty().withMessage('Specialty is required'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const {
          firstName,
          lastName,
          email,
          password,
          phone,
          specialty,
          experience,
          bio,
          profilePicture,
          isVerified,
          LocationLatitude,
          LocationLongitude,
        } = req.body;

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = await db.Doctor.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
          specialty,
          experience,
          bio,
          profilePicture,
          isVerified: isVerified || false,
          LocationLatitude,
          LocationLongitude,
        });

        return res.status(201).json({ message: 'Doctor profile created successfully', doctor });
      } catch (error) {
        console.error('Error creating doctor profile:', error);
        return res.status(500).json({ message: 'Error creating doctor profile', error: error.message });
      }
    },
  ],

  // ✅ Get All Doctors
  getDoctors: async (req, res) => {
    try {
      const doctors = await db.Doctor.findAll({
        attributes: doctorAttributes,
      });

      return res.status(200).json(doctors);
    } catch (error) {
      console.error('Error retrieving doctors:', error);
      return res.status(500).json({ message: 'Error retrieving doctors', error: error.message });
    }
  },

  // ✅ Get Doctor by ID
  getDoctorById: async (req, res) => {
    try {
      const { id } = req.params;
      const doctor = await db.Doctor.findOne({
        where: { id },
        attributes: doctorAttributes,
      });

      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      return res.status(200).json(doctor);
    } catch (error) {
      console.error('Error retrieving doctor:', error);
      return res.status(500).json({ message: 'Error retrieving doctor', error: error.message });
    }
  },

  // ✅ Update Doctor Profile
  updateDoctorProfile: async (req, res) => {
    try {
      const { id } = req.params;

      const [updated] = await db.Doctor.update(req.body, {
        where: { id },
      });

      if (!updated) {
        return res.status(404).json({ message: 'Doctor not found or no changes made' });
      }

      return res.status(200).json({ message: 'Doctor profile updated successfully' });
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      return res.status(500).json({ message: 'Error updating doctor profile', error: error.message });
    }
  },

  // ✅ Delete Doctor Profile
  deleteDoctorProfile: async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await db.Doctor.destroy({
        where: { id },
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      return res.status(200).json({ message: 'Doctor profile deleted successfully' });
    } catch (error) {
      console.error('Error deleting doctor profile:', error);
      return res.status(500).json({ message: 'Error deleting doctor profile', error: error.message });
    }
  },

  // ✅ Get Current Logged-in Doctor (Assuming Authentication Middleware)
  getCurrentDoctor: async (req, res) => {
    try {
      const doctorId = req.user.id; // Extracted from middleware authentication

      const doctor = await db.Doctor.findOne({
        where: { id: doctorId },
        attributes: doctorAttributes,
      });

      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      return res.status(200).json(doctor);
    } catch (error) {
      console.error('Error fetching current doctor:', error);
      return res.status(500).json({ message: 'Error fetching doctor data', error: error.message });
    }
  },
  getAllSpeciality: async (req, res) => {
    try {
      const specialities = await db.Doctor.findAll({
        attributes: specialty,
      });

      if (!specialities) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      return res.status(200).json(specialities);
    } catch (error) {
      console.error('Error fetching current doctor:', error);
      return res.status(500).json({ message: 'Error fetching doctor data', error: error.message });
    }
  },
  // ✅ Get Doctors by Specialty

};