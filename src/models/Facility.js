module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define(
    'Facility',
    {
      type: {
        type: DataTypes.ENUM('Meeting Room', 'Badminton', 'Basketball'),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('open', 'close'),
        allowNull: false,
      },
      capacity: DataTypes.INTEGER,
      durationLimit: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      openTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      closeTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      openingDay: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'facilities',
      underscored: true,
    }
  );

  Facility.associate = (db) => {
    Facility.hasMany(db.Booking, {
      foreignKey: {
        name: 'facilityId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Facility;
};
