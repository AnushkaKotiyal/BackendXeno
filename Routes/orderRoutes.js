const express = require('express');
const orderRouter = express.Router();
const { uploadOrdersCSV, getAllOrders } = require('../Controllers/ordersController');

// If you want file upload support, you need multer middleware here
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // temp folder for uploads
const { authenticateUser } = require("../Middleware/auth");
orderRouter.post('/upload',authenticateUser, upload.single('file'), uploadOrdersCSV);
orderRouter.get('/',authenticateUser, getAllOrders);

module.exports = orderRouter;
