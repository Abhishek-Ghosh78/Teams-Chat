import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    console.log("profileId: ", profile?.id);

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { content, fileUrl } = req.body;
    // console.log("content: ", content);
    // console.log("fileUrl: ", fileUrl);

    // console.log("content: ", content);

    if (!content) {
      return res.status(404).json({ error: "Content is missing" });
    }

    const groupChat = await db.groupChat.findFirst({
      where: {
        groupMembers: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        groupMembers: true,
      },
    });

    // console.log("groupChat: ", groupChat);
    if (!groupChat) {
      return res.status(404).json({ error: "No groupChat found" });
    }

    const member = groupChat.groupMembers.find(
      (member) => member.profileId === profile.id
    );

    // console.log("members: ", member);

    if (!member) {
      return res.status(404).json({ error: "No members found" });
    }

    const groupMessage = await db.groupMessage.create({
      data: {
        groupId: groupChat.id,
        memberId: member.id,
        content: content,
        fileUrl: fileUrl,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const groupKey = `chat:${groupChat.id}:messages`;
    res?.socket?.server?.io?.emit(groupKey, groupMessage);

    res.status(200).json(groupMessage);
  } catch (error) {
    console.log("[GROUP_MESSAGE_ERROR]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
