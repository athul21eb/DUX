"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CheckUserRoleAndRedirectProps {
  allowedRole: string;
}

export default function CheckUserRoleAndRedirect({ allowedRole }: CheckUserRoleAndRedirectProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
      router.refresh();
    } else if (status === "authenticated" && session?.user?.role !== allowedRole) {
      router.replace("/");
      router.refresh();
    }
  }, [session, status, allowedRole, router]);

  return null;
}
