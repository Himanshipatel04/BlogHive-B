const nodemailer = require("nodemailer");
import "dotenv/config";

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASSWORD,
  },
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Himanshi" <${process.env.MY_EMAIL}>`,
      to: "pkcofficial24@gmail.com",
      subject: "I love youtube!",
      text: "Hello cutie",
      html: "<b>Hello princu?</b>",
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

export default sendEmail
