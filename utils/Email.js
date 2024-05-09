const nodemailer = require("nodemailer");
import "dotenv/config"


// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MY_EMAIL ,
        pass: process.env.MY_PASSWORD
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"Himanshi" <${process.env.MY_EMAIL}>`,
            to: to,
            subject: subject,
            text: text,
            html: html
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
};

module.exports = sendEmail;
