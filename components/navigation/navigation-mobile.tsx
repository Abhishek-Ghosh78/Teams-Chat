import { ChatGroup } from "../chats/chat-groups";
import { ChatList } from "../chats/chat-List";
import { ModeToggle } from "../mode-toggle";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { NavigationHeader } from "./navigation-header";
import { NavigationSearch } from "./navigation-search";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { UserButton, redirectToSignIn } from "@clerk/nextjs";

export const NavigationMobile = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const chat = await db.chat.findFirst({
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
  const members = chat?.members.filter(
    (member) => member.profileId !== profile.id
  );

  return (
    <div className="h-full w-[270px] px-4 py-6 dark:bg-neutral-800/50 relative">
      <NavigationHeader chat={chat} />
      <NavigationSearch
        data={[
          {
            label: "Members",
            type: "member",
            data: members?.map((member) => ({
              id: member.id,
              name: member.profile.name,
            })),
          },
        ]}
      />
      <Separator className="mt-2 w-full rounded-md" />
      <ScrollArea>
        <div className="flex items-center mt-2 text-lg font-bold text-zinc-400">
          <h2>Members</h2>
        </div>
        <ChatList chat={chat} />
        <Separator className="w-full mt-2" />
        <div className="flex items-center mt-2 text-lg font-bold text-zinc-400">
          <h2>Groups</h2>
        </div>
        <ChatGroup chat={chat} />
      </ScrollArea>
      <div className="pb-3 items-center flex-col space-y-4">
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
};
