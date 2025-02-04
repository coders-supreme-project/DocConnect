const { Op } = require('sequelize');
const db = require('../models/index');


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
}

}