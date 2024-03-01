"use client";
import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";

export const ChatAudioButton = () => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAudio = searchParams?.get("audio");

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathName || "",
      query: {
        audio: isAudio ? undefined : true,
      },
    });
    router.push(url);
  };

  const Icon = isAudio ? PhoneOff : Phone;
  const toolTipLabel = isAudio ? "End audio call" : "Start audio call";
  return (
    <ActionTooltip side="bottom" label={toolTipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="md:h-6 md:w-6 h-9 w-9 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
