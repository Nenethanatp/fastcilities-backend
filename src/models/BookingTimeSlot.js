module.exports = (sequelize, DataTypes) => {
  const BookingTimeSlot = sequelize.define(
    'BookingTimeSlot',
    {
      facilityTimeSlotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      slotTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'booking_time_slots',
      underscored: true,
      timestamps: false,
    }
  );

  BookingTimeSlot.associate = (db) => {
    BookingTimeSlot.belongsTo(db.Booking, {
      foreignKey: {
        name: 'bookingId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return BookingTimeSlot;
};
