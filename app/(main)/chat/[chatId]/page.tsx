import { MobileToggle } from "@/components/mobile-toggle";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ChatPage = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const chat = await db.chat.findFirst({
    where: {
      members: {
        some: {
          profileId: profile?.id,
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

  const member = chat?.members.find(
    (member) => member.profileId === profile.id
  );

  if (!member) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center">
        <div>
          <MobileToggle />
        </div>
        <div className="md:hidden mr-5">
          <UserButton />
        </div>
      </div>

      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold text-zinc-200">
          Welcome:
          <span className="ml-4 text-zinc-100 font-bold text-4xl">
            {member?.profile.name}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default ChatPage;
