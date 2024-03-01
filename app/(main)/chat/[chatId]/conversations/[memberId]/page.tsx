import { ChatInput } from "@/components/chats/chat-input";
import { ChatMessages } from "@/components/chats/chat-messages";
import ChatNavbar from "@/components/chats/chat-navbar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getOrCreateConversation } from "@/lib/conversation";
import { DirectChatMessages } from "@/components/chats/direct-chat-messages";
import { ChatInputDirect } from "@/components/chats/chat-input-direct";
import { MediaRoom } from "@/components/media-room";

type MessageProps = {
  params: {
    memberId: string;
    chatId: string;
  };
  searchParams: {
    video?: boolean;
    audio?: boolean;
  };
};

const conversation = async ({ params, searchParams }: MessageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const chat = db.chat.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      members: {
        include: {
          profile: true,
        },
      },
    },
  });

  console.log(chat);

  if (!chat) {
    return redirect("/");
  }

  const currentMember = await db.member.findFirst({
    where: {
      chatId: params.chatId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/chat/${params.chatId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="h-full  md:flex md:flex-col">
      <ChatNavbar member={otherMember} chat={chat} />
      {searchParams.video && (
        <MediaRoom id={conversation.id} video={true} audio={true} />
      )}
      {searchParams.audio && (
        <MediaRoom id={conversation.id} audio={true} video={false} />
      )}
      {!searchParams.video && !searchParams.audio && (
        <>
          <DirectChatMessages
            otherMember={otherMember}
            member={currentMember}
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            id={conversation.id}
            paramValue={conversation.id}
            paramKey="conversationId"
            socketQuery={conversation.id}
          />

          <ChatInputDirect
            apiUrl="/api/socket/direct-messages"
            name={memberTwo?.profile.name}
            type="direct"
            id={conversation?.id}
          />
        </>
      )}
    </div>
  );
};

export default conversation;
