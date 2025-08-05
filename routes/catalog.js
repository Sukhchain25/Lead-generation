const express = require("express");
const router = express.Router();
const Lead = require("../models/Leads");
const sendMail = require("../mailer");
const path = require("path");
const fs = require("fs");
const emailTemplates = require("../email-templates.js");
const logger = require("../utils/logger");
const { log } = require("console");

// Company configurations
const COMPANIES = {
  havve: {
    name: "Havve",
    catalogFile: "Havve-catalog.pdf",
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
    catalogFile: "CottonEdge-Exports-Catalog.pdf",
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
  const { email } = req.body;
  const { company } = req.params;
  logger.info(
    `Catalog request received for company: ${company}, email: ${email}`
  );

  if (!email) {
    logger.error("Email is required for catalog request");
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Validate company
  const companyConfig = COMPANIES[company.toLowerCase()];
  if (!companyConfig) {
    logger.error(`Invalid company specified: ${company}`);
    return res.status(400).json({
      success: false,
      message: "Invalid company specified",
    });
  }

  // Check if emailTemplates for the company exists
  if (!emailTemplates[company.toLowerCase()]) {
    logger.error(`Email templates not found for company: ${company}`);
    return res.status(500).json({
      success: false,
      message: "Email templates configuration error",
    });
  }

  try {
    // Save lead to database
    const lead = new Lead({
      email,
      source: "catalog",
      company: companyConfig.name,
    });
    await lead.save();
    logger.info(
      `Lead saved for catalog request: ${email}, company: ${companyConfig.name}`
    );

    const catalogPath = path.join(
      __dirname,
      "..",
      "assets",
      companyConfig.catalogFile
    );

    if (!fs.existsSync(catalogPath)) {
      logger.error(`Catalog file not found: ${catalogPath}`);
      const unavailableTemplate =
        emailTemplates[company.toLowerCase()].catalogUnavailable(email);

      await sendMail(
        email,
        unavailableTemplate.subject,
        unavailableTemplate.html,
        null,
        companyConfig.replyEmail,
        companyConfig.smtpConfig
      );
      logger.info(`Catalog unavailable email sent to: ${email}`);

      return res.status(200).json({
        success: true,
        message:
          "We're temporarily unable to send the catalog. We've notified our team and will email it to you soon.",
      });
    }

    const attachment = {
      filename: companyConfig.catalogFile,
      path: catalogPath,
      contentType: "application/pdf",
    };

    const successTemplate =
      emailTemplates[company.toLowerCase()].catalogSuccess(email);

    await sendMail(
      email,
      successTemplate.subject,
      successTemplate.html,
      [attachment],
      companyConfig.replyEmail,
      companyConfig.smtpConfig
    );
    logger.info(`Catalog sent to: ${email}`);

    res.status(200).json({
      success: true,
      message: "Catalog has been sent to your email successfully!",
    });
  } catch (err) {
    logger.error("Error in catalog route", err.stack);

    try {
      await sendMail(
        companyConfig.adminEmail,
        "Catalog Download Failed",
        `<p>Failed to send catalog to ${email}</p><p>Error: ${err.message}</p>`,
        null,
        companyConfig.replyEmail,
        companyConfig.smtpConfig
      );
      logger.info(
        `Error notification sent to admin: ${companyConfig.adminEmail}`
      );
    } catch (emailErr) {
      logger.error("Failed to send error email to admin", emailErr);
    }

    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while processing your request.",
    });
  }
});

module.exports = router;
