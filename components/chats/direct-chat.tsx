"use client";
import { MemberRole } from "@prisma/client";
import { UserAvatar } from "../useAvatar";
import Image from "next/image";
import { ActionTooltip } from "../action-tooltip";
import { Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import * as z from "zod";
import { useModal } from "@/hooks/use-modal-store";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface DirectChatProps {
  id: string;
  currentMember: any;
  role: any;
  member: any;
  content: any;
  fileUrl: any;
  deleted: boolean;
  timestamp: any;
  isUpdated: any;
  socketUrl: any;
  socketQuery: any;
  otherMember: any;
}

export const DirectChat = ({
  id,
  currentMember,
  role,
  member,
  content,
  fileUrl,
  deleted,
  timestamp,
  isUpdated,
  socketQuery,
  socketUrl,
  otherMember,
}: DirectChatProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { onOpen } = useModal();

  const router = useRouter();

  const formSchema = z.object({
    content: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({
      content: content,
    });

    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const content = values.content;
      const url = `${socketUrl}/${id}`;
      await axios.patch(url, {
        content,
        socketQuery,
      });
      form.reset();
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fileType = fileUrl?.split(".").pop();

  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && isOwner;
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="p-4">
      {isOwner && currentMember && (
        <div>
          <div className="flex items-center justify-end space-x-2 ">
            <div className="flex flex-col items-end">
              {isImage && fileUrl ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                >
                  <Image src={fileUrl} alt="" fill className="object-cover" />
                </a>
              ) : (
                <>
                  <h1
                    className={cn(
                      "md:text-lg text-2xl text-zinc-200 ",
                      deleted &&
                        "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                    )}
                  >
                    {content}
                    {isUpdated && !deleted && (
                      <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                        (edited)
                      </span>
                    )}
                  </h1>
                </>
              )}
              {!fileUrl && isEditing && (
                <Form {...form}>
                  <form
                    className="flex items-center w-full gap-x-2 pt-2"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="relative w-full">
                              <Input
                                disabled={isLoading}
                                className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                placeholder="Edited Message"
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button disabled={isLoading} size="sm" variant="default">
                      Save
                    </Button>
                  </form>
                  <span className="text-[10px] mt-1 text-zinc-400">
                    Press esc to cancel, enter to save
                  </span>
                </Form>
              )}
              {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                  {canEditMessage && (
                    <ActionTooltip label="Edit">
                      <Edit
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                      />
                    </ActionTooltip>
                  )}
                  <ActionTooltip label="Delete">
                    <Trash
                      onClick={() =>
                        onOpen("deleteMessage", {
                          apiUrl: socketUrl,
                          id: id,
                        })
                      }
                      className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                    />
                  </ActionTooltip>
                </div>
              )}

              <p className="text-xs text-zinc-500">{timestamp}</p>
            </div>

            <UserAvatar src={member.profile.imageUrl} className="h-5 w-5" />
          </div>
        </div>
      )}
      {!isOwner && otherMember && (
        <div>
          <div className="flex items-center justify-start space-x-2 w-full">
            <UserAvatar src={member.profile.imageUrl} className="h-5 w-5" />
            <div className="flex flex-col">
              {isImage && fileUrl ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                >
                  <Image src={fileUrl} alt="" fill className="object-cover" />
                </a>
              ) : (
                <>
                  <h1
                    className={cn(
                      " md:text-lg text-2xl text-zinc-200 ",
                      deleted &&
                        "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                    )}
                  >
                    {content}
                    {isUpdated && !deleted && (
                      <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                        (edited)
                      </span>
                    )}
                  </h1>
                </>
              )}
              {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                  {canEditMessage && (
                    <ActionTooltip label="Edit">
                      <Edit
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                      />
                    </ActionTooltip>
                  )}
                  <ActionTooltip label="Delete">
                    <Trash
                      onClick={() =>
                        onOpen("deleteMessage", {
                          apiUrl: socketUrl,
                          id: id,
                        })
                      }
                      className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                    />
                  </ActionTooltip>
                </div>
              )}
              <p className="text-xs text-zinc-500">{timestamp}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
