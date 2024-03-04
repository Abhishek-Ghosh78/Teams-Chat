"use client";

import {
  ChevronDown,
  GroupIcon,
  Home,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

interface NavigationHeaderProps {
  chat: any;
  admin: any;
}

export const NavigationHeader = ({ chat, admin }: NavigationHeaderProps) => {
  const { onOpen } = useModal();

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="flex items-center justify-between space-x-10 w-full border-neutral-500 border-b-2 text-md font-semibold px-3 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          <h1 className="text-md font-bold uppercase">Chats</h1>
          <ChevronDown className="h-4 w-4 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      {admin && (
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => router.push("/")}
            className="text-gray-600 dark:text-gray-400 px-3 py-2 text-sm cursor-pointer"
          >
            Home
            <Home className="h-4 w-4 ml-5" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onOpen("invite", { chat: chat });
            }}
            className="text-gray-600 dark:text-gray-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-5" />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-gray-600 dark:text-gray-400 px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("createGroup")}
          >
            Create Group
            <Users className="h-4 w-4 ml-5" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
