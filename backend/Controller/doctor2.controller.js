const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../models/index');
const { haversineDistance } = require('../utils/haversine.js');
const { body, validationResult } = require('express-validator');

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
 

  getDoctorbySpeciality: async (req, res) => {
    console.log("saleeeem")
    try {
      const { specialty } = req.query;

      if (!specialty) {
        return res.status(400).json({ message: 'Specialty query parameter is required' });
      }

      const doctors = await db.Doctor.findAll({
        where: { specialty },
        attributes: doctorAttributes,
      });

      if (!doctors || doctors.length === 0) {
        return res.status(404).json({ message: 'No doctors found with the specified specialty' });
      }

      return res.status(200).json(doctors);
    } catch (error) {
      console.error('Error fetching doctors by specialty:', error);
      return res.status(500).json({ message: 'Error fetching doctors data', error: error.message });
    }
  },
};