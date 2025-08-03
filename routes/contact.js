const express = require("express");
const router = express.Router();
const Lead = require("../models/Leads");
const sendMail = require("../mailer");

router.post("/", async (req, res) => {
  const { name, email, message, companyName } = req.body;

  try {
    const lead = new Lead({
      name,
      email,
      companyName,
      message,
      source: "contact",
    });
    await lead.save();

    // Send confirmation to user
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

    // Send internal notification to you
    await sendMail(
      "sukhchain.singh@cottonedgeexports.in",
      "📬 New Contact Form Submission - CottonEdge",
      `
        <h2>New Inquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${companyName || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${message}</blockquote>
        <br/>
        <p>🕐 Received on: ${new Date().toLocaleString()}</p>
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
