import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id, content, fileUrl } = req.body;

    console.log("id: ", id);
    console.log("content: ", content);
    console.log("fileUrl: ", fileUrl);

    if (!id) {
      return res.status(404).json({ error: "Id is missing" });
    }

    if (!content) {
      return res.status(404).json({ error: "Content is missing" });
    }
    console.log("profileId: ", profile.id, "content: ", content);

    const conversation = await db.conversation.findFirst({
      where: {
        id: id,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const directMessage = await db.directMessage.create({
      data: {
        conversationId: id,
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

    // console.log(directMessage);

    const channelKey = `chat:${id}:messages`;

    res?.socket?.server?.io?.emit(channelKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("DIRECT_MESSAGE_ERROR", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
