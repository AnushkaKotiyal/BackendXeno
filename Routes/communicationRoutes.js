const communicationRouter=require('express').Router();
const {
    mockVendorApi
}=require('../Controllers/communicationController');
const { authenticateUser } = require("../Middleware/auth");
communicationRouter.post('/vendor/send',authenticateUser,mockVendorApi);

module.exports=communicationRouter