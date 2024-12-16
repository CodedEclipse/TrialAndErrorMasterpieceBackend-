const express = require('express');
const adminRoutes = express.Router();
const { decryptRequestData,encryptResponseData } = require('../middlewares/EncryptDecrypt');
const CustomerController = require('../controllers/customer.controller');

adminRoutes.use(decryptRequestData);
adminRoutes.use(encryptResponseData);

adminRoutes.post('/CustomerRegistration', CustomerController.CustomerRegistration);

module.exports = adminRoutes;
