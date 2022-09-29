module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define(
    'Facility',
    {
      type: {
        type: DataTypes.ENUM('Meeting Room', 'Badminton', 'Basketball'),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM('open', 'close'),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      capacity: DataTypes.INTEGER,
      durationLimit: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      openTime: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      closeTime: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      openingDay: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
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
        validate: {
          notEmpty: true,
        },
      },
      onDelete: 'RESTRICT',
    });
  };
  return Facility;
};
