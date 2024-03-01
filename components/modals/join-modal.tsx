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
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Join Chat
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col p-2">
          <h1 className="font-semibold text-md text-zinc-500">
            Enter Invite Link
          </h1>
          <input
            onChange={(e: any) => setValue(e.target.value)}
            type="text"
            className="bg-zinc-300/50 focus-visible:ring-0 text-black 
                        border-0 focus-visible:ring-offset-0 p-2"
          />
        </div>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <button onClick={handleInput}>JOIN</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
