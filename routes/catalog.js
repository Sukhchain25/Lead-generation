const express = require("express");
const router = express.Router();
const Lead = require("../models/Leads");
const sendMail = require("../mailer");

router.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    const lead = new Lead({ email, source: "catalog" });
    await lead.save();

    await sendMail(
      email,
      "Thanks for your interest in our catalog",
      `
      <p>Hi,</p>
      <p>We noticed you tried to download our catalog. Unfortunately, it's temporarily unavailable.</p>
      <p>We'll email it to you at <strong>${email}</strong> as soon as the issue is fixed.</p>
      <p>Thanks for your patience,<br/>CottonEdge Exports</p>
    `
    );

    res.status(500).json({
      success: false,
      message:
        "Oops! Something went wrong while downloading the catalog. We’ll email it to you soon.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

module.exports = router;
