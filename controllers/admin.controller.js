const adminService = require('../services/admin.service');

const AdminController = {
  testApi: async (req, res) => {
    try {
      await adminService.testApi(req, res);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  get_states: async (req, res) => {
    try {
      await adminService.get_states(req, res);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  year_list: async (req, res) => {
    try {
      await adminService.year_list(req, res);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  adminLogin: async (req, res) => {
    try {
      await adminService.adminLogin(req, res);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getHashPassword: async (req, res) => {
    try {
      await adminService.getHashPassword(req, res);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  make_visible: async (req, res) => {
    try {
      await adminService.make_visible(req, res);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  logout: async (req, res) => {
    console.log('vnidnvdcnn');
    
    try {
      await adminService.logout(req, res);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = AdminController;
