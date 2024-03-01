import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;
export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");
    // console.log("cursor: ", cursor);
    // console.log("conversationId: ", conversationId);

    if (!conversationId) {
      return new NextResponse("Conversation Id is missing", { status: 404 });
    }

    let directMessages: any[] = [];

    if (cursor) {
      directMessages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId: conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      directMessages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId: conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (directMessages.length === MESSAGES_BATCH) {
      nextCursor = directMessages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: directMessages,
      nextCursor,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
