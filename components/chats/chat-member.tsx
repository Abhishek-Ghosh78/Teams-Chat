"use client";

import { UserAvatar } from "../useAvatar";

import { useRouter } from "next/navigation";

interface ChatMemberProps {
  currentChat?: any;
  members: any;
}

export const ChatMembers = ({ currentChat, members }: ChatMemberProps) => {
  const router = useRouter();

  const onClick = (memberId: any, chatId: string) => {
    router.push(`/chat/${chatId}/conversations/${memberId}`);
  };

  return (
    <div className="flex flex-col space-y-5 p-2">
      {members?.map((member: any) => (
        <a
          onClick={() => onClick(member.id, member.chatId)}
          key={member.profile.id}
          className="flex items-center gap-x-6 cursor-pointer group hover:bg-gray-200/10 dark:bg-200/70 border-none rounded-md
          transition p-4"
        >
          <UserAvatar
            className="h-6 w-6 text-sm"
            src={member.profile.imageUrl}
          />
          <div>
            <h1 className="text-md font-semibold text-zinc-500 hover:text-zinc-600 dark:text-zinc-400">
              {member.profile.name}
            </h1>
            <p className="text-xs text-zinc-400">Message </p>
          </div>
        </a>
      ))}
    </div>
  );
};
