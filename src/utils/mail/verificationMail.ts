import 'server-only';

import nodemailer from "nodemailer";



export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

// Function to send a verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const confirmationLink = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

    const mailOptions = {
      from: `"FIRE BOOTS WEBSITE" <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "Verify Your Email - Welcome to Our Platform!",
      html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background: #f9f9f9; border-radius: 8px; text-align: center;">
            <div style="background: #007bff; padding: 20px; border-radius: 8px 8px 0 0; color: #ffffff;">
                <h1>Welcome!</h1>
                <p style="font-size: 16px;">You're almost there! Please verify your email address to get started.</p>
            </div>
            <div style="padding: 20px; background: #ffffff; border-radius: 0 0 8px 8px;">
                <p style="font-size: 16px; color: #555;">Click the button below to verify your email:</p>
                <a href="${confirmationLink}"
                    style="display: inline-block; padding: 12px 20px; margin: 10px 0; background: #007bff; color: #ffffff; font-size: 16px; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
                <p style="font-size: 14px; color: #777; margin-top: 20px;">
                    If you didn’t request this email, you can safely ignore it.
                </p>
            </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification Email Sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending verification email: ", error);
  }
};


