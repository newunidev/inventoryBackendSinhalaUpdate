const TransactionPurchase = require('../model/TransactionPurchase.js');
const Product = require('../model/Product.js');
const Supplier = require('../model/Supplier');
const Unit = require('../model/Unit.js'); 
const sequelize = require('../database/index'); // Import sequelize directly
//console.log('Sequelize instance beg:', sequelize); // This should now print the sequelize instance
const { QueryTypes,Op } = require('sequelize');



class TransactionPurchaseController {
  async createTransaction(req, res) {
    try {
      const { prId, supId, trType, qty, unit, price, date, branch, createdBy } = req.body;
  
      // Ensure product and supplier exist before creating transaction
      const [product, supplier] = await Promise.all([
        Product.findByPk(prId),
        Supplier.findByPk(supId),
      ]);
  
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'Product not found'
        });
      }
  
      if (!supplier) {
        return res.status(400).json({
          success: false,
          message: 'Supplier not found'
        });
      }
  
      // Adjust date to set time to 00:00:00
      const adjustedDate = new Date(date);
      adjustedDate.setUTCHours(0, 0, 0, 0);
  
      const newTransaction = await TransactionPurchase.create({
        prId,
        supId,
        trType,
        qty,
        unit,
        price,
        date: adjustedDate, // Assign adjusted date
        branch,
        createdBy
      });
  
      res.status(200).json({
        success: true,
        message: 'Transaction created successfully',
        transaction: newTransaction,
      });
    } catch (error) {
      console.error('Error creating Transaction:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  async getTransactions(req, res) {
    try {
      // Fetch transactions without including product and supplier details
      const transactions = await TransactionPurchase.findAll();

      // Create an array to store transactions with product and supplier details
      const transactionsWithDetails = [];

      // Loop through each transaction to fetch product and supplier details
      for (const transaction of transactions) {
        // Fetch product details for the current transaction
        const product = await Product.findByPk(transaction.prId);

        // Fetch supplier details for the current transaction
        const supplier = await Supplier.findByPk(transaction.supId);

        // Fetch Unit details for the current transaction
        const unit = await Unit.findByPk(transaction.unit);

        // Create a new object combining transaction data with product and supplier details
        const transactionWithDetails = {
          TrId: transaction.trId,
          PrId: transaction.prId,
          SupId: transaction.supId,
          TrType: transaction.trType,
          Qty: transaction.qty,
          Unit: transaction.unit,
          Price: transaction.price,
          Date: transaction.date,
          Branch: transaction.branch,
          CreatedBy: transaction.createdBy,
          Product: product, // Include product details
          Supplier: supplier,
          UnitModel:unit // Include supplier details
        };

        // Push the combined object to the array
        transactionsWithDetails.push(transactionWithDetails);
      }

      res.status(200).json({
        success: true,
        message: 'Transactions retrieved successfully',
        transactions: transactionsWithDetails,
      });
    } catch (error) {
      console.error('Error retrieving Transactions:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  async getTransactionsByBranch(req, res) {
    try {
      const { branch } = req.query; // Get the branch from query parameters

      // Fetch transactions filtered by branch
      const transactions = await TransactionPurchase.findAll({
        where: { branch: branch }
      });

      // Create an array to store transactions with product and supplier details
      const transactionsWithDetails = [];

      // Loop through each transaction to fetch product, supplier, and unit details
      for (const transaction of transactions) {
        // Fetch product details for the current transaction
        const product = await Product.findByPk(transaction.prId);

        // Fetch supplier details for the current transaction
        const supplier = await Supplier.findByPk(transaction.supId);

        // Fetch unit details for the current transaction
        const unit = await Unit.findByPk(transaction.unit);

        // Create a new object combining transaction data with product, supplier, and unit details
        const transactionWithDetails = {
          TrId: transaction.trId,
          PrId: transaction.prId,
          SupId: transaction.supId,
          TrType: transaction.trType,
          Qty: transaction.qty,
          Unit: transaction.unit,
          Price: transaction.price,
          Date: transaction.date,
          Branch: transaction.branch,
          CreatedBy: transaction.createdBy,
          Product: product, // Include product details
          Supplier: supplier,
          UnitModel: unit // Include unit details
        };

        // Push the combined object to the array
        transactionsWithDetails.push(transactionWithDetails);
      }

      res.status(200).json({
        success: true,
        message: `Transactions for branch ${branch} retrieved successfully`,
        transactions: transactionsWithDetails,
      });
    } catch (error) {
      console.error('Error retrieving Transactions by branch:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  async getTransactionsByBranchDateProductBetween(req, res) {
    try {
      const { branch,prId ,startDate, endDate } = req.query;

      console.log(startDate);
  
      // Test the Sequelize connection (optional)
      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (connectionError) {
        console.error('Unable to connect to the database:', connectionError);
        return res.status(500).json({
          success: false,
          message: 'Database connection error'
        });
      }
  
      // Construct the raw SQL query
      const query = `
        SELECT 
          tp.trId AS TrId,
          tp.prId AS PrId,
          tp.supId AS SupId,
          tp.trType AS TrType,
          tp.qty AS Qty,
          tp.unit AS Unit,
          tp.price AS Price,
          tp.date AS Date,
          tp.branch AS Branch,
          tp.createdBy AS CreatedBy,
          p.productName AS ProductName,
          p.productDescription AS ProductDescription,
          p.categoryId AS CategoryId,
          p.createdAt AS ProductCreatedAt,
          p.updatedAt AS ProductUpdatedAt,
          s.name AS SupplierName,
          s.contact AS SupplierContact,
          s.address AS SupplierAddress,
          s.email AS SupplierEmail,
          s.createdAt AS SupplierCreatedAt,
          s.updatedAt AS SupplierUpdatedAt,
          u.u_name AS UnitName,
          u.createdAt AS UnitCreatedAt,
          u.updatedAt AS UnitUpdatedAt
        FROM 
          TransactionPurchases tp
        JOIN 
          Products p ON tp.prId = p.productId
        JOIN 
          Suppliers s ON tp.supId = s.supplierId
        JOIN 
          Units u ON tp.unit = u.u_id
        WHERE 
          tp.branch = :branch
          AND tp.prId=:prId
          AND tp.date >= :startDate
          AND tp.date <= :endDate
        ORDER BY 
          tp.createdAt ASC;
      `;
  
      // Fetch transactions using raw SQL query
      const transactions = await sequelize.query(query, {
        replacements: { branch, prId,startDate, endDate },
        type: QueryTypes.SELECT,
      });
  
      // Format the response with structured transaction details
      const structuredResponse = transactions.map(transaction => ({
        TrId: transaction.TrId,
        PrId: transaction.PrId,
        SupId: transaction.SupId,
        TrType: transaction.TrType,
        Qty: transaction.Qty,
        Unit: transaction.Unit,
        Price: transaction.Price,
        Date: transaction.Date,
        Branch: transaction.Branch,
        CreatedBy: transaction.CreatedBy,
        Product: {
          productId: transaction.PrId,
          productName: transaction.ProductName,
          productDescription: transaction.ProductDescription,
          categoryId: transaction.CategoryId,
          createdAt: transaction.ProductCreatedAt,
          updatedAt: transaction.ProductUpdatedAt,
        },
        Supplier: {
          supplierId: transaction.SupId,
          name: transaction.SupplierName,
          contact: transaction.SupplierContact,
          address: transaction.SupplierAddress,
          email: transaction.SupplierEmail,
          createdAt: transaction.SupplierCreatedAt,
          updatedAt: transaction.SupplierUpdatedAt,
        },
        UnitModel: {
          u_id: transaction.Unit,
          u_name: transaction.UnitName,
          createdAt: transaction.UnitCreatedAt,
          updatedAt: transaction.UnitUpdatedAt,
        },
      }));
  
      // Send the formatted response
      res.status(200).json({
        success: true,
        message: `Transactions for branch ${branch} retrieved successfully`,
        transactions: structuredResponse,
      });
    } catch (error) {
      console.error('Error retrieving transactions by branch:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  //method to get all the product purchase list
  async getTransactionsByBranchDateBetween(req, res) {
    try {
      const { branch,startDate, endDate } = req.query;

      console.log(startDate);
  
      // Test the Sequelize connection (optional)
      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (connectionError) {
        console.error('Unable to connect to the database:', connectionError);
        return res.status(500).json({
          success: false,
          message: 'Database connection error'
        });
      }
  
      // Construct the raw SQL query
      const query = `
        SELECT 
          tp.trId AS TrId,
          tp.prId AS PrId,
          tp.supId AS SupId,
          tp.trType AS TrType,
          tp.qty AS Qty,
          tp.unit AS Unit,
          tp.price AS Price,
          tp.date AS Date,
          tp.branch AS Branch,
          tp.createdBy AS CreatedBy,
          p.productName AS ProductName,
          p.productDescription AS ProductDescription,
          p.categoryId AS CategoryId,
          p.createdAt AS ProductCreatedAt,
          p.updatedAt AS ProductUpdatedAt,
          s.name AS SupplierName,
          s.contact AS SupplierContact,
          s.address AS SupplierAddress,
          s.email AS SupplierEmail,
          s.createdAt AS SupplierCreatedAt,
          s.updatedAt AS SupplierUpdatedAt,
          u.u_name AS UnitName,
          u.createdAt AS UnitCreatedAt,
          u.updatedAt AS UnitUpdatedAt
        FROM 
          TransactionPurchases tp
        JOIN 
          Products p ON tp.prId = p.productId
        JOIN 
          Suppliers s ON tp.supId = s.supplierId
        JOIN 
          Units u ON tp.unit = u.u_id
        WHERE 
          tp.branch = :branch
           
          AND tp.date >= :startDate
          AND tp.date <= :endDate
        ORDER BY 
          tp.createdAt ASC;
      `;
  
      // Fetch transactions using raw SQL query
      const transactions = await sequelize.query(query, {
        replacements: { branch,startDate, endDate },
        type: QueryTypes.SELECT,
      });
  
      // Format the response with structured transaction details
      const structuredResponse = transactions.map(transaction => ({
        TrId: transaction.TrId,
        PrId: transaction.PrId,
        SupId: transaction.SupId,
        TrType: transaction.TrType,
        Qty: transaction.Qty,
        Unit: transaction.Unit,
        Price: transaction.Price,
        Date: transaction.Date,
        Branch: transaction.Branch,
        CreatedBy: transaction.CreatedBy,
        Product: {
          productId: transaction.PrId,
          productName: transaction.ProductName,
          productDescription: transaction.ProductDescription,
          categoryId: transaction.CategoryId,
          createdAt: transaction.ProductCreatedAt,
          updatedAt: transaction.ProductUpdatedAt,
        },
        Supplier: {
          supplierId: transaction.SupId,
          name: transaction.SupplierName,
          contact: transaction.SupplierContact,
          address: transaction.SupplierAddress,
          email: transaction.SupplierEmail,
          createdAt: transaction.SupplierCreatedAt,
          updatedAt: transaction.SupplierUpdatedAt,
        },
        UnitModel: {
          u_id: transaction.Unit,
          u_name: transaction.UnitName,
          createdAt: transaction.UnitCreatedAt,
          updatedAt: transaction.UnitUpdatedAt,
        },
      }));
  
      // Send the formatted response
      res.status(200).json({
        success: true,
        message: `Transactions for branch ${branch} retrieved successfully`,
        transactions: structuredResponse,
      });
    } catch (error) {
      console.error('Error retrieving transactions by branch:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }



   
}

module.exports = new TransactionPurchaseController();
