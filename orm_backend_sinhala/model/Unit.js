const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust the path as necessary

const Unit = sequelize.define('Unit', {
  u_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  u_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

Unit.beforeValidate(async (unit, options) => {
  if (!unit.u_id) {
    const count = await Unit.count();
    const nextUnitId = `U${(count + 1).toString().padStart(3, '0')}`;
    unit.u_id = nextUnitId;
  }
});



module.exports = Unit;
