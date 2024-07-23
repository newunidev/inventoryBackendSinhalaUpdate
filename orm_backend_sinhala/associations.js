// associations.js

const Product = require('./model/Product');
const Category = require('./model/Category');

// Define associations
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
  Product,
  Category,
  // Add other models and associations here if needed
};
