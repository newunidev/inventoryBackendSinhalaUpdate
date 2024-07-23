const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import the Sequelize instance

// Define the Supplier model
const Supplier = sequelize.define('Supplier', {
  // Define model attributes
  supplierId: {
    type: DataTypes.STRING, // Change data type to STRING
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING(10), // Set the maximum length to 10 digits
    allowNull: false,
    validate: {
      isNumeric: true, // Ensure it contains only numeric characters
      len: [10, 10] // Validate the length to be exactly 10 characters
    }
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // Ensure it is in email format
    }
  }
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

// Before validating and creating a new supplier, modify the ID to include the prefix 'SUP'
Supplier.beforeValidate(async (supplier, options) => {
  if (!supplier.supplierId) {
    const count = await Supplier.count(); // Count existing suppliers
    const nextSupplierId = `SUP${(count + 1).toString().padStart(3, '0')}`; // Generate next supplierId
    supplier.supplierId = nextSupplierId;
  }
});



 



module.exports = Supplier;
