const express = require('express');

const userController = require('../controllers/userController');
const searchController = require('../controllers/searchController');
const bookingController = require('../controllers/bookingController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', userController.getUser);
router.post('/check', userController.checkPassword);
router.patch('/', upload.single('image'), userController.updateProfile);

router.get('/search', searchController.getAvailableFac);
router.get('/available_time', searchController.getAvailableTime);

router.post('/booking', bookingController.createBooking);
router.get('/my_booking', bookingController.getMyBooking);
router.delete('/my_booking/:id', bookingController.deleteMyBooking);

module.exports = router;
