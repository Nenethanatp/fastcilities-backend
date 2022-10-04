const { Booking, BookingTimeSlot, Facility } = require('../models');
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
    console.log(ResBookingTimeSlot);
    await BookingTimeSlot.bulkCreate(ResBookingTimeSlot);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    next(err);
  }
};

// exports.getMyBooking = async (req, res, next) => {
//   try {
//     const myBooking = await Booking.findAll({
//       attributes: ['bookingDate', 'id'],
//       include: [
//         { model: Facility, attributes: ['name', 'location', 'image'] },
//         { model: BookingTimeSlot, attributes: ['slotTime'] },
//       ],
//       where: { userId: req.user.id },
//     });

// const displayBooking = myBooking.map((booking) => {
// booking.bookingD

// })

// const expected =
// {
//   bookingDate: "2020-01-01",
//   id: 11,
//   Facility: {
//     name: "Meeting Room 1",
//     location: "Central Library, Floor 4 ",
//     image: null
//   },
//   BookingTimeSlots: [
//     {
//       slotTime: "17:00-17:30"
//     },
//     {
//       slotTime: "17:30-18:00"
//     }
//   ],
//   bookingTime : "17:00-18:00"
// }

//     res.json({ myBooking });

//   } catch (err) {
//     next(err);
//   }
// };

exports.deleteMyBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Booking.destroy({
      where: { id: Number(id) },
    });
    if (!result) {
      throw new AppError('No booking founded', 404);
    }
    res.status(200).json({ message: 'success' });
  } catch (err) {
    next(err);
  }
};
