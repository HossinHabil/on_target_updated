"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOutIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { data: session } = useSession();

  // used to clear the cache when the user logs out
  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={session?.user?.image} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Logged in as {session?.user?.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session?.user.role === "Admin" && (
          <>
            <Link href={`/dashboard/admin`}>
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 size-4" />
                Admin
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            signOut();
          }}
          className="cursor-pointer"
        >
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
