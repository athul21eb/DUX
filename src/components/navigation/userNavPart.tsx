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
      toast.success("Logged out successfully!", { id: toastId, duration: 2000 });
    } catch (error) {
      toast.error("Error logging out!", { id: toastId, duration: 3000 });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage
            src={session?.user?.image || "/dux.png"}
            alt="User avatar"
            onError={(e) => (e.currentTarget.src = "/dux.png")} // Fallback on error
          />
          <AvatarFallback>
            {session.user?.name?.charAt(0) ?? "D"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
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
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
