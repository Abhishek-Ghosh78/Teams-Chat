import { db } from "@/lib/db";

import { ChatMembers } from "./chat-member";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";

interface ChatListProps {
  chat: any;
}

export const ChatList = async ({ chat }: ChatListProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentChat = await db.chat.findUnique({
    where: {
      id: chat.id,
    },
    include: {
      members: {
        include: {
          profile: true,
        },
      },
    },
  });

  const members = currentChat?.members.filter(
    (member: any) => member.profileId !== profile.id
  );

  return (
    <>
      <div>
        <ChatMembers currentChat={currentChat} members={members} />
      </div>
    </>
  );
};
