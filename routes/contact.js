const express = require("express");
const router = express.Router();
const Lead = require("../models/Leads");
const sendMail = require("../mailer");
const logger = require("../utils/logger");

// Company configurations (same as catalog route)
const COMPANIES = {
  havve: {
    name: "Havve",
    emailDomain: "havve.in",
    replyEmail: process.env.HAVVE_FROM_EMAIL,
    adminEmail: process.env.HAVVE_ADMIN_EMAIL,
    smtpConfig: {
      host: process.env.HAVVE_SMTP_HOST,
      port: process.env.HAVVE_SMTP_PORT,
      user: process.env.HAVVE_SMTP_USER,
      pass: process.env.HAVVE_SMTP_PASS,
      fromEmail: process.env.HAVVE_FROM_EMAIL,
      fromName: process.env.HAVVE_FROM_NAME,
    },
  },
  cottonedge: {
    name: "CottonEdge Exports",
    emailDomain: "cottonedgeexports.in",
    replyEmail: process.env.COTTONEDGE_FROM_EMAIL,
    adminEmail: process.env.COTTONEDGE_ADMIN_EMAIL,
    smtpConfig: {
      host: process.env.COTTONEDGE_SMTP_HOST,
      port: process.env.COTTONEDGE_SMTP_PORT,
      user: process.env.COTTONEDGE_SMTP_USER,
      pass: process.env.COTTONEDGE_SMTP_PASS,
      fromEmail: process.env.COTTONEDGE_FROM_EMAIL,
      fromName: process.env.COTTONEDGE_FROM_NAME,
    },
  },
};

router.post("/:company", async (req, res) => {
  const { name, email, message, companyName } = req.body;
  const { company } = req.params;

  // Validate company
  const companyConfig = COMPANIES[company.toLowerCase()];
  if (!companyConfig) {
    return res.status(400).json({
      success: false,
      message: "Invalid company specified",
    });
  }

  try {
    const lead = new Lead({
      name,
      email,
      companyName,
      message,
      source: "contact",
      company: companyConfig.name,
    });
    await lead.save();

    // Send confirmation to user
    await sendMail(
      email,
      `Thanks for contacting ${companyConfig.name}!`,
      `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
                <h2 style="color: #2a7f62;">Thank You for Reaching Out!</h2>
                <p>Hi ${name || "there"},</p>
                <p>We appreciate your interest in <strong>${
                  companyConfig.name
                }</strong>. One of our team members will get back to you shortly to assist with your query.</p>
                <p>If you have any urgent concerns, feel free to contact us directly at <a href="mailto:${
                  companyConfig.replyEmail
                }">${companyConfig.replyEmail}</a>.</p>
                <br/>
                <p>Warm regards,</p>
                <p><strong>${companyConfig.name}</strong></p>
            </div>
            `,
      null,
      companyConfig.replyEmail,
      companyConfig.smtpConfig
    );

    // Send internal notification
    await sendMail(
      companyConfig.adminEmail,
      `📬 New Contact Form Submission - ${companyConfig.name}`,
      `
            <h2>New Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${companyName || "Not provided"}</p>
            <p><strong>Message:</strong></p>
            <blockquote>${message}</blockquote>
            <br/>
            <p>🕐 Received on: ${new Date().toLocaleString()}</p>
            `,
      null,
      companyConfig.replyEmail,
      companyConfig.smtpConfig
    );

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    logger.error("Error in contact route:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

module.exports = router;
