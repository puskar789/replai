"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import EmailEditor from "./email-editor";
import { api } from "@/trpc/react";
import useThreads from "@/hooks/use-threads";
import toast from "react-hot-toast";

const ComposeButton = () => {
  const [toValues, setToValues] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [ccValues, setCcValues] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [subject, setSubject] = useState<string>("");
  const { account } = useThreads();

  const sendEmail = api.account.sendEmail.useMutation();

  const handleSend = async (value: string) => {
    if (!account) {
      return;
    }

    sendEmail.mutate(
      {
        accountId: account.id,
        threadId: undefined,
        body: value,
        subject,
        from: {
          name: account.name ?? "Me",
          address: account.emailAddress ?? "me@example.com",
        },
        to: toValues.map((to) => ({
          address: to.value,
          name: to.value,
        })),
        cc: ccValues.map((cc) => ({
          address: cc.value,
          name: cc.value,
        })),
        replyTo: {
          name: account.name ?? "Me",
          address: account.emailAddress ?? "me@example.com",
        },
        inReplyTo: undefined,
      },
      {
        onSuccess: () => {
          toast.success("Email sent successfully");
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to send email");
        },
      },
    );
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <Button>
          <Pencil className="mr-1 size-4" />
          Compose
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex max-h-[90vh] flex-col overflow-hidden">
        <DrawerHeader>
          <DrawerTitle>Compose Email</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          <EmailEditor
            toValues={toValues}
            setToValues={setToValues}
            ccValues={ccValues}
            setCcValues={setCcValues}
            subject={subject}
            setSubject={setSubject}
            handleSend={handleSend}
            isSending={sendEmail.isPending}
            to={toValues.map((to) => to.value)}
            defaultToolbarExpanded={true}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ComposeButton;
