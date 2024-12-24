const nodemailer = require('nodemailer');

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Function to send the verification email
const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.BASE_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html: `<p>Please click the following link to verify your email address:</p><p><a href="${verificationUrl}">Verify Email</a></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Error sending email verification.');
  }
};

module.exports = { sendVerificationEmail };
