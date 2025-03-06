import 'server-only';

import { transporter } from './verificationMail';



// Function to send approval success email
export const sendMentorApplicationApprovalSuccessEmail = async (email: string):Promise<boolean> => {
  try {
    const forgotPasswordLink = `${process.env.NEXTAUTH_URL}/forgot-password`;

    const mailOptions = {
      from: `"DUX WEBSITE" <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "Mentor Approval Successful - Set Up Your Password",
      html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background: #f9f9f9; border-radius: 8px; text-align: center;">
            <div style="background: #28a745; padding: 20px; border-radius: 8px 8px 0 0; color: #ffffff;">
                <h1>Congratulations!</h1>
                <p style="font-size: 16px;">Your mentor account has been approved.</p>
            </div>
            <div style="padding: 20px; background: #ffffff; border-radius: 0 0 8px 8px;">
                <p style="font-size: 16px; color: #555;">You can now access your account. To set your password, please use the "Forgot Password" option:</p>
                <a href="${forgotPasswordLink}"
                    style="display: inline-block; padding: 12px 20px; margin: 10px 0; background: #28a745; color: #ffffff; font-size: 16px; text-decoration: none; border-radius: 5px;">
                    Set Up Password
                </a>
                <p style="font-size: 14px; color: #777; margin-top: 20px;">
                    If you have any questions, feel free to contact our support team.
                </p>
            </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Approval Success Email Sent: ", info.messageId);
    return true
  } catch (error) {
    console.error("Error sending approval success email: ", error);
    return false
  }
};

// Function to send rejection email
export const sendMentorApplicationRejectionEmail = async (email: string): Promise<boolean>=> {
  try {
    const mailOptions = {
      from: `"DUX WEBSITE" <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "Mentor Application Rejected",
      html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background: #f9f9f9; border-radius: 8px; text-align: center;">
            <div style="background: #dc3545; padding: 20px; border-radius: 8px 8px 0 0; color: #ffffff;">
                <h1>We're Sorry</h1>
                <p style="font-size: 16px;">Your mentor application has been reviewed, and unfortunately, it was not approved.</p>
            </div>
            <div style="padding: 20px; background: #ffffff; border-radius: 0 0 8px 8px;">
                <p style="font-size: 16px; color: #555;">We appreciate your interest in joining our platform. However, based on our review process, we are unable to approve your mentor application at this time.</p>
                <p style="font-size: 14px; color: #777; margin-top: 20px;">
                    If you have any questions or wish to reapply in the future, please reach out to our support team.
                </p>
            </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Rejection Email Sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending rejection email: ", error);
    return false;
  }
};
