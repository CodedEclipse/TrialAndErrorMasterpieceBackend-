const express = require('express');
const adminRoutes = express.Router();
const AdminController = require('../controllers/admin.controller');
const { decryptRequestData,encryptResponseData } = require('../middlewares/EncryptDecrypt');
const jwtAdmin = require('../middlewares/AdminJwtToken')

adminRoutes.use(decryptRequestData);
adminRoutes.use(encryptResponseData);

adminRoutes.get('/test', AdminController.testApi);
adminRoutes.post('/adminLogin', AdminController.adminLogin);
adminRoutes.post('/getHashPassword',jwtAdmin, AdminController.getHashPassword);
adminRoutes.post('/logout',jwtAdmin, AdminController.logout);

module.exports = adminRoutes;
