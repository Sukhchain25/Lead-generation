const express = require("express");
const router = express.Router();
const Lead = require("../models/Leads");
const sendMail = require("../mailer");

router.post("/", async (req, res) => {
  const { name, email, message, companyName } = req.body;

  try {
    // Save the lead in the database
    const lead = new Lead({
      name,
      email,
      companyName,
      message,
      source: "contact",
    });
    await lead.save();

    // ✉️ Send auto-reply to the user
    await sendMail(
      email,
      "Thanks for contacting CottonEdge Exports!",
      `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
        <h2 style="color: #2a7f62;">Thank You for Reaching Out!</h2>
        <p>Hi ${name || "there"},</p>
        <p>We appreciate your interest in <strong>CottonEdge Exports</strong>. One of our team members will get back to you shortly to assist with your query.</p>
        <p>If you have any urgent concerns, feel free to contact us directly at <a href="mailto:contact@cottonedgeexports.in">contact@cottonedgeexports.in</a>.</p>
        <br/>
        <p>Warm regards,</p>
        <p><strong>CottonEdge Exports</strong><br/>Panipat, India</p>
      </div>
      `
    );

    // 📩 Send a copy of the lead to your business email
    await sendMail(
      "sukhchain.singh@cottonedgeexports.in",
      "📬 New Contact Form Submission - CottonEdge",
      `
      <div style="font-family: Arial, sans-serif; color: #444;">
        <h3>📥 New Lead Captured</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${companyName || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="margin-left: 1em; color: #666;">${message}</blockquote>
        <hr/>
        <p style="font-size: 0.9em;">This lead came through the <strong>contact form</strong>.</p>
      </div>
      `
    );

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("❌ Error in contact route:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

module.exports = router;
