import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      image:string;
    } & DefaultSession["user"]; // Fix: Ensures `user` properties are merged correctly
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    image:string;
    isBlocked:boolean;
    googleId:string|null;
    accessToken?: string;
    expires_at?: number;
    error?:string
  }
}
