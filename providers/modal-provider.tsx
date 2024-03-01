"use client";

import { CreateGroupModal } from "@/components/modals/chat-group-modal";
import { CreateChatModal } from "@/components/modals/create-chat-modal";
import { DeleteMessageModal } from "@/components/modals/delete-message-modal";
import { DirectMessageFileModal } from "@/components/modals/direct-message-file-modal";
import { GroupInviteModal } from "@/components/modals/group-invite-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { MemberModal } from "@/components/modals/members-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { useState, useEffect } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateChatModal />
      <CreateGroupModal />
      <InviteModal />
      <GroupInviteModal />
      <MemberModal />
      <MessageFileModal />
      <DeleteMessageModal />
      <DirectMessageFileModal />
    </>
  );
};
