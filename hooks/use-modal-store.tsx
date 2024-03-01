import { Chat, GroupChat, Member } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createChat"
  | "createGroup"
  | "invite"
  | "groupInvite"
  | "member"
  | "messageFile"
  | "directMessageFile"
  | "deleteMessage";

interface ModalData {
  chat?: Chat;
  groupChat?: GroupChat;
  apiUrl?: string;
  id?: any;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
