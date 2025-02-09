const{Specialty}=require("../models/index")
module.exports={
    getAllSpeciality: async (req, res) => {
        try {
          const speciality = await Specialty.findAll();
          res.send(speciality);
        } catch (error) {
          throw error;
        }
      },
}