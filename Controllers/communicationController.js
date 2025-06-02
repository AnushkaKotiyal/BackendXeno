const axios = require("axios");
const mockVendorApi = async (req, res) => {
  const { logId, campaignId } = req.body;
  const userId = req.user.id; 
  console.log("mock:", req.body);
  const isSuccess = Math.random() < 0.9;
  const status = isSuccess ? "Sent" : "Failed";
  if (!logId || !campaignId || !status) {
    console.error("Missing required fields:", { logId, campaignId, status });
    return res.status(400).json({ error: "Missing required fields" });
  }
  setTimeout(async () => {
    await axios.post("http://localhost:8080/campaigns/update-status", {
      userId,
      logId,
      campaignId,
      status,
    });
  }, 1000);

  res.status(200).json({ message: "Request accepted", status });
};
const sendViaVendorAPI = async ({ logId, campaignId, customerId, message,userId }) => {
  try { 
    await axios.post("http://localhost:8080/comm/vendor/send", {
      logId,
      userId,
      campaignId,
      customerId,
      message,
    });
    console.log(message);
  } catch (err) {
    console.error("Error sending to vendor API:", err.message);
  }
};


module.exports = {
  sendViaVendorAPI,
  mockVendorApi,
};
