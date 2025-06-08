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

type Props = {
  isComposing: boolean;
  onGenerate: (token: string) => void;
};

const AIComposeButton = ({ isComposing, onGenerate }: Props) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const aiGenerate = async () => {
    const { output } = await generateEmail("", prompt);
    for await (const token of readStreamableValue(output)) {
      if (token) {
        // console.log("AI generation triggered with token:", token);
        onGenerate(token);
      }
    }
  };

  return (
    <div>
      <Dialog>
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
                aiGenerate();
                setOpen(false);
                setPrompt("");
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
