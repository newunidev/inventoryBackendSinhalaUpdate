const TransactionRelease = require('../model/TransactionRelease');
const Product = require('../model/Product.js');
const Unit = require('../model/Unit.js');


const sequelize = require('../database/index'); // Import sequelize directly
//console.log('Sequelize instance beg:', sequelize); // This should now print the sequelize instance
const { QueryTypes,Op } = require('sequelize');

class TransactionReleaseController {
  // Method to create a new transaction
  async createTransaction(req, res) {
    
    try {
      const { pr_id, tr_type, qty,unit, date, branch,createdBy } = req.body;
      console.log(pr_id);
      // Ensure the product exists before creating the transaction
      const product = await Product.findByPk(pr_id);
       
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Adjust date to set time to 00:00:00
      const adjustedDate = new Date(date);
      adjustedDate.setUTCHours(0, 0, 0, 0);

      // Create the new transaction
      const newTransaction = await TransactionRelease.create({
        pr_id,
        tr_type,
        qty,
        unit,
        date :adjustedDate,
        branch,
        createdBy,
      });

      res.status(200).json({
        success: true,
        message: 'Transaction created successfully',
        transaction: newTransaction,
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Method to retrieve all transactions
  // Method to retrieve all transactions with product and unit details
  async getTransactions(req, res) {
    try {
      const transactions = await TransactionRelease.findAll();
      
      const transactionsWithDetails = [];

      for (const transaction of transactions) {
        const product = await Product.findByPk(transaction.pr_id);
        const unit = await Unit.findByPk(transaction.unit);

        const transactionWithDetails = {
          TrId: transaction.tr_id,
          PrId: transaction.pr_id,
          TrType: transaction.tr_type,
          Qty: transaction.qty,
          Unit: transaction.unit,
          Price: transaction.price,
          Date: transaction.date,
          Branch: transaction.branch,
          CreatedBy: transaction.createBy,
          Product: product,
          UnitModel: unit
        };

        transactionsWithDetails.push(transactionWithDetails);
      }

      res.status(200).json({
        success: true,
        message: 'Transactions retrieved successfully',
        transactions: transactionsWithDetails,
      });
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  // Method to retrieve transactions filtered by branch with product and unit details
  // Method to retrieve transactions filtered by branch with product and unit details
  async getTransactionsByBranch(req, res) {
    try {
      const { branch } = req.query; // Get the branch from query parameters
      
      // Fetch transactions filtered by branch
      const transactions = await TransactionRelease.findAll({
        where: { branch: branch }
      });

      const transactionsWithDetails = [];

      for (const transaction of transactions) {
        const product = await Product.findByPk(transaction.pr_id);
        const unit = await Unit.findByPk(transaction.unit);

        const transactionWithDetails = {
          TrId: transaction.t_id,          
          PrId: transaction.pr_id,
          TrType: transaction.tr_type,
          Qty: transaction.qty,
          Unit: transaction.unit,
          Price: transaction.price,
          Date: transaction.date,
          Branch: transaction.branch,
          CreatedBy: transaction.createdBy,  
          Product: product,
          UnitModel: unit
        };

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

  //method for get transactionReleases by branch dates between
  async getTransactionReleasesByBranchDateBetween(req, res) {
    try {
      const { branch, startDate, endDate } = req.query;
  
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
          tr.t_id AS TrId,
          tr.pr_id AS PrId,
          tr.tr_type AS TrType,
          tr.qty AS Qty,
          tr.unit AS Unit,
           
          tr.date AS Date,
          tr.branch AS Branch,
          tr.createdBy AS CreatedBy,
          p.productName AS ProductName,
          p.productDescription AS ProductDescription,
          p.categoryId AS CategoryId,
          p.createdAt AS ProductCreatedAt,
          p.updatedAt AS ProductUpdatedAt,
          u.u_name AS UnitName,
          u.createdAt AS UnitCreatedAt,
          u.updatedAt AS UnitUpdatedAt
        FROM 
          TransactionReleases tr
        JOIN 
          Products p ON tr.pr_id = p.productId
        JOIN 
          Units u ON tr.unit = u.u_id
        WHERE 
          tr.branch = :branch
          AND tr.date >= :startDate
          AND tr.date <= :endDate
        ORDER BY 
          tr.createdAt ASC;
      `;
  
      // Fetch transaction releases using raw SQL query
      const transactionReleases = await sequelize.query(query, {
        replacements: { branch, startDate, endDate },
        type: QueryTypes.SELECT,
      });
  
      // Format the response with structured transaction details
      const structuredResponse = transactionReleases.map(transaction => ({
        TrId: transaction.TrId,
        PrId: transaction.PrId,
        TrType: transaction.TrType,
        Qty: transaction.Qty,
        Unit: transaction.Unit,
        
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
        message: `Transaction releases for branch ${branch} retrieved successfully`,
        transactions: structuredResponse,
      });
    } catch (error) {
      console.error('Error retrieving transaction releases by branch:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  //method to get transaction Release by product data between
  //method for get transactionReleases by branch dates between
  async getTransactionReleasesByBranchProductDateBetween(req, res) {
    try {
      const { branch, prId,startDate, endDate } = req.query;
  
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
          tr.t_id AS TrId,
          tr.pr_id AS PrId,
          tr.tr_type AS TrType,
          tr.qty AS Qty,
          tr.unit AS Unit,
           
          tr.date AS Date,
          tr.branch AS Branch,
          tr.createdBy AS CreatedBy,
          p.productName AS ProductName,
          p.productDescription AS ProductDescription,
          p.categoryId AS CategoryId,
          p.createdAt AS ProductCreatedAt,
          p.updatedAt AS ProductUpdatedAt,
          u.u_name AS UnitName,
          u.createdAt AS UnitCreatedAt,
          u.updatedAt AS UnitUpdatedAt
        FROM 
          TransactionReleases tr
        JOIN 
          Products p ON tr.pr_id = p.productId
        JOIN 
          Units u ON tr.unit = u.u_id
        WHERE 
          tr.branch = :branch
          AND tr.date >= :startDate
          AND tr.date <= :endDate
          AND tr.pr_id =:prId
        ORDER BY 
          tr.createdAt ASC;
      `;
  
      // Fetch transaction releases using raw SQL query
      const transactionReleases = await sequelize.query(query, {
        replacements: { branch,prId ,startDate, endDate },
        type: QueryTypes.SELECT,
      });
  
      // Format the response with structured transaction details
      const structuredResponse = transactionReleases.map(transaction => ({
        TrId: transaction.TrId,
        PrId: transaction.PrId,
        TrType: transaction.TrType,
        Qty: transaction.Qty,
        Unit: transaction.Unit,
        
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
        message: `Transaction releases for branch ${branch} retrieved successfully`,
        transactions: structuredResponse,
      });
    } catch (error) {
      console.error('Error retrieving transaction releases by branch:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }


}

module.exports = new TransactionReleaseController();
