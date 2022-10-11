const express = require('express');
const facController = require('../controllers/facController');
const bookingController = require('../controllers/bookingController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/all_facility', facController.getAllFac);
router.get('/fac/:id', facController.getOneFac);
router.patch('/fac/:id', upload.single('image'), facController.updateFac);
router.post('/new_fac', upload.single('image'), facController.createFac);
router.get('/all_booking', bookingController.getAllBooking);
module.exports = router;
