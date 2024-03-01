import { Group, Phone, Trash, Users, Video } from "lucide-react";
import { UserAvatar } from "../useAvatar";
import { MemberRole } from "@prisma/client";
import { MobileToggle } from "../mobile-toggle";

interface NavBarProps {
  groupChat: any;
  role: any;
}

const NavBar = ({ groupChat, role }: NavBarProps) => {
  console.log(groupChat);
  return (
    <div>
      <div className=" flex items-center justify-between h-14 rounded-sm border border-b-2 w-full px-6 py-4 bg-zinc-700/70">
        <MobileToggle />
        <div className="flex items-center space-x-2 p-4">
          <UserAvatar src={groupChat.imageUrl} />
          <h1 className="font-bold text-lg text-zinc-200">{groupChat.name}</h1>
        </div>
        <div>
          {role === MemberRole.ADMIN && (
            <div className="flex items-center space-x-4">
              <Users className="h-5 w-5 cursor-pointer" />
              {/* <Video className="h-5 w-5 cursor-pointer" />
              <Phone className="h-5 w-5 cursor-pointer" /> */}
              <Trash className="h-5 w-5 cursor-pointer text-rose-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
