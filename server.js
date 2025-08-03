require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const contactRoutes = require("./routes/contact");
const catalogRoutes = require("./routes/catalog");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/submit-form", contactRoutes);
app.use("/request-catalog", catalogRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection failed", err));

  module.exports = app;

