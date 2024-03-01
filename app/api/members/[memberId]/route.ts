import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type Props = {
  params: {
    memberId: string;
  };
};

export async function PATCH(req: Request, { params }: Props) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const { role, groupChatId } = await req.json();
    // console.log(role, groupChatId);
    console.log(params.memberId);

    if (!role && groupChatId) {
      return new NextResponse("role or groupChatId missing", { status: 404 });
    }

    const groupChat = await db.groupChat.update({
      where: {
        id: groupChatId,
        profileId: profile.id,
      },
      data: {
        groupMembers: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role: role,
            },
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

    return NextResponse.json(groupChat);
  } catch (error) {
    console.log("ROLE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
