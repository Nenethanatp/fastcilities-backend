const { Facility } = require('../models');

exports.getAvailableFac = async (req, res, next) => {
  try {
    const { type, bookingDate } = req.query;
    const availableFac = await Facility.findAll({
      where: { type: type },
    });
    console.log(availableFac);
    if (availableFac) {
      return res.status(200).json({ facility: availableFac });
    }
  } catch (err) {
    next(err);
  }
};
