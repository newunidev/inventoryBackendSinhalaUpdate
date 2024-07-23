const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import the Sequelize instance

// Define the Category model
const Category = sequelize.define('Category', {
  // Define model attributes
  catId: {
    type: DataTypes.STRING, // Change data type to STRING
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  catName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  catDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

// Before validating and creating a new category, modify the ID to include the prefix 'CAT'
Category.beforeValidate(async (category, options) => {
  if (!category.catId) {
    const count = await Category.count(); // Count existing categories
    const nextCategoryId = `CAT${(count + 1).toString().padStart(3, '0')}`; // Generate next categoryId
    category.catId = nextCategoryId;
  }
});

module.exports = Category;
