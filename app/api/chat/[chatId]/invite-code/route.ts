import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

type Props = {
  params: {
    chatId: string;
  };
};

export async function PATCH(req: Request, { params }: Props) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chat = await db.chat.update({
      where: {
        id: params.chatId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.log("[INVITE_CODE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
