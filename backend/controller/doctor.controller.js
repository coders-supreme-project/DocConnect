const { Op } = require('sequelize');
const db = require('../models/index');
const {haversineDistance}=require("../utils/haversine.js")
module.exports = {
 
 
searchDoctors : async (req, res) => {
  const { specialization, city, zipCode, availableDate, availableTime,name } = req.query;

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


  getDoctorById: async (req, res) => {
    const { id } = req.params;

    try {
      const doctor = await db.Doctor.findOne({
        where: { id },
        include: [
          {
            model: db.Availability,
            as: 'Availabilities',
            attributes: ['availableDate', 'startTime', 'endTime']
          }
        ],
        attributes: ['id', 'firstName', 'lastName', 'specialty', 'experience', 'bio']
      });

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
};

