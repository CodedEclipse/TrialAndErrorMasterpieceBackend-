const adminService = require('../services/admin.service');

const AdminController = {
  testApi: async (req, res) => {
    try {
      await adminService.testApi(req, res);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = AdminController;
