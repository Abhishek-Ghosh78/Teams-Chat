import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const { name } = await req.json();

    const chat = await db.chat.create({
      data: {
        profileId: profile.id,

        inviteCode: uuidv4(),
        name: name,
        members: {
          create: {
            profileId: profile.id,
          },
        },
      },
    });

    if (!chat) {
      return new NextResponse("Chat not found", { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.log("CHAT_CREATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
