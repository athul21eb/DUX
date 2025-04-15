import { cookies } from "next/headers";

export async  function logout() {
  const cookieStore = cookies();

  // Clear all auth cookies
  (await cookieStore).delete("refreshToken");
  (await cookieStore).delete("next-auth.session-token");
  (await cookieStore).delete("next-auth.callback-url");
  (await cookieStore).delete("next-auth.csrf-token");
}
