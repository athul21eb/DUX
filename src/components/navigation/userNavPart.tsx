"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "next-view-transitions";
import toast from "react-hot-toast";

export function UserNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300" />;
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    const toastId = toast.loading("Logging out..."); // Show loading toast

    try {
      await signOut({ redirect: false }); // Prevents immediate redirection
      toast.success("Logged out successfully!", {
        id: toastId,
        duration: 2000,
      });
    } catch (error) {
      toast.error("Error logging out!", { id: toastId, duration: 3000 });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={session?.user?.image || ""} alt="User avatar" />
          <AvatarFallback>
            {session.user?.name?.charAt(0) ?? "D"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
                src={session?.user?.image}
                alt={session?.user?.name ?? ""}
              />
              <AvatarFallback className="rounded-lg">{session?.user?.name ?? ""}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session?.user?.name}
              </span>
              <span className="truncate text-xs">{session?.user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={
              session?.user?.role === "admin"
                ? "/admin"
                : session?.user?.role === "mentor"
                ? "/mentor"
                : "/user"
            }
          >
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-center">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
