module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    'Booking',
    {
      bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
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
      },
      onDelete: 'RESTRICT',
    });
    Booking.belongsTo(db.Facility, {
      foreignKey: {
        name: 'facilityId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Booking.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: false,
    });
    Booking.belongsTo(db.Admin, {
      foreignKey: {
        name: 'canceledBy',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Booking;
};
