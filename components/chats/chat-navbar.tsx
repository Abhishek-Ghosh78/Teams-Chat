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
    <div className="flex items-center justify-between md:h-14 h-20 rounded-sm border border-b-2  px-6 py-4 bg-zinc-700/70">
      <MobileToggle />
      <div className="flex items-center space-x-2 p-4">
        <UserAvatar src={member.profile.imageUrl} />
        <h1 className="font-bold md:text-lg text-2xl text-zinc-200">
          {member.profile.name}
        </h1>
        <SocketIndicator />
      </div>

      <div className="flex items-center md:space-x-4 space-x-2">
        <ChatVideoButton />
        <ChatAudioButton />
        {/* <Trash className="h-5 w-5 cursor-pointer text-rose-500" /> */}
      </div>
    </div>
  );
};

export default ChatNavbar;
