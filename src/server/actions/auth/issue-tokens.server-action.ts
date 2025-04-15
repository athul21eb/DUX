import jwt from "jsonwebtoken";
import { cookies } from "next/headers";



// Reading expiry times from environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = parseInt(process.env.ACCESS_TOKEN_EXPIRY!) || 900; // Default to 15 minutes (900 seconds)
const REFRESH_TOKEN_EXPIRY = parseInt(process.env.REFRESH_TOKEN_EXPIRY!) || 604800; // Default to 7 days (604800 seconds)

export async function issueTokens(user: { id: string}) {


  const accessToken = jwt.sign(
    { id: user.id, },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

 // Await cookies to access .set()
 const cookieStore = await cookies();
 cookieStore.set("refreshToken", refreshToken, {
   httpOnly: true,
   secure: process.env.NODE_ENV === "production", // Secure in production
   sameSite: "strict", // Use "strict" in lowercase
   maxAge: REFRESH_TOKEN_EXPIRY, // 7 days in seconds
   path: "/",
 });

 const expires_at = Date.now() + (ACCESS_TOKEN_EXPIRY * 1000);


  return { accessToken, expires_at};
}
//