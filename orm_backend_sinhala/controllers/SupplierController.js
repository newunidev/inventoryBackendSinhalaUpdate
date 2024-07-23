const Supplier = require('../model/Supplier');

class SupplierController {
  async createSupplier(req, res) {
    try {
      const { name, contact, address, email } = req.body;
      const newSupplier = await Supplier.create({ name, contact, address, email });
      res.status(200).json({
        success: true,
        message: 'Supplier created successfully',
        supplier: newSupplier
      });
    } catch (error) {
      console.error('Error creating Supplier:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getSuppliers(req, res) {
    try {
      const suppliers = await Supplier.findAll();
      res.status(200).json({
        success: true,
        message: 'Suppliers Retrieved successfully',
        suppliers: suppliers
      });
    } catch (error) {
      console.error('Error retrieving Suppliers:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new SupplierController();
