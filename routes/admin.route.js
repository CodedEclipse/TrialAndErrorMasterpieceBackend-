const express = require('express');
const adminRoutes = express.Router();
const AdminController = require('../controllers/admin.controller');
const { decryptRequest, encryptResponse,  decryptRequestData,encryptResponseData } = require('../middlewares/EncryptDecrypt');


adminRoutes.use(decryptRequestData);
adminRoutes.use(encryptResponseData);

adminRoutes.get('/test', AdminController.testApi);
adminRoutes.post('/adminLogin', AdminController.adminLogin);
adminRoutes.post('/getHashPassword', AdminController.getHashPassword);

module.exports = adminRoutes;
