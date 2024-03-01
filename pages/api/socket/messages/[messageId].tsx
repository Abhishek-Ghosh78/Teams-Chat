import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json("Method not allowed");
  }

  try {
    const profile = await currentProfilePages(req);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { content } = req.body;
    const { messageId } = req.query;

    console.log("content: ", content);

    console.log("messageId: ", messageId);

    // if (!content) {
    //   return res.status(404).json({ error: "Content is missing" });
    // }

    if (!messageId) {
      return res.status(404).json({ error: "MessageId is missing" });
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
        groupMembers: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!groupChat) {
      return res.status(404).json({ error: "Group Chat not found" });
    }

    const member = groupChat.groupMembers.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let groupMessage = await db.groupMessage.findFirst({
      where: {
        id: messageId as string,
        groupId: groupChat.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!groupMessage || groupMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = groupMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;

    const canModify = isMessageOwner || isAdmin;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      groupMessage = await db.groupMessage.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      groupMessage = await db.groupMessage.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${groupChat.id}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, groupMessage);

    return res.status(200).json(groupMessage);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
