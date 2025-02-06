const { Op } = require('sequelize');
const db = require('../models/index');

const searchDoctors = async (req, res) => {
  const { name, specialization, city, zipCode, availableDate, availableTime } = req.query;

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
};

module.exports = {
   searchDoctors
};