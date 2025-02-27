"use server";
import "server-only";
import { getUserByEmail, updateUser } from "@/lib/db/user";
import {
  deleteVerificationToken,
  getVerificationTokenByToken,
} from "@/lib/db/verification_token";
import { sendVerificationEmail } from "@/utils/mail/verificationMail";
import { generateVerificationToken } from "@/utils/token/token";

export const emailVerificationByToken = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error: "Token has expired",
      hasExpired,
      email: existingToken.email,
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User not found" };
  }

  await updateUser(existingUser.id, {
    emailVerified: new Date(),
    email: existingToken.email,
  });
  // await database.user.update({
  //     where: {
  //         id: existingUser.id
  //     },
  //     data: {
  //         emailVerified: new Date(),
  //         email: existingToken.email
  //     }
  // })
  await deleteVerificationToken(existingToken.id);
  // await database.verificationToken.delete({
  //     where: {
  //         id: existingToken.id
  //     }
  // })

  return { success: "Email verified" };
};

// resend verification token
export const resendVerificationToken = async (email: string) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: "User not found" };
    }

    if (existingUser.emailVerified) {
      return { error: "Email already verified" };
    }

    // Generate Verification Token
    const verificationToken = await generateVerificationToken(email);

    if (!verificationToken) return null;

    await sendVerificationEmail(email, verificationToken?.token);

    return { success: "Verification token sent" };
  } catch (e) {
    console.error(e);
    return { error: "Error in resending verification token" };
  }
};
