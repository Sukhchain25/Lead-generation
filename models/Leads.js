const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  message: String,
  source: { type: String, enum: ["contact", "catalog"], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", leadSchema);
