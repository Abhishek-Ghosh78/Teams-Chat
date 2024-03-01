"use client";
import { useSocket } from "@/providers/socket-provider";
import { Badge } from "./ui/badge";
``;

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className="bg-neutral-600 text-white border-none rounded-lg"
      ></Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-neutral-600 text-white border-none rounded-lg "
    ></Badge>
  );
};
