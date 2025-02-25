import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/utils/validator/authforms";

import bcrypt from "bcrypt";
import { getUserByEmail } from "../db/user";



const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedData = LoginSchema.safeParse(credentials);
        if (!validatedData.success) return null;

        const { email, password } = validatedData.data;
        const user = await getUserByEmail(email);

        if (!user || !user.password) return null;

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        return isPasswordMatch ? user : null;
      },
    }),
  ],


};

export default authConfig;
