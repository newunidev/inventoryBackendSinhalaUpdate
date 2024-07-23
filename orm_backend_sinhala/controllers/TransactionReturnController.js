// const TransactionReturn = require('../model/TransactionReturn');
// const Product = require('../model/Product.js');
// const sequelize = require('../database/index'); // Import sequelize directly
// const { QueryTypes, Op } = require('sequelize');
// const Unit = require('../model/Unit.js');

// class TransactionReturnController {
//   async createTransaction(req, res) {
//     try {
//       const { prdId, transactionType, qty, unit, date, branch, createdBy, reason } = req.body;

//       // Ensure product exists before creating transaction
//       const product = await Product.findByPk(prdId);

//       if (!product) {
//         return res.status(400).json({
//           success: false,
//           message: 'Product not found'
//         });
//       }

//       // Adjust date to set time to 00:00:00
//       const adjustedDate = new Date(date);
//       adjustedDate.setUTCHours(0, 0, 0, 0);

//       const newTransaction = await TransactionReturn.create({
//         prdId,
//         transactionType,
//         qty,
//         unit,
         
//         date: adjustedDate, // Assign adjusted date
//         branch,
//         createdBy,
//         reason
//       });

//       res.status(200).json({
//         success: true,
//         message: 'Transaction created successfully',
//         transaction: newTransaction,
//       });
//     } catch (error) {
//       console.error('Error creating Transaction:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error'
//       });
//     }
//   }

  // async getTransactions(req, res) {
  //   try {
  //     // Fetch transactions without including product details
  //     const transactions = await TransactionReturn.findAll();

  //     // Create an array to store transactions with product details
  //     const transactionsWithDetails = [];

  //     // Loop through each transaction to fetch product details
  //     for (const transaction of transactions) {
  //       // Fetch product details for the current transaction
  //       const product = await Product.findByPk(transaction.prdId);
  //       const unit = await Unit.findByPk(transaction.unit);

  //       // Create a new object combining transaction data with product details
  //       const transactionWithDetails = {
  //         trrId: transaction.trrId,
  //         prdId: transaction.prdId,
  //         transactionType: transaction.transactionType,
  //         qty: transaction.qty,
  //         unit: transaction.unit,
          
  //         date: transaction.date,
  //         branch: transaction.branch,
  //         createdBy: transaction.createdBy,
  //         reason: transaction.reason,
  //         product: product, 
  //         unitmodel: unit// Include product details
  //       };

  //       // Push the combined object to the array
  //       transactionsWithDetails.push(transactionWithDetails);
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: 'Transactions retrieved successfully',
  //       transactions: transactionsWithDetails,
  //     });
  //   } catch (error) {
  //     console.error('Error retrieving Transactions:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Internal server error'
  //     });
  //   }
  // }

  // async getTransactionsByBranch(req, res) {
  //   try {
  //     const { branch } = req.query; // Get the branch from query parameters

  //     // Fetch transactions filtered by branch
  //     const transactions = await TransactionReturn.findAll({
  //       where: { branch: branch }
  //     });

  //     // Create an array to store transactions with product details
  //     const transactionsWithDetails = [];

  //     // Loop through each transaction to fetch product details
  //     for (const transaction of transactions) {
  //       // Fetch product details for the current transaction
  //       const product = await Product.findByPk(transaction.prdId);
  //       const unit = await Unit.findByPk(transaction.unit);
  //       // Create a new object combining transaction data with product details
  //       const transactionWithDetails = {
  //         trrId: transaction.trrId,
  //         prdId: transaction.prdId,
  //         transactionType: transaction.transactionType,
  //         qty: transaction.qty,
  //         unit: transaction.unit,
         
  //         date: transaction.date,
  //         branch: transaction.branch,
  //         createdBy: transaction.createdBy,
  //         reason: transaction.reason,
  //         product: product,
  //         unitmodel : unit // Include product details
  //       };

  //       // Push the combined object to the array
  //       transactionsWithDetails.push(transactionWithDetails);
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: `Transactions for branch ${branch} retrieved successfully`,
  //       transactions: transactionsWithDetails,
  //     });
  //   } catch (error) {
  //     console.error('Error retrieving Transactions by branch:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Internal server error'
  //     });
  //   }
  // }

   
   
// }

// module.exports = new TransactionReturnController();




const TransactionReturn = require('../model/TransactionReturn');
const Product = require('../model/Product.js');
const TransactionRelease = require('../model/TransactionRelease');
const Unit = require('../model/Unit.js');



const sequelize = require('../database/index'); // Import sequelize directly
//console.log('Sequelize instance beg:', sequelize); // This should now print the sequelize instance
const { QueryTypes,Op } = require('sequelize');

class TransactionReturnController {
  async createTransaction(req, res) {
    try {
      const { prdId, transactionType, qty, unit, date, branch, createdBy, reason, transactionReleaseId } = req.body;

      // Ensure product exists before creating transaction
      const product = await Product.findByPk(prdId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Ensure transaction release exists before creating transaction return
      const transactionRelease = await TransactionRelease.findByPk(transactionReleaseId);
      if (!transactionRelease) {
        return res.status(400).json({
          success: false,
          message: 'Transaction Release not found'
        });
      }

      // Adjust date to set time to 00:00:00
      const adjustedDate = new Date(date);
      adjustedDate.setUTCHours(0, 0, 0, 0);

      const newTransaction = await TransactionReturn.create({
        prdId,
        transactionType,
        qty,
        unit,
        date: adjustedDate, // Assign adjusted date
        branch,
        createdBy,
        reason,
        transactionReleaseId, // Assign the transaction release ID
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
      // Fetch transactions without including product details
      const transactions = await TransactionReturn.findAll();
  
      // Create an array to store transactions with product details
      const transactionsWithDetails = [];
  
      // Loop through each transaction to fetch product details
      for (const transaction of transactions) {
        // Fetch product, unit, and transaction release details for the current transaction
        const product = await Product.findByPk(transaction.prdId);
        const transactionRelease = await TransactionRelease.findByPk(transaction.transactionReleaseId);
        const unit = await Unit.findByPk(transaction.unit);
  
        // Create a new object combining transaction data with product details
        const transactionWithDetails = {
          trrId: transaction.trrId,
          prdId: transaction.prdId,
          transactionType: transaction.transactionType,
          qty: transaction.qty,
          unit: transaction.unit,
          date: transaction.date,
          branch: transaction.branch,
          createdBy: transaction.createdBy,
          reason: transaction.reason,
          treleaseId: transaction.transactionReleaseId,
          product: product,
          transactionRelease: transactionRelease,
          unitmodel: unit
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
      const transactions = await TransactionReturn.findAll({
        where: { branch: branch }
      });
  
      // Create an array to store transactions with product details
      const transactionsWithDetails = [];
  
      // Loop through each transaction to fetch product details
      for (const transaction of transactions) {
        // Fetch product, unit, and transaction release details for the current transaction
        const product = await Product.findByPk(transaction.prdId);
        const transactionRelease = await TransactionRelease.findByPk(transaction.transactionReleaseId);
        const unit = await Unit.findByPk(transaction.unit);
  
        // Create a new object combining transaction data with product details
        const transactionWithDetails = {
          trrId: transaction.trrId,
          prdId: transaction.prdId,
          transactionType: transaction.transactionType,
          qty: transaction.qty,
          unit: transaction.unit,
          date: transaction.date,
          branch: transaction.branch,
          createdBy: transaction.createdBy,
          reason: transaction.reason,
          treleaseId: transaction.transactionReleaseId,
          product: product,
          transactionRelease: transactionRelease,
          unitmodel: unit
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

  async getSumQtyByTransactionReleaseAndBranch(req, res) {
    try {
      const { transactionReleaseId, branch } = req.query; // Get the transactionReleaseId and branch from query parameters

      // Calculate the sum of the qty for the given transactionReleaseId and branch
      const result = await TransactionReturn.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty']
        ],
        where: {
          transactionReleaseId: transactionReleaseId,
          branch: branch
        }
      });

      res.status(200).json({
        success: true,
        message: `Total quantity for transaction release ${transactionReleaseId} in branch ${branch} retrieved successfully`,
        totalQty: result.dataValues.totalQty
      });
    } catch (error) {
      console.error('Error retrieving total quantity:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }



}

module.exports = new TransactionReturnController();
