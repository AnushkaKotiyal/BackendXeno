const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  avatar: { type: String, default: "" }, 
});

module.exports = mongoose.model("Users", userSchema);
