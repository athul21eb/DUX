"use server";
import {compare,hash}from "bcrypt-ts";
import { createOtp, deleteOtpByEmail, getOtpByEmail } from "@/lib/db/otp";
import { changePasswordByEmail, getUserByEmail } from "@/lib/db/user";
import { sendForgotPasswordOtp } from "@/utils/mail/otpMail";
import { generateOtp } from "@/utils/token/otp";
import {
  changePasswordSchema,
  ForgotPasswordSchema,
  TChangePasswordType,
} from "@/utils/validator/authforms";
import { z } from "zod";

/// verify email and send otp to email

export default async function VerifyEmailAndSendOtp(
  data: Pick<z.infer<typeof ForgotPasswordSchema>, "email">
) {
  try {
    const validEmail = ForgotPasswordSchema.parse(data);
    if (!validEmail) {
      //send otp to email
      return { success: false, message: "Invalid email address" };
    }

    //verify email

    const existingEmail = await getUserByEmail(validEmail.email);

    if (!existingEmail) {
      return { success: false, message: "Email not found" };
    }

    //delete otp
    await deleteOtpByEmail(existingEmail.email);
    //send otp to email
    const otp = generateOtp();

    await createOtp(validEmail.email, otp);

    await sendForgotPasswordOtp(validEmail.email, otp);

    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Failed to send OTP." };
  }
}

////verify otp

export const verifyOtp = async (data: z.infer<typeof ForgotPasswordSchema>) => {
  try {
    const validOtp = ForgotPasswordSchema.parse(data);
    if (!validOtp) {
      return { success: false, message: "Invalid OTP" };
    }

    //verify otp
    const existingOtp = await getOtpByEmail(validOtp.email);

    if (!existingOtp) {
      return { success: false, message: "OTP not found" };
    }

    if (existingOtp.token !== validOtp.otp) {
      return { success: false, message: "Invalid OTP" };
    }

    if (new Date(existingOtp.expiresAt) < new Date()) {
      return { success: false, message: "OTP expired" };
    }

    //delete otp
    await deleteOtpByEmail(validOtp.email);

    return { success: true, message: "OTP verified successfully." };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Failed to verify OTP." };
  }
};

///change password

export const changePasswordAction = async (
  data: TChangePasswordType,
  email: string
) => {
  try {
    const validData = changePasswordSchema.parse(data);



    if (!validData) {
      return { success: false, message: "Invalid data" };
    }

    //verify email
    const existingEmail = await getUserByEmail(email);

    if (!existingEmail) {
      return { success: false, message: "Email not found" };

    }

    const isPasswordMatch = await compare(
      String(validData.newPassword),
      String(existingEmail.password)
    );



    if (isPasswordMatch) {
      return {
        success: false,
        message: "New password must be different from old password",
      };
    }

    //hash password
    const hashedPassword = await hash(validData.newPassword, 10);

    await changePasswordByEmail(email, hashedPassword);

    return { success: true, message: "Password changed successfully." };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, message: "Failed to change password." };
  }
};
