"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, SparklesIcon } from "lucide-react";
// import { useChat } from "@ai-sdk/react";
import { useChat } from "ai/react";
import useThreads from "@/hooks/use-threads";

const AskAI = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { accountId } = useThreads();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "api/chat",
    body: {
      accountId,
    },
    onError: (error) => console.log("error in ask ai", error),
    initialMessages: [],
  });

  useEffect(() => {
    if (!messageContainerRef.current) return;

    messageContainerRef.current.scrollTo({
      top: messageContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (isCollapsed) return null;

  return (
    <div className="mb-14 p-4">
      <motion.div className="flex flex-1 flex-col items-end rounded-lg bg-gray-100 p-4 pb-4 shadow-inner dark:bg-gray-900">
        <div
          className="flex max-h-[50vh] w-full flex-col gap-2 overflow-y-scroll"
          id="message-container"
          ref={messageContainerRef}
        >
          <AnimatePresence mode="wait">
            {messages.map((message) => {
              return (
                <motion.div
                  key={message.id}
                  layout="position"
                  className={cn(
                    "z-10 mt-2 max-w-[250px] rounded-2xl bg-gray-200 break-words dark:bg-gray-800",
                    message.role === "user"
                      ? "self-end text-gray-900 dark:text-gray-100"
                      : "self-start bg-blue-500 text-white",
                  )}
                  layoutId={`container-[${messages.length - 1}]`}
                  transition={{
                    type: "easeOut",
                    duration: 0.2,
                  }}
                >
                  <div className="px-3 py-2 text-[15px] leading-[15px]">
                    {message.content}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {messages.length > 0 && <div className="h-4" />}
        <div className="w-full">
          {messages.length === 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <SparklesIcon className="size-6 text-gray-600" />
                <div>
                  <p className="text-gray-900 dark:text-gray-100">
                    Ask AI anything about your emails
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get answers to your questions about your emails
                  </p>
                </div>
              </div>
              <div className="h-2"></div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="cursor-pointer rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                  onClick={() => {
                    handleInputChange({
                      target: {
                        value: "What can I ask?",
                      },
                    });
                  }}
                >
                  What can I ask?
                </span>
                <span
                  className="cursor-pointer rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                  onClick={() => {
                    handleInputChange({
                      target: {
                        value: "When is my next flight?",
                      },
                    });
                  }}
                >
                  When is my next flight?
                </span>
                <span
                  className="cursor-pointer rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                  onClick={() => {
                    handleInputChange({
                      target: {
                        value: "When is my next meeting?",
                      },
                    });
                  }}
                >
                  When is my next meeting?
                </span>
              </div>
            </div>
          )}
          <form
            className="relative flex w-full items-center gap-2"
            onSubmit={handleSubmit}
          >
            <div className="relative flex-grow">
              <input
                type="text"
                className="relative h-9 w-full min-w-0 rounded-full border border-gray-200 bg-white px-3 py-1 text-[15px] outline-none placeholder:text-[13px] dark:bg-gray-900"
                placeholder="Ask AI anything about your emails"
                value={input}
                onChange={handleInputChange}
              />
              <motion.div
                className="pointer-events-none absolute inset-0 z-0 flex items-center overflow-hidden rounded-full bg-gray-200 px-3 py-2 text-[15px] leading-[15px] text-gray-900 opacity-60 dark:bg-gray-800 dark:text-gray-100"
                key={messages.length}
                layout="position"
                layoutId={`container-[${messages.length}]`}
                transition={{
                  type: "easeOut",
                  duration: 0.2,
                }}
                initial={{ opacity: 0.6, zIndex: -1 }}
                animate={{ opacity: 0.6, zIndex: -1 }}
                exit={{ opacity: 1, zIndex: 1 }}
              >
                {input}
              </motion.div>
            </div>
            <button
              type="submit"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800"
            >
              <Send className="size-4 text-gray-500 dark:text-gray-300" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AskAI;
