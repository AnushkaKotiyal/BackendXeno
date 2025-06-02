const express = require("express");
const customerRouter = express.Router(); 
const multer = require("multer");
const {uploadCustomerCSV,getAllCustomers} = require("../Controllers/customerController"); 
const { authenticateUser } = require("../Middleware/auth");
const upload = multer({ dest: "uploads/" });

customerRouter.post("/upload-customer",authenticateUser, upload.single("file"), uploadCustomerCSV);
customerRouter.get("/",authenticateUser, getAllCustomers);

module.exports=customerRouter