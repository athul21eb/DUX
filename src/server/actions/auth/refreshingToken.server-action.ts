import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = parseInt(process.env.ACCESS_TOKEN_EXPIRY!) || 900; // Default to 15 minutes (900 seconds)
// Default to 7 days (604800 seconds)

export async function refreshAccessToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  try {
    if (!refreshToken) {
      throw new Error("Refresh token missing");
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET!) as {
      id: string;
    };

    const newAccessToken = jwt.sign({ id: decoded.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const expires_at = Date.now() + ACCESS_TOKEN_EXPIRY * 1000;

    return { access_token: newAccessToken, expires_at };
  } catch (error) {
    return null
  }
}
