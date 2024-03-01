import { GroupMembers } from "./group-member";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";

interface GroupChatProps {
  chat: any;
}

export const ChatGroup = async ({ chat }: GroupChatProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const groups = await db.groupChat.findMany({
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

  // const group = groups.map((group) => group);
  // console.log(group);

  return (
    <>
      <div>
        <GroupMembers groups={groups} profile={profile} chat={chat} />
      </div>
    </>
  );
};
