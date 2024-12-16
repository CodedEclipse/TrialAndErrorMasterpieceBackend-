const CustService = require('../services/customer.services');

const CustomerController = {
  CustomerRegistration: async (req, res) => {
    try {
      await CustService.CustomerRegistration(req, res);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = CustomerController;
