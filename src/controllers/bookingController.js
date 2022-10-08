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
      console.log(JSON.parse(JSON.stringify(booking)));

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
            // console.log(acc);

            return slot.slotTime;
          }
        }
      }, '');
      bookingPeriod.sort();
      console.log(bookingPeriod);

      const myBookingNewFormat = {
        bookingDate: booking.bookingDate,
        id: booking.id,
        Facility: booking.Facility,
        bookingPeriod: bookingPeriod,
      };
      myBookingList.push(myBookingNewFormat);
    });
    res.json({ myBookingList });

    // res.json({ myBooking });

    // console.log(myBookingList);

    // })

    // const expected =
    //   {
    //     "myBookingList": [
    //         {
    //             "bookingDate": "2020-01-01",
    //             "id": 21,
    //             "Facility": {
    //                 "name": "Meeting Room 1",
    //                 "location": "Library at faculty of Engineering, Floor 3",
    //                 "image": null
    //             },
    //             "bookingPeriod": [
    //                 "13:00-14:30",
    //                 "19:00-20:00"
    //             ]
    //         },
    //         {
    //             "bookingDate": "2020-01-01",
    //             "id": 22,
    //             "Facility": {
    //                 "name": "Meeting Room 1",
    //                 "location": "Central Library, Floor 4 ",
    //                 "image": null
    //             },
    //             "bookingPeriod": [
    //                 "13:00-14:30"
    //             ]
    //         }
    //     ]
    // }
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
