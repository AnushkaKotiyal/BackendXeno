const Campaign = require("../Models/Campaign");
const Segment = require("../Models/Segmentaion");
const Customer = require("../Models/Customer");
const CommunicationLog = require("../Models/CommunicationLog");
const { buildMongoQuery } = require("../Controllers/segmentationController");
const { sendViaVendorAPI } = require("../Controllers/communicationController");
const createCampaign = async (req, res) => {
  try {
    const {
      name,
      message,
      segmentId,
      startDate,
      endDate,
      priority,
      goal,
      budget,
      imageUrl,
    } = req.body;
    const userId = req.user.id; 
    const token=req.cookies.token;
    if (
      !name ||
      !message ||
      !segmentId ||
      !startDate ||
      !endDate ||
      !priority ||
      !goal
    ) {
      return res
        .status(400)
        .json({ error: "Please fill the mandatory fields" });
    }

     const segment = await Segment.findOne({ _id: segmentId, userId });
    if (!segment) return res.status(404).json({ error: "Segment not found" });
    if (!Array.isArray(segment.rules)) {
      return res
        .status(400)
        .json({ error: "Segment rules are missing or invalid" });
    }

    const mongoQuery = buildMongoQuery({
      conditions: segment.rules,
      operator: "AND",
    });

    const customers = await Customer.find({ ...mongoQuery, userId });

    const campaign = new Campaign({
      name,
      message,
      segmentId,
      startDate,
      endDate,
      priority,
      budget,
      imageUrl,
      userId
    });
    await campaign.save();

    const log = await CommunicationLog.create({
      campaignId: campaign._id,
      total: customers.length,
      status: "Pending",
      userId,
    });
    customers.forEach((c) => {
      const msg = `Hi ${c.name}, ${message}`;
      console.log("Token sent to vendor API:", token);
      sendViaVendorAPI({
        logId: log._id,
        campaignId: campaign._id,
        customerId: c._id,
        message: msg,
        userId,
        token
        
      });
    });

    res.status(201).json({ message: "Campaign created", campaign });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

const getAllCampaigns = async (req, res) => {
  try {
     const userId = req.user.id; 
    const campaigns = await Campaign.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    console.log('Received update:', req.body);
    const { logId, campaignId, status } = req.body;
    const userId = req.user.id; 
    await CommunicationLog.findOneAndUpdate({ _id: logId, userId }, { status });

    const allLogs = await CommunicationLog.find({ campaignId ,userId});
    console.log('All logs for campaign:', allLogs);

    const allSent = allLogs.every((log) => log.status === "Sent");
    const anyFailed = allLogs.some((log) => log.status === "Failed");

    const newStatus = allSent ? "Completed" : anyFailed ? "Failed" : "Running";

    await Campaign.findOneAndUpdate({ _id: campaignId, userId }, { status: newStatus });
    console.log(`Campaign status updated to: ${newStatus}`);

    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};


const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
     const userId = req.user.id; 
    const deleted = await Campaign.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ error: "Campaign not found" });
    res.status(200).json({ message: "Campaign deleted", segment: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete Campaign" });
  }
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  updateDeliveryStatus,
  deleteCampaign,
};