const db = require('../models');

module.exports = {
  addReview: async (req, res) => {
    let { DoctorID, PatientID, Rating, ReviewText, ReviewDate } = req.body;

    // Validate input
    if (!DoctorID || !PatientID) {
      return res.status(400).json({ error: "DoctorID and PatientID are required" });
    }

    try {
      // Check if the PatientID exists in the users table
      const patient = await db.User.findOne({ where: { UserID: PatientID } });
      if (!patient) {
        return res.status(400).json({ error: "Invalid PatientID: Patient does not exist" });
      }

      // Check if the DoctorID exists in the users table
      const doctor = await db.User.findOne({ where: { UserID: DoctorID } });
      if (!doctor) {
        return res.status(400).json({ error: "Invalid DoctorID: Doctor does not exist" });
      }

      // Ensure ReviewDate is set correctly
      ReviewDate = ReviewDate || new Date().toISOString().split('T')[0];

      // Create the review
      const review = await db.DoctorReview.create({
        DoctorID,
        PatientID,
        Rating,
        ReviewText, // Ensure this matches the frontend payload
        ReviewDate,
      });

      res.status(201).json(review); // Return the newly created review
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getReviews: async (req, res) => {
    const { doctorId } = req.params;

    try {
      const reviews = await db.DoctorReview.findAll({
        where: { DoctorID: doctorId },
        include: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['FirstName', 'LastName']
          }
        ]
      });

      if (!reviews.length) {
        return res.status(404).json({ error: "No reviews found for this doctor" });
      }

      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: error.message });
    }
  }
};