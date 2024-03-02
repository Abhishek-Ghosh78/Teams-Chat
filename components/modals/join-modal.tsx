"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const JoinModal = () => {
  const [value, setValue] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();

  const handleInput = (e: any) => {
    e.preventDefault();
    router.push(`/invite/${value}`);
    console.log(value);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <Dialog open>
      <DialogContent className="bg-neutral-800/10 text-white p-2 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Join Chat
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col p-2">
          <h1 className="font-semibold text-md text-zinc-500 p-2">
            Enter Invite Link
          </h1>
          <input
            onChange={(e: any) => setValue(e.target.value)}
            type="text"
            className="border-neutral-50/10 focus-visible:ring-0 text-white 
                        border focus-visible:ring-offset-0 p-2 rounded-md"
          />
        </div>
        <DialogFooter className="bg-neutral-600/5 px-6 py-4 ">
          <button
            className="hover:bg-zinc-200/10 rounded-md p-2 transition"
            onClick={handleInput}
          >
            JOIN
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
