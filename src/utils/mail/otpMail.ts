// Function to send OTP email

import { transporter } from "./verificationMail";




export const sendForgotPasswordOtp = async (email: string, otp: string) => {
    try {
      const mailOptions = {
        from: `"DUX WEBSITE" <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
          <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background: #f9f9f9; border-radius: 8px; text-align: center;">
              <div style="background: #28a745; padding: 20px; border-radius: 8px 8px 0 0; color: #ffffff;">
                  <h1>OTP Code</h1>
                  <p style="font-size: 16px;">Use the OTP below to verify your email.</p>
              </div>
              <div style="padding: 20px; background: #ffffff; border-radius: 0 0 8px 8px;">
                  <p style="font-size: 18px; font-weight: bold; color: #333;">Your OTP: <span style="color: #28a745;">${otp}</span></p>
                  <p style="font-size: 14px; color: #777; margin-top: 20px;">
                      If you didn’t request this email, you can safely ignore it.
                  </p>
              </div>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("OTP Email Sent: ", info.messageId);
    } catch (error) {
      console.error("Error sending OTP email: ", error);
    }
  };