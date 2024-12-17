const express = require('express');
const custRoutes = express.Router();
const { decryptRequestData,encryptResponseData } = require('../middlewares/EncryptDecrypt');
const CustomerController = require('../controllers/customer.controller');

custRoutes.use(decryptRequestData);
custRoutes.use(encryptResponseData);

custRoutes.post('/CustomerRegistration', CustomerController.CustomerRegistration);

module.exports = custRoutes;
