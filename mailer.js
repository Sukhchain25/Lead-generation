const nodemailer = require("nodemailer");
const logger = require("./utils/logger");

async function sendMail(
  to,
  subject,
  html,
  attachments = null,
  replyTo = null,
  smtpConfig
) {
  try {
    // Create transporter with company-specific SMTP config
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: true, // true for 465, false for other ports
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    const mailOptions = {
      from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
      to,
      subject,
      html,
      attachments: attachments || [],
      replyTo: replyTo || smtpConfig.fromEmail,
    };

    logger.info(`Sending email to: ${to} from: ${smtpConfig.fromEmail}`);
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
}

module.exports = sendMail;
