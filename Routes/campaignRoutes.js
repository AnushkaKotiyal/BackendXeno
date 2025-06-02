const express = require('express');
const campaignRouter = express.Router();
const {
  createCampaign,
  getAllCampaigns,
  updateDeliveryStatus,
  deleteCampaign
} = require('../Controllers/campaignController');
const { authenticateUser } = require("../Middleware/auth");
campaignRouter.post('/',authenticateUser, createCampaign);
campaignRouter.get('/',authenticateUser, getAllCampaigns);
campaignRouter.post('/update-status',authenticateUser, updateDeliveryStatus);
campaignRouter.delete('/:id',authenticateUser, deleteCampaign);
module.exports = campaignRouter;
