const { Facility, Booking, BookingTimeSlot } = require('../models');
const AppError = require('../utils/appError');
const unavailableSlot = require('../utils/unavailableSlot');

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
      include: { model: BookingTimeSlot, attributes: ['slotTime'] },
      where: { facilityId: facilityId, bookingDate: bookingDate },
    });

    const closeSlot = await Facility.findOne({
      where: { id: facilityId },
      attributes: ['openTime', 'closeTime'],
    });

    const unavailableSlots = unavailableSlot(
      closeSlot.openTime,
      closeSlot.closeTime
    );
    const usedTimeSlots = [...unavailableSlots];

    bookings.forEach((booking) => {
      booking.BookingTimeSlots.forEach((timeSlot) => {
        usedTimeSlots.push(timeSlot.slotTime);
      });
    });
    usedTimeSlots.sort();
    res.status(200).json({ usedTimeSlots, bookingDate });
  } catch (err) {
    next(err);
  }
};
