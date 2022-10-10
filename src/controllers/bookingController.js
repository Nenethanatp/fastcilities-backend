const { Booking, BookingTimeSlot, Facility, User } = require('../models');
const AppError = require('../utils/appError');

exports.createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { facilityId, bookingDate, bookingTimeSlot } = req.body;
    const booking = {
      facilityId,
      userId,
      bookingDate,
    };
    const { id } = await Booking.create(booking);

    const ResBookingTimeSlot = bookingTimeSlot.map((slot) => {
      return { slotTime: slot, bookingId: id };
    });
    // console.log(ResBookingTimeSlot);

    // [
    //   { slotTime: '17:00-17:30', bookingId: 54 },
    //   { slotTime: '19:00-19:30', bookingId: 54 }
    // ]

    await BookingTimeSlot.bulkCreate(ResBookingTimeSlot);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    next(err);
  }
};

exports.getMyBooking = async (req, res, next) => {
  try {
    const myBooking = await Booking.findAll({
      attributes: ['bookingDate', 'id'],
      order: [
        ['bookingDate', 'asc'],
        [BookingTimeSlot, 'slotTime', 'asc'],
      ],
      include: [
        { model: Facility, attributes: ['id', 'name', 'location', 'image'] },
        {
          model: BookingTimeSlot,
          attributes: ['slotTime'],
        },
      ],
      where: { userId: req.user.id },
    });

    if (!myBooking) {
      throw new AppError('You have no booking', 404);
    }
    const myBookingList = [];
    myBooking.forEach((booking) => {
      // console.log(JSON.parse(JSON.stringify(booking)));

      const bookingPeriod = [];
      booking.BookingTimeSlots.reduce((acc, slot, index) => {
        if (index === 0) {
          if (booking.BookingTimeSlots.length === 1) {
            bookingPeriod.push(slot.slotTime);
          }
          return slot.slotTime;
        } else {
          const startTime = slot.slotTime.split('-')[0];
          const endTime = slot.slotTime.split('-')[1];
          const startPreviousAcc = acc.split('-')[0];
          const endPreviousAcc = acc.split('-')[1];
          if (startTime === endPreviousAcc) {
            if (index === booking.BookingTimeSlots.length - 1) {
              bookingPeriod.push(`${startPreviousAcc}-${endTime}`);
            }
            return `${startPreviousAcc}-${endTime}`;
          } else {
            if (index === booking.BookingTimeSlots.length - 1) {
              bookingPeriod.push(`${startTime}-${endTime}`);
            }
            bookingPeriod.push(acc);

            return slot.slotTime;
          }
        }
      }, '');
      bookingPeriod.sort();

      const myBookingNewFormat = {
        bookingDate: booking.bookingDate,
        id: booking.id,
        Facility: booking.Facility,
        bookingPeriod: bookingPeriod,
      };
      myBookingList.push(myBookingNewFormat);
    });
    res.status(200).json({ myBookingList });
  } catch (err) {
    next(err);
  }
};

exports.deleteMyBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Booking.destroy({
      where: { id: Number(id) },
    });
    if (!result) {
      throw new AppError('No booking founded', 404);
    }
    res.status(200).json({ message: 'Delete successful' });
  } catch (err) {
    next(err);
  }
};

exports.getAllBooking = async (req, res, next) => {
  try {
    const allBooking = await Booking.findAll({
      attributes: ['bookingDate', 'id'],
      order: [['bookingDate', 'asc']],
      include: [
        { model: BookingTimeSlot, attributes: ['slotTime'] },
        { model: Facility, attributes: ['id', 'name', 'location', 'image'] },
        {
          model: User,
          attributes: ['id', 'studentId', 'firstName', 'lastName'],
        },
      ],
    });

    const allBookingList = [];
    allBooking.forEach((booking) => {
      const bookingPeriod = [];
      booking.BookingTimeSlots.reduce((acc, slot, index) => {
        if (index === 0) {
          if (booking.BookingTimeSlots.length === 1) {
            bookingPeriod.push(slot.slotTime);
          }
          return slot.slotTime;
        } else {
          const startTime = slot.slotTime.split('-')[0];
          const endTime = slot.slotTime.split('-')[1];
          const startPreviousAcc = acc.split('-')[0];
          const endPreviousAcc = acc.split('-')[1];
          if (startTime === endPreviousAcc) {
            if (index === booking.BookingTimeSlots.length - 1) {
              bookingPeriod.push(`${startPreviousAcc}-${endTime}`);
            }
            return `${startPreviousAcc}-${endTime}`;
          } else {
            if (index === booking.BookingTimeSlots.length - 1) {
              bookingPeriod.push(`${startTime}-${endTime}`);
            }
            bookingPeriod.push(acc);

            return slot.slotTime;
          }
        }
      }, '');
      bookingPeriod.sort();

      const allBookingNewFormat = {
        bookingDate: booking.bookingDate,
        bookingId: booking.id,
        bookingTimeSlot: bookingPeriod,
        Facility: booking.Facility,
        User: booking.User,
      };
      allBookingList.push(allBookingNewFormat);
    });

    res.status(200).json({ allBookingList });
  } catch (err) {
    next(err);
  }
};
