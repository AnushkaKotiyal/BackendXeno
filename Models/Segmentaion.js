const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true
  },
  operator: {
    type: String,
    enum: ['>', '<', '>=', '<=', '=', '!='],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  logic: {
    type: String,
    enum: ['AND', 'OR'],
    default: 'AND'
  }
});

const segmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  rules: {
    type: [ruleSchema],
    required: true,
    validate: r => r.length > 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Segment', segmentSchema);
