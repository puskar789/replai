"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "./action";
import { readStreamableValue } from "ai/rsc";
import useThreads from "@/hooks/use-threads";
import { turndown } from "@/lib/turndown";
import { toast } from "react-hot-toast";

type Props = {
  isComposing: boolean;
  onGenerate: (token: string) => void;
};

const AIComposeButton = ({ isComposing, onGenerate }: Props) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { threadId, threads, account } = useThreads();
  const thread = threads?.find((thread) => thread.id === threadId);

  const aiGenerate = async () => {
    let context = "";

    if (!isComposing) {
      for (const email of thread?.emails ?? []) {
        const content = `
        Subject: ${email.subject}
        From: ${email.from.name} <${email.from.address}>
        Sent: ${new Date(email.sentAt).toLocaleString()}
        Body: ${turndown.turndown(email.body ?? email.body ?? "")}
        `;

        context += content;
      }
    }

    context += `
    This is further information about the user who is composing the email and is not part of any email that this user has received:
    My name is ${account?.name} and my email is ${account?.emailAddress}.
    `;

    console.log(context);

    const { output } = await generateEmail(context, prompt);
    for await (const token of readStreamableValue(output)) {
      if (token) {
        // console.log("AI generation triggered with token:", token);
        onGenerate(token);
      }
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button size="icon" variant="outline" onClick={() => setOpen(true)}>
            <Bot className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Smart Compose</DialogTitle>
            <DialogDescription>
              AI will help you compose your email.
            </DialogDescription>
            <div className="h-2"></div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt."
            />
            <div className="h-2"></div>
            <Button
              onClick={() => {
                setOpen(false);
                setPrompt("");
                toast("Generating the email. Please wait...", {
                  icon: "🤖",
                  duration: 1000,
                });
                aiGenerate();
              }}
            >
              Generate
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIComposeButton;
