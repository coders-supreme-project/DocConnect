const { Op } = require('sequelize');
const db = require('../models/index');
const {haversineDistance}=require("../utils/haversine.js")
module.exports = {
 
 
searchDoctors : async (req, res) => {
  const { specialization, city, zipCode, availableDate, availableTime } = req.query;

  try {
    const doctors = await db.Doctor.findAll({
      where: {
        specialty: specialization,
        [Op.or]: [
          { city: city },
          { zipCode: zipCode }
        ],
        '$Availabilities.AvailableDate$': availableDate,
        '$Availabilities.StartTime$': { [Op.lte]: availableTime },
        '$Availabilities.EndTime$': { [Op.gte]: availableTime }
      },
      include: [
        {
          model: db.Availability,
          as: 'Availabilities',
          required: true
        }
      ]
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
}
}
