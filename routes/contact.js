const express = require("express");
const router = express.Router();
const Lead = require("../models/Leads");
const sendMail = require("../mailer");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const lead = new Lead({ name, email, message, source: "contact" });
    await lead.save();

    await sendMail(
      email,
      "Thanks for contacting CottonEdge!",
      `
      <p>Hi ${name || "there"},</p>
      <p>Thank you for reaching out to us. We'll get back to you shortly.</p>
      <p>Regards,<br/>CottonEdge Exports</p>
    `
    );

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

module.exports = router;
