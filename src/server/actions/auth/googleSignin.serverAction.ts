
'use server'

import { signIn } from "@/lib/auth/auth";
import { AuthError } from "next-auth";

export const googleAuthenticate = async () => {
  try {


    await signIn("google",
      {
        redirectTo: "/",

      }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return  "Invalid OAuth Signin"
    }

    throw error;
  }
};