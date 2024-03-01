import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface GroupInviteProps {
  params: {
    inviteCode: string
  }
}
const groupInvite = async ({ params }: GroupInviteProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if(!params.inviteCode) {
    return redirect("/")
  }

  const chat = await db.chat.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  console.log(chat)

  if (!chat) {
    return redirect("/");
  }

  const existingGroup = await db.groupChat.findFirst({
    where: {
      inviteCode: params.inviteCode,
      groupMembers: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingGroup) {
    return redirect(`/chat/${chat.id}/group/${existingGroup.id}`);
  }

  const newGroup = await db.groupChat.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      groupMembers: {
        create: [
          {
            profileId: profile.id
          }
        ]
      },
    },
  });

  if (newGroup) {
    return redirect(`/chat/${chat.id}/group/${newGroup.id}`);
  }

  return null;
};

export default groupInvite;
