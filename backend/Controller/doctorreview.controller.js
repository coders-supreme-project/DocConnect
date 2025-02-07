const db = require('../models');

module.exports = {
  addReview: async (req, res) => {
    const { DoctorID, PatientID, Rating, comment, ReviewText, ReviewDate } = req.body;

    try {
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