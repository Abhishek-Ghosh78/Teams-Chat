import { MobileToggle } from "@/components/mobile-toggle";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton, redirectToSignIn } from "@clerk/nextjs";
import Image from "next/image";
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
    <div>
      <div className="flex justify-between items-center mx-5 mt-2">
        <div>
          <MobileToggle />
        </div>
        <div>
          <UserButton />
        </div>
      </div>
      <div className="flex h-full items-center justify-center text-white">
        <h1 className="text-2xl font-bold text-zinc-200">
          Welcome: <span>{profile.name}</span>
        </h1>
        <img src="/images/chat-bg.png" alt="Avatar" className="w-24 h-24 " />
      </div>
    </div>
  );
};

export default ChatPage;
