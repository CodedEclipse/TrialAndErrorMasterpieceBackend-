const express = require('express');
const adminRoutes = express.Router();
const AdminController = require('../controllers/admin.controller');


adminRoutes.get('/test', AdminController.testApi); 

module.exports = adminRoutes;
