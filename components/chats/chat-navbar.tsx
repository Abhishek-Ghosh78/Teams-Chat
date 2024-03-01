import { Group, Phone, Trash, Users, Video } from "lucide-react";
import { UserAvatar } from "../useAvatar";
import { MemberRole } from "@prisma/client";
import { SocketIndicator } from "../socket-indicator";
import { useState } from "react";
import { ChatVideoButton } from "./chat-video-button";
import { ChatAudioButton } from "./chat-audio-button";
import { MobileToggle } from "../mobile-toggle";

interface ChatNavbarProps {
  member: any;
  chat: any;
}

const ChatNavbar = ({ member, chat }: ChatNavbarProps) => {
  return (
    <div className="bg-zinc-600/10 flex items-center justify-between">
      <div className="flex items-center p-2 space-x-2">
        <MobileToggle />
        <UserAvatar src={member.profile.imageUrl} />
        <h1 className="font-bold md:text-lg text-md text-zinc-200">
          {member.profile.name}
        </h1>
        <SocketIndicator />
      </div>

      <div>
        <ChatVideoButton />
        <ChatAudioButton />
      </div>
      {/* <Trash className="h-5 w-5 cursor-pointer text-rose-500" /> */}
    </div>
  );
};

export default ChatNavbar;
