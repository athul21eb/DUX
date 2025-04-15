import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signOut } from "@/lib/auth/auth";




export async function GET() {


  const sucess = await signOut();
  console.log(sucess,'====================')

  const cookieStore = await cookies();

  // Clear all auth cookies
  cookieStore.delete("refreshToken");
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("next-auth.callback-url");
  cookieStore.delete("next-auth.csrf-token");

  return NextResponse.json({ message: "Signed out successfully" }, { status: 200 });
}
