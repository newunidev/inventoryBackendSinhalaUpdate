const Category = require('../model/Category');

class CategoryController {
  async createCategory(req, res) {
    try {
      const { catName, catDescription } = req.body;
      console.log(catDescription);
      const newCategory = await Category.create({ catName, catDescription });
      res.status(200).json({
        success: true,
        message: 'Category created successfully',
        category: newCategory
      });
    } catch (error) {
      console.error('Error creating Category:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(200).json({
        success: true,
        message: 'Categories Retrieved successfully',
        categories: categories
      });
    } catch (error) {
      console.error('Error retrieving Categories:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new CategoryController();
