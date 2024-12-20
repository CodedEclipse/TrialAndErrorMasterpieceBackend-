const express = require('express');
const adminRoutes = express.Router();
const AdminController = require('../controllers/admin.controller');
const CustomerController = require('../controllers/customer.controller');
const { decryptRequestData,encryptResponseData } = require('../middlewares/EncryptDecrypt');
const jwtAdmin = require('../middlewares/AdminJwtToken')

adminRoutes.use(decryptRequestData);
adminRoutes.use(encryptResponseData);

adminRoutes.get('/test', AdminController.testApi);
adminRoutes.get('/get_states', AdminController.get_states); 
adminRoutes.get('/year_list', AdminController.year_list);
adminRoutes.post('/adminLogin', AdminController.adminLogin);
adminRoutes.post('/make_visible', AdminController.make_visible);

adminRoutes.post('/getHashPassword',jwtAdmin, AdminController.getHashPassword);
adminRoutes.post('/logout',jwtAdmin, AdminController.logout);

// customer
adminRoutes.post('/CustomerList',jwtAdmin, CustomerController.CustomerList);

module.exports = adminRoutes;
