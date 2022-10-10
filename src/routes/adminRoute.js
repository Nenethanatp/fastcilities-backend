const express = require('express');
const facController = require('../controllers/facController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/all_facility', facController.getAllFac);
router.patch('/fac/:id', upload.single('image'), facController.updateFac);
router.post('/new_fac', upload.single('image'), facController.createFac);
module.exports = router;
