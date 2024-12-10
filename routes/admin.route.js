const express = require('express');
const adminRoutes = express.Router();
const AdminController = require('../controllers/admin.controller');
const { decryptRequest, encryptResponse } = require('../middlewares/EncryptDecrypt');


adminRoutes.use(decryptRequest);
adminRoutes.use(encryptResponse);

adminRoutes.get('/test', AdminController.testApi);
adminRoutes.post('/adminLogin', AdminController.adminLogin);
adminRoutes.post('/getHashPassword', AdminController.getHashPassword);

module.exports = adminRoutes;
