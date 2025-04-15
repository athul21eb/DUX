import 'server-only';

import { transporter } from './verificationMail';

export const sendContactFormEmail = async (name: string, surname: string, email: string, message: string): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"${name} ${surname}" <${email}>`,
      to: process.env.CONTACT_FORM_RECEIVER_EMAIL, // Your receiving email
      subject: "New Contact Form Submission",
      html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background: #f9f9f9; border-radius: 8px; text-align: left;">
            <div style="background: #007bff; padding: 20px; border-radius: 8px 8px 0 0; color: #ffffff; text-align: center;">
                <h2>New Contact Form Submission from Dux Website</h2>
            </div>
            <div style="padding: 20px; background: #ffffff; border-radius: 0 0 8px 8px;">
                <p style="font-size: 16px; color: #555;"><strong>Name:</strong> ${name} ${surname}</p>
                <p style="font-size: 16px; color: #555;"><strong>Email:</strong> ${email}</p>
                <p style="font-size: 16px; color: #555;"><strong>Message:</strong></p>
                <p style="font-size: 14px; color: #777;">${message}</p>
            </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Contact Form Email Sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending contact form email: ", error);
    return false;
  }
};
