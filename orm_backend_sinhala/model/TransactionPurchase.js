const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import the Sequelize instance
const Product = require('./Product.js'); // Import the Product model
const Supplier = require('./Supplier'); // Import the Supplier model

const TransactionPurchase = sequelize.define('TransactionPurchase', {
  // Define transaction attributes
  trId: {
    type: DataTypes.STRING, // Change data type to STRING
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  // Define foreign key for product
  prId: {
    type: DataTypes.STRING, // Change data type to STRING
    allowNull: false,
    references: {
      model: Product, // Reference the Product model
      key: 'productId', // Reference the primary key of Product
    },
  },
  // Define foreign key for supplier
  supId: {
    type: DataTypes.STRING, // Change data type to STRING
    allowNull: false,
    references: {
      model: Supplier, // Reference the Supplier model
      key: 'supplierId', // Reference the primary key of Supplier
    },
  },
  trType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull:false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy:{
    type:DataTypes.STRING,
    allowNull: false,
  }
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

// Before validating and creating a new transaction, generate trId if not provided
TransactionPurchase.beforeValidate(async (transaction, options) => {
  if (!transaction.trId) {
    const count = await TransactionPurchase.count(); // Count existing transactions
    const nextTransactionId = `TRS${(count + 1).toString().padStart(3, '0')}`; // Generate next trId
    transaction.trId = nextTransactionId;
  }
});

// Define associations between TransactionPurchase, Product, and Supplier (optional but recommended)
TransactionPurchase.belongsTo(Product, { foreignKey: 'prId' });
TransactionPurchase.belongsTo(Supplier, { foreignKey: 'supId' });

module.exports = TransactionPurchase;
