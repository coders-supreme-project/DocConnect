const db = require("../models/index");
const Doctor = db.Doctor;
const User = db.User;

const { haversineDistance } = require("../utils/haversine");

const getLocationDoctors=async(req,res)=>{
    const { lat, lng } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    try {
        // Fetch all doctors with their associated User data
        const doctors = await Doctor.findAll({
            include: [
                {
                    model: User,
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












module.exports = {
  
    getLocationDoctors,
    
  };
  