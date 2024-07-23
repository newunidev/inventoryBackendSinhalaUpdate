// controllers/UnitController.js
const Unit = require('../model/Unit');

class UnitController {
  async createUnit(req, res) {
    try {
      const { u_name } = req.body;
      const newUnit = await Unit.create({ u_name });
      res.status(200).json({
        success: true,
        message: 'Unit created successfully',
        unit: newUnit
      });
    } catch (error) {
      console.error('Error creating Unit:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getUnits(req, res) {
    try {
      const units = await Unit.findAll();
      res.status(200).json({
        success: true,
        message: 'Units retrieved successfully',
        units: units
      });
    } catch (error) {
      console.error('Error retrieving Units:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  //method for get unit by unit name
  async getUnitIdByName(req, res) {
    try {
      const { u_name } = req.query;
      const unit = await Unit.findOne({
        where: { u_name: u_name }
      });

      if (!unit) {
        return res.status(404).json({
          success: false,
          message: 'Unit not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Unit retrieved successfully',
        unit_id: unit.u_id
      });
    } catch (error) {
      console.error('Error retrieving Unit by name:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new UnitController();
