const { UploadStream } = require('cloudinary');
const { Facility, Booking, BookingTimeSlot } = require('../models');
const AppError = require('../utils/appError');

exports.getAvailableFac = async (req, res, next) => {
  try {
    const { type, bookingDate } = req.query;
    const availableFac = await Facility.findAll({
      where: { type: type },
    });
    console.log(availableFac);
    if (!availableFac) {
      throw new AppError('No available facility', 404);
    }
    res.status(200).json({ facility: availableFac });
  } catch (err) {
    next(err);
  }
};

exports.getAvailableTime = async (req, res, next) => {
  try {
    const { facilityId, bookingDate } = req.query;
    if (!facilityId || !bookingDate) {
      new AppError('Require facility id and booking date');
    }
    const bookings = await Booking.findAll({
      include: { model: BookingTimeSlot },
      where: { facilityId: facilityId },
    });

    const usedTimeSlots = [];
    bookings.forEach((booking) => {
      booking.BookingTimeSlots.forEach((timeSlot) => {
        usedTimeSlots.push(timeSlot.slotTime);
      });
    });
    res.status(200).json({ usedTimeSlots });
  } catch (err) {
    next(err);
  }
};
