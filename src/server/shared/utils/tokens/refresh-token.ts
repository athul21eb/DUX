import { IUser } from "@/server/core/entities/user";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";

export const IssueTokens = async (user: IUser) => {
  // Generate an access token (valid for 15 minutes)
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Generate a refresh token (valid for 7 days)
  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );



  return { accessToken, refreshToken };
};
