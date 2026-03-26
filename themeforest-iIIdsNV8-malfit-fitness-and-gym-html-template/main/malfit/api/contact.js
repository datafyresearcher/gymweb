const nodemailer = require("nodemailer");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { name = "", email = "", phone = "", message = "" } = req.body || {};
  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim();
  const cleanPhone = String(phone).trim();
  const cleanMessage = String(message).trim();

  if (!cleanName || !cleanEmail || !cleanPhone || !cleanMessage) {
    return res.status(400).json({ message: "Please complete all form fields." });
  }

  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  const {
    GMAIL_USER,
    GMAIL_APP_PASSWORD,
    CONTACT_RECIPIENT = process.env.GMAIL_USER,
  } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_RECIPIENT) {
    return res.status(500).json({
      message: "Email service is not configured yet. Please add the Gmail environment variables.",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const subject = `New Join Request from ${cleanName}`;
  const text = [
    "A new joining request was submitted from the website contact form.",
    "",
    `Name: ${cleanName}`,
    `Email: ${cleanEmail}`,
    `Phone: ${cleanPhone}`,
    "",
    "Message:",
    cleanMessage,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New Joining Request</h2>
      <p>A new joining request was submitted from the website contact form.</p>
      <p><strong>Name:</strong> ${cleanName}</p>
      <p><strong>Email:</strong> ${cleanEmail}</p>
      <p><strong>Phone:</strong> ${cleanPhone}</p>
      <p><strong>Message:</strong><br>${cleanMessage.replace(/\n/g, "<br>")}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Lifestyle Reset Website" <${GMAIL_USER}>`,
      to: CONTACT_RECIPIENT,
      replyTo: cleanEmail,
      subject,
      text,
      html,
    });

    return res.status(200).json({ message: "Your joining request has been sent." });
  } catch (error) {
    return res.status(500).json({
      message: "We could not send your request right now. Please try again later.",
    });
  }
};
