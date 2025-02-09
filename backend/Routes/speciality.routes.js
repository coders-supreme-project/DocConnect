const express = require("express");
const router = express.Router();
const{getAllSpeciality}=require("../Controller/speciality.controller")
 

router.get("/",getAllSpeciality)





module.exports = router;