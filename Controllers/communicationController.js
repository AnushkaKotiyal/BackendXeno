const axios = require("axios");

// This controller will be protected with authenticateUser middleware in the router
const mockVendorApi = async (req, res) => {
  const { logId, campaignId } = req.body;
  const userId = req.user.id; // This is set by the middleware after verifying the token

  console.log("mock:", req.body);

  const isSuccess = Math.random() < 0.9;
  const status = isSuccess ? "Sent" : "Failed";

  if (!logId || !campaignId || !status) {
    console.error("Missing required fields:", { logId, campaignId, status });
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Get the token from the request (middleware has verified it, now reuse for internal calls)
  const token = req.headers.authorization?.split(" ")[1];

  setTimeout(async () => {
    try {
      await axios.post(
        "http://localhost:8080/campaigns/update-status",
        {
          userId,
          logId,
          campaignId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error updating status internally:", err.message);
    }
  }, 1000);

  res.status(200).json({ message: "Request accepted", status });
};

// Used by backend code to trigger the vendor API
const sendViaVendorAPI = async ({
  logId,
  campaignId,
  customerId,
  message,
  userId,
  token, // Passed from caller
}) => {
  try {
    await axios.post(
      "http://localhost:8080/comm/vendor/send",
      {
        logId,
        userId,
        campaignId,
        customerId,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Sent via vendor API:", message);
  } catch (err) {
    console.error("Error sending to vendor API:", err.message);
  }
};

module.exports = {
  sendViaVendorAPI,
  mockVendorApi,
};
