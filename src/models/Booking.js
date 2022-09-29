module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    'Booking',
    {
      bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      cancelReason: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'bookings',
      underscored: true,
      paranoid: true,
    }
  );

  Booking.associate = (db) => {
    Booking.hasMany(db.BookingTimeSlot, {
      foreignKey: {
        name: 'bookingId',
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      onDelete: 'RESTRICT',
    });
    Booking.belongsTo(db.Facility, {
      foreignKey: {
        name: 'facilityId',
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      onDelete: 'RESTRICT',
    });
    Booking.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      onDelete: false,
    });
  };
  return Booking;
};
