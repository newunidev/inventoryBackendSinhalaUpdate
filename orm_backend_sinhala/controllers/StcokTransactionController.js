// const StockTransaction = require('../model/StockTransaction');
// const Stock = require('../model/Stock');

// const { sequelize } = require('../database/index');
// console.log('Sequelize instance beg:', sequelize);
// const { QueryTypes } = require('sequelize');


// class StockTransactionController {
//   // Method to create a new stock transaction
//   async createNewStockTransaction(req, res) {
//     try {
//       const { StockId, PreviousQty, PurchaseQty, ReleaseQty, Unit, TransType, Date: date, Branch } = req.body;
//       console.log("Man Create Karanna Awa Yako");
//       // Ensure the stock exists before creating the transaction
//       const stock = await Stock.findByPk(StockId);

//       if (!stock) {
//         return res.status(400).json({
//           success: false,
//           message: 'Stock not found'
//         });
//       }

//       // Parse the date and set time to 00:00:00
//       const parsedDate = new Date(date);
//       if (isNaN(parsedDate)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid date format'
//         });
//       }
//       parsedDate.setUTCHours(0, 0, 0, 0);

//       // Create the new stock transaction
//       const newStockTransaction = await StockTransaction.create({
//         StockId,
//         PreviousQty,
//         PurchaseQty,
//         ReleaseQty,
//         Unit,
//         TransType,
//         Date: parsedDate,
//         Branch,
//       });

//       res.status(200).json({
//         success: true,
//         message: 'Stock transaction created successfully',
//         stockTransaction: newStockTransaction,
//       });
//     } catch (error) {
//       console.error('Error creating stock transaction:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error'
//       });
//     }
//   }

//   // Method to retrieve all stock transactions
//   async getAllStockTransactions(req, res) {
//     try {
//       // Fetch all stock transactions
//       const stockTransactions = await StockTransaction.findAll({
//         include: [
//           {
//             model: Stock,
//             attributes: ['stock_id', 'prd_id', 'current_qty', 'unit', 'branch', 'date'], // Specify attributes to include from Stock model
//           },
//         ],
//       });

//       res.status(200).json({
//         success: true,
//         message: 'Stock transactions retrieved successfully',
//         stockTransactions: stockTransactions,
//       });
//     } catch (error) {
//       console.error('Error retrieving stock transactions:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error'
//       });
//     }
//   }

//   //emtohd to get stock movements by upto date and branch
//   async getStockTransactionsByBranchAndDate(req, res) {
//     try {
//       const { branch, date } = req.params;
  
//       // Log the sequelize instance to ensure it's not undefined
//       console.log('Sequelize instance:', sequelize);
  
//       // Test the Sequelize connection
//       try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//       } catch (connectionError) {
//         console.error('Unable to connect to the database:', connectionError);
//         return res.status(500).json({
//           success: false,
//           message: 'Database connection error'
//         });
//       }
  
//       const query = `
//         SELECT 
//             s.Branch AS Branch,
//             p.productName AS ProductName,
//             s.stock_id AS StockId,
//             COALESCE(st.PurchaseQty, 0) AS PurchaseQty,
//             COALESCE(st.ReleaseQty, 0) AS ReleaseQty,
//             st.Date AS Date,
//             st.Unit AS Unit
//         FROM 
//             stockTransactions st
//         JOIN 
//             stocks s ON st.StockId = s.stock_id
//         JOIN 
//             Products p ON s.prd_id = p.productId
//         WHERE 
//             st.Branch = :branch
//             AND st.Date <= :date
//       `;
  
//       const stockTransactions = await sequelize.query(query, {
//         replacements: { branch, date },
//         type: QueryTypes.SELECT,
//       });
  
//       res.status(200).json({
//         success: true,
//         message: `Stock transactions for branch ${branch} retrieved successfully`,
//         stockTransactions: stockTransactions,
//       });
//     } catch (error) {
//       console.error('Error retrieving stock transactions:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//       });
//     }
//   }

// }

// module.exports = new StockTransactionController();



const StockTransaction = require('../model/StockTransaction');
const Stock = require('../model/Stock');

const sequelize = require('../database/index'); // Import sequelize directly
//console.log('Sequelize instance beg:', sequelize); // This should now print the sequelize instance
const { QueryTypes,Op } = require('sequelize');

 
const Product = require('../model/Product'); 

class StockTransactionController {
  // Method to create a new stock transaction
  async createNewStockTransaction(req, res) {
    try {
      const { StockId, PreviousQty, PurchaseQty, ReleaseQty, Unit, TransType, Date: date, Branch } = req.body;
       
      // Ensure the stock exists before creating the transaction
      const stock = await Stock.findByPk(StockId);

      if (!stock) {
        return res.status(400).json({
          success: false,
          message: 'Stock not found'
        });
      }

      // Parse the date and set time to 00:00:00
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
      parsedDate.setUTCHours(0, 0, 0, 0);

      // Create the new stock transaction
      const newStockTransaction = await StockTransaction.create({
        StockId,
        PreviousQty,
        PurchaseQty,
        ReleaseQty,
        Unit,
        TransType,
        Date: parsedDate,
        Branch,
      });

      res.status(200).json({
        success: true,
        message: 'Stock transaction created successfully',
        stockTransaction: newStockTransaction,
      });
    } catch (error) {
      console.error('Error creating stock transaction:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Method to retrieve all stock transactions
  async getAllStockTransactions(req, res) {
    try {
      // Fetch all stock transactions
      const stockTransactions = await StockTransaction.findAll({
        include: [
          {
            model: Stock,
            attributes: ['stock_id', 'prd_id', 'current_qty', 'unit', 'branch', 'date'], // Specify attributes to include from Stock model
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: 'Stock transactions retrieved successfully',
        stockTransactions: stockTransactions,
      });
    } catch (error) {
      console.error('Error retrieving stock transactions:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // async getStockTransactionsByBranchAndDate(req, res) {
  //   try {
  //     const { branch, date } = req.query; // Use req.query to access query parameters
  //     console.log(branch);
  
  //     // Log the sequelize instance to ensure it's not undefined
  //     // console.log('Sequelize instance:', sequelize);
  
  //     // Test the Sequelize connection
  //     try {
  //       await sequelize.authenticate();
  //       console.log('Connection has been established successfully.');
  //     } catch (connectionError) {
  //       console.error('Unable to connect to the database:', connectionError);
  //       return res.status(500).json({
  //         success: false,
  //         message: 'Database connection error'
  //       });
  //     }
  
  //     const query = `
  //       SELECT 
  //           s.Branch AS Branch,
  //           p.productName AS ProductName,
  //           s.stock_id AS StockId,
  //           COALESCE(st.PurchaseQty, 0) AS PurchaseQty,
  //           COALESCE(st.ReleaseQty, 0) AS ReleaseQty,
  //           st.Date AS Date,
  //           st.Unit AS Unit
  //       FROM 
  //           stockTransactions st
  //       JOIN 
  //           stocks s ON st.StockId = s.stock_id
  //       JOIN 
  //           Products p ON s.prd_id = p.productId
  //       WHERE 
  //           st.Branch = :branch
  //           AND st.Date <= :date
  //     `;
  
  //     const stockTransactions = await sequelize.query(query, {
  //       replacements: { branch, date }, // Pass replacements correctly
  //       type: QueryTypes.SELECT,
  //     });
  
  //     res.status(200).json({
  //       success: true,
  //       message: `Stock transactions for branch ${branch} retrieved successfully`,
  //       stockTransactions: stockTransactions,
  //     });
  //   } catch (error) {
  //     console.error('Error retrieving stock transactions:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Internal server error',
  //     });
  //   }
  // }
  async getStockTransactionsByBranchAndDate(req, res) {
    try {
      const { branch, date,prdId } = req.query;

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

      // Fetch stock transactions using raw SQL query
      const stockTransactions = await sequelize.query(
          `
          SELECT 
              st.SRCID AS SRCID,
              s.stock_id AS StockId,
              COALESCE(st.PurchaseQty, 0) AS PurchaseQty,
              COALESCE(st.ReleaseQty, 0) AS ReleaseQty,
              st.Date AS Date,
              st.Unit AS Unit,
              st.TransType AS TransType,
              s.Branch AS Branch,
              p.productName AS ProductName,
              s.current_qty AS PreviousQty,
              s.unit AS Unit,
              st.createdAt AS createdAt,
              st.updatedAt AS updatedAt
          FROM 
              stockTransactions st
          JOIN 
              stocks s ON st.StockId = s.stock_id
          JOIN 
              Products p ON s.prd_id = p.productId
          WHERE 
              st.Branch = :branch
              AND st.Date <= :date
              AND s.prd_id = :prdId
          ORDER BY 
             st.createdAt ASC;
          `,
          {
              replacements: { branch, date,prdId },
              type: QueryTypes.SELECT,
          }
      );

      // Format the response with structured Stock and Product sections
      const structuredResponse = stockTransactions.map(transaction => ({
          SRCID: transaction.SRCID,
          StockId: transaction.StockId,
          Branch: transaction.Branch,
          ProductName: transaction.ProductName,
          PurchaseQty: transaction.PurchaseQty,
          ReleaseQty: transaction.ReleaseQty,
          TransType:transaction.TransType,
          Date: transaction.Date,
          Unit: transaction.Unit,
          Stock: {
              StockId: transaction.StockId,
              PreviousQty: transaction.PreviousQty,
              Unit: transaction.Unit,
              Date: transaction.Date,
              createdAt: transaction.createdAt,
              updatedAt: transaction.updatedAt,
          },
          Product: {
              productId: transaction.productId, // Ensure this matches the column name in your SQL query
              productName: transaction.ProductName, // Ensure this matches the column name in your SQL query
          }
      }));

      // Send the formatted response
      res.status(200).json({
          success: true,
          message: `Stock transactions for branch ${branch} retrieved successfully`,
          stockTransactions: structuredResponse,
      });
    } catch (error) {
        console.error('Error retrieving stock transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
  }


  //method to get daily issued product list get by stock transaction
  async getStockTransactionsByBranchAndDateForDailyIssuingList(req, res) {
    try {
      const { branch, date} = req.query;

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

      // Fetch stock transactions using raw SQL query
      const stockTransactions = await sequelize.query(
          `
          SELECT 
              st.SRCID AS SRCID,
              s.stock_id AS StockId,
              COALESCE(st.PurchaseQty, 0) AS PurchaseQty,
              COALESCE(st.ReleaseQty, 0) AS ReleaseQty,
              st.Date AS Date,
              st.Unit AS Unit,
              s.Branch AS Branch,
              p.productName AS ProductName,
              s.current_qty AS PreviousQty,
              s.unit AS Unit,
              st.createdAt AS createdAt,
              st.updatedAt AS updatedAt
          FROM 
              stockTransactions st
          JOIN 
              stocks s ON st.StockId = s.stock_id
          JOIN 
              Products p ON s.prd_id = p.productId
          WHERE 
              st.Branch = :branch
              AND st.Date = :date
              AND st.TransType = "Release"
          `,
          {
              replacements: { branch, date},
              type: QueryTypes.SELECT,
          }
      );

      // Format the response with structured Stock and Product sections
      const structuredResponse = stockTransactions.map(transaction => ({
          SRCID: transaction.SRCID,
          StockId: transaction.StockId,
          Branch: transaction.Branch,
          ProductName: transaction.ProductName,
          PurchaseQty: transaction.PurchaseQty,
          ReleaseQty: transaction.ReleaseQty,
          Date: transaction.Date,
          Unit: transaction.Unit,
          Stock: {
              StockId: transaction.StockId,
              PreviousQty: transaction.PreviousQty,
              Unit: transaction.Unit,
              Date: transaction.Date,
              createdAt: transaction.createdAt,
              updatedAt: transaction.updatedAt,
          },
          Product: {
              productId: transaction.productId, // Ensure this matches the column name in your SQL query
              productName: transaction.ProductName, // Ensure this matches the column name in your SQL query
          }
      }));

      // Send the formatted response
      res.status(200).json({
          success: true,
          message: `Stock transactions for branch ${branch} retrieved successfully`,
          stockTransactions: structuredResponse,
      });
    } catch (error) {
        console.error('Error retrieving stock transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
  }
}

module.exports = new StockTransactionController();
