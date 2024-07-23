const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust the path as necessary

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  factory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

User.beforeValidate(async (user, options) => {
  if (!user.userId) {
    const count = await User.count();
    const nextUserId = `U${(count + 1).toString().padStart(3, '0')}`;
    user.userId = nextUserId;
  }
});

module.exports = User;
