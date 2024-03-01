import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, imageUrl } = await req.json();

    if (!name && !imageUrl) {
      return new NextResponse("Missing name and image", { status: 400 });
    }

    const group = await db.groupChat.create({
      data: {
        name: name,
        imageUrl: imageUrl,
        inviteCode: uuidv4(),
        profileId: profile.id,
        groupMembers: {
          create: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.log("[GROUP_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
