const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  name: {
    type: String,
    required: true,
    unique:true
  },
  segmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Segment",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  goal: {
    type: String,
  },
  budget: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Running", "Completed", "Cancelled"],
    default: "Pending",
  },

}, { timestamps: true });

module.exports = mongoose.model("Campaign", campaignSchema);
