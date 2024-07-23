const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import the Sequelize instance
const Category = require('./Category'); // Import the Category model
const Supplier = require('./Supplier'); // Import the Supplier model

const Product = sequelize.define('Product', {
  // Define product attributes
  productId: {
    type: DataTypes.STRING, // Change data type to STRING
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Define foreign key for category
  categoryId: {
    type: DataTypes.STRING, // Change data type to STRING
    allowNull: false,
    references: {
      model: Category, // Reference the Category model
      key: 'catId', // Reference the primary key of Category
    },
  },
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
   
});

// Before validating and creating a new product, generate productId if not provided
Product.beforeValidate(async (product, options) => {
  if (!product.productId) {
    const count = await Product.count(); // Count existing products
    const nextProductId = `PRD${(count + 1).toString().padStart(3, '0')}`; // Generate next productId
    product.productId = nextProductId;
  }

  // Check for existing product with same productName and categoryId
const existingProduct = await Product.findOne({
  where: {
    productName: product.productName,
    categoryId: product.categoryId,
  },
});

if (existingProduct) {
  throw new Error('Product with the same name and category already exists.');
}


});





// Define association between Product and Category (optional but recommended)
Product.belongsTo(Category, { foreignKey: 'categoryId' });
 

 

module.exports = Product;
