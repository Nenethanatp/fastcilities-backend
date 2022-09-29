module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      studentId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      faculty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        defaultValue: 'user',
      },
    },
    {
      tableName: 'users',
      underscored: true,
    }
  );

  User.associate = (db) => {
    User.hasMany(db.Booking, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: false,
    });
  };
  return User;
};
