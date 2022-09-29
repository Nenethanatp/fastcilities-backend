module.exports = (sequelize, DataTypes) => {
  const BookingTimeSlot = sequelize.define(
    'BookingTimeSlot',
    {
      slotTime: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      tableName: 'booking_time_slots',
      underscored: true,
    }
  );

  BookingTimeSlot.associate = (db) => {
    BookingTimeSlot.belongsTo(db.Booking, {
      foreignKey: {
        name: 'bookingId',
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      onDelete: 'RESTRICT',
    });
  };
  return BookingTimeSlot;
};
