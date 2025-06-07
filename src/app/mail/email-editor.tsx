"use client";

import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Text } from "@tiptap/extension-text";
import EditorMenubar from "./editor-menubar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import TagInput from "./tag-input";
import { Input } from "@/components/ui/input";
import AIComposeButton from "./ai-compose-button";

type Props = {
  subject: string;
  setSubject: (value: string) => void;
  toValues: { label: string; value: string }[];
  setToValues: (values: { label: string; value: string }[]) => void;
  ccValues: { label: string; value: string }[];
  setCcValues: (values: { label: string; value: string }[]) => void;
  to: string[];
  handleSend: (value: string) => void;
  isSending: boolean;
  defaultToolbarExpanded?: boolean;
};

const EmailEditor = ({
  subject,
  setSubject,
  toValues,
  setToValues,
  ccValues,
  setCcValues,
  to,
  handleSend,
  isSending,
  defaultToolbarExpanded,
}: Props) => {
  const [value, setValue] = useState<string>("");
  const [expanded, setExpanded] = useState<boolean>(
    defaultToolbarExpanded || false,
  );

  const CustomText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-j": () => {
          console.log("Meta-j pressed");
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, CustomText],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const onGenerate = async (token: string) => {
    console.log("AI generation triggered with token:", token);
  };

  return (
    <div>
      <div className="flex border-b p-4 py-2">
        <EditorMenubar editor={editor} />
      </div>
      <div className="space-y-2 p-4 pb-0">
        {expanded && (
          <>
            <TagInput
              label="To"
              onChange={setToValues}
              placeholder="Add Recipients"
              value={toValues}
            />
            <TagInput
              label="Cc"
              onChange={setCcValues}
              placeholder="Add Recipients"
              value={ccValues}
            />
            <Input
              id="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </>
        )}
        <div className="flex items-center gap-2">
          <div
            className="cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="font-medium text-green-600">Draft </span>
            <span>to {to.join(", ")}</span>
          </div>
          <AIComposeButton
            isComposing={defaultToolbarExpanded || false}
            onGenerate={onGenerate}
          />
        </div>
      </div>
      <div className="prose w-full px-4 py-2">
        <EditorContent editor={editor} value={value} />
      </div>
      <Separator />
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-sm">
          Tip: Press{" "}
          <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
            ctrl + j
          </kbd>{" "}
          for AI autocomplete
        </span>
        <Button
          onClick={async () => {
            editor?.commands?.clearContent();
            await handleSend(value);
          }}
          disabled={isSending}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default EmailEditor;
