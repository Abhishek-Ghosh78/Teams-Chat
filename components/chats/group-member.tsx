"use client";
import { UserAvatar } from "../useAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Delete,
  DeleteIcon,
  Edit,
  MoreVertical,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { Fragment } from "react";
import { MemberRole } from "@prisma/client";
import { GroupChatWithMember } from "@/types";
import { useRouter } from "next/navigation";

interface GroupMembersProps {
  groups: any;
  profile: any;
  chat: any;
}

export const GroupMembers = ({ groups, profile, chat }: GroupMembersProps) => {
  const { onOpen } = useModal();
  // const group = groups.map((group) => group);

  const router = useRouter();

  const onClick = (id: string) => {
    router.push(`/chat/${chat.id}/group/${id}`);
  };

  return (
    <div>
      {groups.map((group: any) => (
        <div
          key={group.id}
          onClick={() => onClick(group.id)}
          className="group hover:bg-gray-200/10 dark:bg-200/70 border-none rounded-md
        transition"
        >
          <a className="flex space-x-2 justify-between items-center mt-2 px-2 py-4  cursor-pointer">
            <div className="flex space-x-4 items-center justify-between">
              <UserAvatar className="h-2 w-2 text-sm" src={group.imageUrl} />

              <h1 className="text-md font-bold text-lg text-zinc-500 hover:text-zinc-600 dark:text-zinc-400">
                {group.name}
              </h1>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="focus:outline-none">
                  <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-300 hover:text-gray-600 ml-8" />
                </DropdownMenuTrigger>
                {/* {group.groupMembers.map((member: any) =>
                  // console.log(member.length)
                )} */}
                <DropdownMenuContent className="flex flex-col justify-between">
                  <DropdownMenuItem
                    onClick={() => onOpen("groupInvite", { groupChat: group })}
                    className="text-gray-600 dark:text-gray-400 px-3 py-2 text-sm cursor-pointer"
                  >
                    Invite People
                    <UserPlus className="h-4 w-4 ml-5" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-600 dark:text-gray-400 px-3 py-2 text-sm cursor-pointer">
                    Edit
                    <Edit className="h-4 w-4 ml-5" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-600 dark:text-gray-400 px-3 py-2 text-sm cursor-pointer">
                    Delete
                    <Delete className="h-4 w-4 ml-5 text-rose-600" />
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => onOpen("member", { groupChat: group })}
                    className="text-gray-600 dark:text-gray-400 px-3 py-2 text-sm cursor-pointer"
                  >
                    Manage Members
                    <Users className="h-4 w-4 ml-5" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};
