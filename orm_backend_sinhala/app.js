const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database'); // Import the Sequelize instance
const User = require('./model/User'); // Import the User model
const Product = require('./model/Product.js');
const Unit = require('./model/Unit.js');
const TransactionPurchase = require('./model/TransactionPurchase.js');
const TransactionRelase = require('./model/TransactionRelease');
const TransactionReturn = require('./model/TransactionReturn');
const UnitCategorie = require('./model/UnitCategory');
const Stock = require('./model/Stock');
const StockTransaction = require('./model/StockTransaction');





const fs = require('fs'); // Import the file system module
const path = require('path');
const CategoryController = require('./controllers/CategoryController');
 
const SupplierController = require('./controllers/SupplierController');
const ProductController = require('./controllers/ProductController');
const TransactionPurchaseController = require('./controllers/TransactionPurchaseController.js');
const TransactionReleaseController = require('./controllers/TransactionReleaseController.js');
const TransactionReturnController = require('./controllers/TransactionReturnController.js');
const UnitController = require('./controllers/UnitController.js');
const UnitCategoryController = require('./controllers/UnitCategoryController');
const UserController = require('./controllers/UserController.js');
const StockController = require('./controllers/StockController.js');
const StockTransactionController = require('./controllers/StcokTransactionController.js');


// Import associations
require('./associations'); // This will execute associations.js and set up associations
 

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and URL-encoded request bodies with increased payload size limit
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Route for uploading files
app.post('/upload', (req, res) => {
  // Get the file data and image name from the request body
  const fileData = req.body.image;
  const imageName = req.body.imgName;

  // Check if file data and image name are provided
  if (!fileData || !imageName) {
    return res.status(400).send('Missing file data or image name.');
  }

  // Decode the base64-encoded file data
  const decodedFileData = Buffer.from(fileData, 'base64');

  // Define the file path where you want to save the image
  const filePath = `D:/Java Projects/DB Images Check/${imageName}`; // Construct the file path with the image name

  // Write the decoded file data to the file
  fs.writeFile(filePath, decodedFileData, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('Error saving file.');
    }
    console.log('File saved successfully:', filePath);
    res.send('File uploaded and saved successfully.');
  });
});

// Routes for categories
app.post('/categories', CategoryController.createCategory);
app.get('/categories', CategoryController.getCategories);

 

// Routes for suppliers
app.post('/suppliers', SupplierController.createSupplier);
app.get('/suppliers', SupplierController.getSuppliers);


//Routes for products
 // Routes for Products
app.post('/products', ProductController.createProduct);
app.get('/products', ProductController.getProducts);
app.get('/productsbycatid', ProductController.getProductsByCategoryId);





//Routes for Transaction Purchase
app.post('/trasactionpurchases', TransactionPurchaseController.createTransaction);
app.get('/trasactionpurchases',TransactionPurchaseController.getTransactions);
app.get('/trasactionpurchasesbybranch',TransactionPurchaseController.getTransactionsByBranch);
app.get('/trasactionpurchasesbybranchdatebetween',TransactionPurchaseController.getTransactionsByBranchDateBetween);
app.get('/trasactionpurchasesbybranchProductdatebetween',TransactionPurchaseController.getTransactionsByBranchDateProductBetween);
 

//Routes for Transaction Release
app.post('/trasactionreleases', TransactionReleaseController.createTransaction);
app.get('/trasactionreleases',TransactionReleaseController.getTransactions);
app.get('/trasactionreleasesbybranch',TransactionReleaseController.getTransactionsByBranch);
app.get('/trasactionreleasesbybranchdatebetween',TransactionReleaseController.getTransactionReleasesByBranchDateBetween);
app.get('/trasactionreleasesbybranchproductdatebetween',TransactionReleaseController.getTransactionReleasesByBranchProductDateBetween);



//Routes for Transaction Returns
app.post('/trasactionreturn', TransactionReturnController.createTransaction);
app.get('/trasactionreturns',TransactionReturnController.getTransactions);
app.get('/trasactionreturnsbybranch',TransactionReturnController.getTransactionsByBranch);
app.get('/trasactionreturnqtybybranchreleaseid',TransactionReturnController.getSumQtyByTransactionReleaseAndBranch);




//Routes for Unit
app.post('/units', UnitController.createUnit);
app.get('/units',UnitController.getUnits);
app.get('/unitsbyname',UnitController.getUnitIdByName);



// Routes for unit categories
app.post('/unitcategories', UnitCategoryController.createUnitCategory);
app.get('/unitcategories', UnitCategoryController.getUnitCategories);
app.get('/unitcategoriesbycatId', UnitCategoryController.getUnitCategoriesByCatId);
 



//routes for Stock

app.post('/stocks',StockController.createNewStock);
app.get('/stocks',StockController.getStocksByBranch);
app.get('/stockisavailable',StockController.checkStockExists);
app.get('/stockbyproductidbranch',StockController.getStockByProductAndBranch);
app.get('/stockproductbybranch',StockController.getProductsByBranch);
app.put('/stocks/:prd_id/:branch', StockController.updateStockQuantity);
app.put('/stockssub/:prd_id/:branch', StockController.updateStockQuantitySub);






//routes for stockTransactions
app.post('/stocktransactions',StockTransactionController.createNewStockTransaction);
app.get('/stocktransactions',StockTransactionController.getAllStockTransactions);
app.get('/stocktransactionsbydatebranch',StockTransactionController.getStockTransactionsByBranchAndDate);
app.get('/stocktransactionsbydatebranchfordailyissuinglist',StockTransactionController.getStockTransactionsByBranchAndDateForDailyIssuingList);



//routes for User
app.post('/users',UserController.createUser);
app.post('/login', UserController.login);
app.get('/userdetailbyemail',UserController.getUserInfo);





// Start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error syncing database:', err);
});

module.exports = app;