const nodemailer = require("nodemailer");

// ==============================
// Create Gmail transporter
// ==============================

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword =
    process.env.EMAIL_APP_PASSWORD;

  // If email credentials are not configured,
  // the rest of BookVerse should still work.
  if (!emailUser || !emailPassword) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

// ==============================
// Send notification email
// ==============================

const sendNotificationEmail = async ({
  to,
  subject,
  message,
}) => {
  try {
    // During development, we can use one
    // test inbox for notification emails.
    const recipient =
      to || process.env.NOTIFICATION_TEST_EMAIL;

    if (!recipient) {
      return {
        sent: false,
        skipped: true,
        reason:
          "No notification email recipient configured",
      };
    }

    const transporter = createTransporter();

    if (!transporter) {
      return {
        sent: false,
        skipped: true,
        reason:
          "Email credentials are not configured",
      };
    }

    const info = await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        process.env.EMAIL_USER,

      to: recipient,

      subject,

      text: message,
    });

    return {
      sent: true,
      skipped: false,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(
      "Notification email failed:",
      error.message
    );

    return {
      sent: false,
      skipped: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendNotificationEmail,
};