const Stock = require('../model/Stock');
const Product = require('../model/Product');

class StockController {
  // Method to create a new stock
  // async createNewStock(req, res) {
  //   try {
  //     const { prd_id, current_qty, unit, branch, date } = req.body;
  //     console.log(branch);
  //     // Ensure the product exists before creating the stock
  //     const product = await Product.findByPk(prd_id);

  //     if (!product) {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'Product not found'
  //       });
  //     }


  //     // Adjust date to set time to 00:00:00
  //     const adjustedDate = new Date(date);
  //     adjustedDate.setUTCHours(0, 0, 0, 0);
  //     // Create the new stock
  //     const newStock = await Stock.create({
  //       prd_id,
  //       current_qty,
  //       unit,
  //       date : adjustedDate,
  //       branch,
  //     });

  //     res.status(200).json({
  //       success: true,
  //       message: 'Stock created successfully',
  //       stock: newStock,
  //     });
  //   } catch (error) {
  //     console.error('Error creating stock:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Internal server error'
  //     });
  //   }
  // }

  //Method createStock and resonsce with stock model and id
  async createNewStock(req, res) {
    try {
      const { prd_id, current_qty, unit, branch, date } = req.body;
  
      // Ensure the product exists before creating the stock
      const product = await Product.findByPk(prd_id);
  
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'Product not found'
        });
      }
  
      // Adjust date to set time to 00:00:00
      const adjustedDate = new Date(date);
      adjustedDate.setUTCHours(0, 0, 0, 0);
  
      // Create the new stock
      const newStock = await Stock.create({
        prd_id,
        current_qty,
        unit,
        date: adjustedDate,
        branch,
      });
  
      res.status(200).json({
        success: true,
        message: 'Stock created successfully',
        stockId: newStock.stock_id, // Include the newly created stock_id in the response
        stock: newStock, // Optionally include the entire newStock object in the response
      });
    } catch (error) {
      console.error('Error creating stock:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  // Method to retrieve all stocks based on branch
  async getStocksByBranch(req, res) {
    try {
      const { branch } = req.query;

      // Fetch stocks filtered by branch
      const stocks = await Stock.findAll({
        where: { branch: branch },
        include: [
          {
            model: Product,
            attributes: ['productId', 'productName', 'productDescription'], // Specify attributes to include from Product model
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: `Stocks for branch ${branch} retrieved successfully`,
        stocks: stocks,
      });
    } catch (error) {
      console.error('Error retrieving stocks by branch:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  //method to get product by branch
  async getProductsByBranch(req, res) {
    try {
      const { branch } = req.query;
  
      // Fetch all products associated with stocks in the specified branch
      const stocks = await Stock.findAll({
        where: { branch: branch },
        include: [
          {
            model: Product,
            attributes: ['productId', 'productName', 'productDescription'], // Specify attributes to include from Product model
          },
        ],
        group: ['prd_id'], // Group by prd_id to get unique products
        raw: true, // Return raw data instead of instances
      });
  
      // Map over stocks to extract and format product details
      const products = stocks.map(stock => ({
        productId: stock['Product.productId'],
        productName: stock['Product.productName'],
        productDescription: stock['Product.productDescription'],
      }));
  
      res.status(200).json({
        success: true,
        message: `Products for branch ${branch} retrieved successfully`,
        products: products,
      });
    } catch (error) {
      console.error('Error retrieving products by branch:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async updateStockQuantity(req, res) {
    try {
      const { prd_id, branch } = req.params; // Extract prd_id and branch from URL params
      const { quantity } = req.body; // Extract quantity from request body
  
      // Ensure the stock record exists before updating
      let stock = await Stock.findOne({
        where: {
          prd_id: prd_id,
          branch: branch,
        },
      });
  
      if (!stock) {
        return res.status(404).json({
          success: false,
          message: 'Stock not found',
        });
      }
  
      // Update the current_qty field of the stock record by adding the new quantity
      stock.current_qty += quantity;
      await stock.save();
  
      res.status(200).json({
        success: true,
        message: 'Stock quantity updated successfully',
        stock: stock,
      });
    } catch (error) {
      console.error('Error updating stock quantity:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  //method for release Quantity
  async updateStockQuantitySub(req, res) {
    try {
      const { prd_id, branch } = req.params; // Extract prd_id and branch from URL params
      const { quantity } = req.body; // Extract quantity from request body
  
      // Ensure the stock record exists before updating
      let stock = await Stock.findOne({
        where: {
          prd_id: prd_id,
          branch: branch,
        },
      });
  
      if (!stock) {
        return res.status(404).json({
          success: false,
          message: 'Stock not found',
        });
      }
  
      // Check if the current quantity is sufficient
      if (stock.current_qty < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Stock out: Insufficient quantity available',
        });
      }
  
      // Update the current_qty field of the stock record by subtracting the new quantity
      stock.current_qty -= quantity;
      await stock.save();
  
      res.status(200).json({
        success: true,
        message: 'Stock quantity updated successfully',
        stock: stock,
      });
    } catch (error) {
      console.error('Error updating stock quantity:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  //method to check stock record exist by branch and productId
  // Method to check if stock exists for given prd_id and branch
  async checkStockExists(req, res) {
    try {
      const { prd_id, branch } = req.query; // Extract prd_id and branch from query parameters
      console.log(prd_id, branch);

      // Find the stock record
      let stock = await Stock.findOne({
        where: {
          prd_id: prd_id,
          branch: branch,
        },
      });

      if (stock) {
        return res.status(200).json({
          success: true,
          exists: true,
        });
      } else {
        return res.status(200).json({
          success: true,
          exists: false,
        });
      }
    } catch (error) {
      console.error('Error checking stock existence:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }


  // Get Stock by productId,branch
  async getStockByProductAndBranch(req, res) {
    try {
      const { prd_id, branch } = req.query; // Extract prd_id and branch from URL parameters
      

      console.log(prd_id);
      console.log(branch);
      // Find the stock record
      let stock = await Stock.findOne({
        where: {
          prd_id: prd_id,
          branch: branch,
        },
        include: [
          {
            model: Product,
            attributes: ['productId', 'productName', 'productDescription'], // Specify attributes to include from Product model
          },
        ],
      });

      if (stock) {
        return res.status(200).json({
          success: true,
          stock: stock,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Stock not found',
        });
      }
    } catch (error) {
      console.error('Error retrieving stock:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }


}

module.exports = new StockController();
