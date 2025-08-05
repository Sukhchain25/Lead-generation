require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./utils/logger");

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
    logger.info("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      logger.info(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => logger.error("❌ MongoDB connection failed", err));

module.exports = app;
