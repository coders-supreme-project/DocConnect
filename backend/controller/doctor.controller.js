const { Op } = require('sequelize');
const bcrypt = require("bcrypt");
const db = require('../models/index');
const {haversineDistance}=require("../utils/haversine.js")
module.exports = {
 
 
searchDoctors : async (req, res) => {
  const { specialization, city, zipCode, availableDate, availableTime } = req.query;

  try {
    const doctors = await db.Doctor.findAll({
      where: {
        [Op.and]: [
          specialization ? { specialty: { [Op.like]: `%${specialization}%` } } : {}, // Search by specialization
          name
            ? {
                [Op.or]: [
                  { firstName: { [Op.like]: `%${name}%` } },
                  { lastName: { [Op.like]: `%${name}%` } }
                ]
              }
            : {}, // Search by name (firstName or lastName)
          city ? { city } : {}, // Search by city (if provided)
          zipCode ? { zipCode } : {} // Search by zip code (if provided)
        ]
      },
      include: [
        {
          model: db.Availability,
          as: 'Availabilities',
          required: availableDate || availableTime ? true : false,
          where: {
            ...(availableDate && { availableDate }), // Filter by availableDate if provided
            ...(availableTime && {
              startTime: { [Op.lte]: availableTime },
              endTime: { [Op.gte]: availableTime }
            }) // Filter by available time range if provided
          }
        }
      ],
      attributes: ['id', 'firstName', 'lastName', 'specialty', 'experience', 'bio']
    });

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
 getLocationDoctors:async(req,res)=>{
    const { lat, lng } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    try {
        // Fetch all doctors with their associated User data
        const doctors = await db.Doctor.findAll({
            include: [
                {
                    model: db.User,
                    as: "User", // Use the alias defined in the association
                    attributes: ["FirstName", "LastName", "Email", "Role"],
                },
            ],
        });

        // Calculate distances and add to each doctor
        const doctorsWithDistance = doctors.map((doctor) => ({
            ...doctor.toJSON(),
            distance: haversineDistance(lat, lng, doctor.LocationLatitude, doctor.LocationLongitude),
        }));

        // Sort by distance
        const nearestDoctors = doctorsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(nearestDoctors);
    } catch (error) {
        console.error("Error fetching nearest doctors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
},




  // ✅ Create Doctor Profile
  createDoctorProfile: async (req, res) => {
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

      return res.status(201).json({ message: "Doctor profile created successfully", doctor });
    } catch (error) {
      console.error("Error creating doctor profile:", error);
      return res.status(500).json({ message: "Error creating doctor profile", error: error.message });
    }
  },

  // ✅ Get All Doctors
  getDoctors: async (req, res) => {
    try {
      const doctors = await db.Doctor.findAll({
        attributes: ["id", "firstName", "lastName", "email", "phone", "specialty", "experience", "bio", "profilePicture", "isVerified", "LocationLatitude", "LocationLongitude"],
      });

      return res.status(200).json(doctors);
    } catch (error) {
      console.error("Error retrieving doctors:", error);
      return res.status(500).json({ message: "Error retrieving doctors", error: error.message });
    }
  },

  // ✅ Get Doctor by ID
  getDoctorById: async (req, res) => {
    try {
      const { id } = req.params;
      const doctor = await db.Doctor.findOne({
        where: { id },
        attributes: ["id", "firstName", "lastName", "email", "phone", "specialty", "experience", "bio", "profilePicture", "isVerified", "LocationLatitude", "LocationLongitude"],
      });

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      return res.status(200).json(doctor);
    } catch (error) {
      console.error("Error retrieving doctor:", error);
      return res.status(500).json({ message: "Error retrieving doctor", error: error.message });
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
        return res.status(404).json({ message: "Doctor not found or no changes made" });
      }

      return res.status(200).json({ message: "Doctor profile updated successfully" });
    } catch (error) {
      console.error("Error updating doctor profile:", error);
      return res.status(500).json({ message: "Error updating doctor profile", error: error.message });
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
        return res.status(404).json({ message: "Doctor not found" });
      }

      return res.status(200).json({ message: "Doctor profile deleted successfully" });
    } catch (error) {
      console.error("Error deleting doctor profile:", error);
      return res.status(500).json({ message: "Error deleting doctor profile", error: error.message });
    }
  },

  // ✅ Get Current Logged-in Doctor (Assuming Authentication Middleware)
  getCurrentDoctor: async (req, res) => {
    try {
      const doctorId = req.user.id; // Extracted from middleware authentication

      const doctor = await db.Doctor.findOne({
        where: { id: doctorId },
        attributes: ["id", "firstName", "lastName", "email", "phone", "specialty", "experience", "bio", "profilePicture", "isVerified", "LocationLatitude", "LocationLongitude"],
      });

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      return res.status(200).json(doctor);
    } catch (error) {
      console.error("Error fetching current doctor:", error);
      return res.status(500).json({ message: "Error fetching doctor data", error: error.message });
    }
  },
}





