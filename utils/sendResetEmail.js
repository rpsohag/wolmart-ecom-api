import nodemailer from "nodemailer";

// Function to send the reset email
export const sendResetEmail = async (email, token) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Replace these options with your email service configuration
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "b8203aeaee1f83",
        pass: "ec892d8632d44f",
      },
    });

    // Email content
    const mailOptions = {
      from: "no-reply@yourdomain.com",
      to: email,
      subject: "Password Reset",
      html: `
        <p>You have requested to reset your password. Please click the link below to reset your password:</p>
        <a href="http://localhost:3000/reset/${token}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Reset email sent: ", info.messageId);
  } catch (error) {
    console.error("Error while sending reset email:", error);
    throw new Error("Error sending reset email");
  }
};
