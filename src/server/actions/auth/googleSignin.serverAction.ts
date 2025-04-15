"use server";

import { signIn } from "@/lib/auth/auth";
import { UserManagementResponseMessages } from "@/server/shared/constants/constant";
import { AuthError } from "next-auth";

export const googleAuthenticate = async () => {
  try {
    await signIn("google", {
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return UserManagementResponseMessages.ErrorGoogleSigninFailed;
    }

    throw error;
  }
};
