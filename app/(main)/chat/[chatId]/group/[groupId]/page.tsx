import { ChatInput } from "@/components/chats/chat-input";
import NavBar from "@/components/navigation/navbar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChatMessages } from "@/components/chats/chat-messages";
import { redirect } from "next/navigation";
// import { MemberRole } from "@prisma/client";

type GroupPageProps = {
  params: {
    groupId: string;
    chatId: string;
  };
};

const GroupPage = async ({ params }: GroupPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const groupChat = await db.groupChat.findFirst({
    where: {
      groupMembers: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      groupMembers: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!groupChat) {
    return redirect("/");
  }

  // console.log(groupChat)

  const member = await db.groupMember.findFirst({
    where: {
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  // console.log("groupChatId: ",groupChat.id)

  // const member = members.find((member) => member.profileId === profile.id)

  // if(!member) {
  //   return redirectToSignIn()
  // }
  //
  const role = groupChat?.groupMembers.find(
    (member) => member.profileId === profile.id
  )?.role;

  // console.log(role);

  return (
    <div className="flex flex-col h-full">
      <NavBar groupChat={groupChat} role={role} />
      <div className="h-full">
        <ChatMessages
          role={member?.role}
          member={member}
          id={groupChat.id}
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{
            groupId: groupChat.id,
          }}
          paramKey="groupId"
          paramValue={groupChat.id}
        />
      </div>
      <ChatInput
        apiUrl="/api/socket/messages"
        type="group"
        id={groupChat?.id}
        name={groupChat?.name}
        chatId={params.chatId}
      />
    </div>
  );
};

export default GroupPage;
