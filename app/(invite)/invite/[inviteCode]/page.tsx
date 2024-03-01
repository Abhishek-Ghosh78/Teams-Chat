import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface InvitePageProps {
  params: {
    inviteCode: string;
  };
}

const invitePage = async ({ params }: InvitePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const existingChat = await db.chat.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingChat) {
    return redirect(`/chat/${existingChat.id}`);
  }

  const newChat = await db.chat.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (newChat) {
    return redirect(`/chat/${newChat.id}`);
  }

  return null;
};

export default invitePage;
