const db = require('../models');

module.exports = {
  addReview: async (req, res) => {
    const { DoctorID, PatientID, Rating, comment, ReviewText, ReviewDate } = req.body;

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

      // Create the review
      const review = await db.DoctorReview.create({
        DoctorID,
        PatientID,
        Rating,
        comment,
        ReviewText,
        ReviewDate
      });
      res.status(201).json(review);
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
            model: db.User,
            as: 'patient',
            attributes: ['FirstName', 'LastName']
          }
        ]
      });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};