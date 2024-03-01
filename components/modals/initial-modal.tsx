"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import axios from "axios";
import { currentProfile } from "@/lib/current-profile";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required!",
  }),
});

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/chat", values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInvite = () => {
    router.push("/join");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Create Chat
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your chat a name. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 focus-visible:ring-0 text-black 
                        border-0 focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="default">
                Create
              </Button>
              <button
                type="button"
                onClick={handleInvite}
                className="text-zinc-500"
              >
                <span className="text-sm font-semibold text-gray-500">
                  Have Invite Link
                </span>
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
