import { InitialModal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const SetupPage = async () => {
  const profile = await initialProfile();
  // console.log(profile.id);

  const existingChat = await db.chat.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // console.log(existingChat);

  if (existingChat) {
    return redirect(`/chat/${existingChat?.id}`);
  }

  return <InitialModal />;
};
export default SetupPage;
