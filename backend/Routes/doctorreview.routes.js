const express = require('express');
const router = express.Router();

const {addReview,getReviews} = require('../controller/doctorreview.controller');



router.post('/add',addReview);
router.get('/:doctorId/reviews', getReviews);

module.exports = router;