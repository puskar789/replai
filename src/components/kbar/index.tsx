"use client";

import type React from "react";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
  type Action,
} from "kbar";
import RenderResults from "./render-results";
import { useLocalStorage } from "usehooks-ts";
import useThemeSwitching from "./use-theme-switching";
import useAccountSwitching from "./use-account-switching";

const Kbar = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = useLocalStorage("replai-tab", "inbox");
  const [done, setDone] = useLocalStorage("replai-done", false);

  const actions: Action[] = [
    {
      id: "inboxAction",
      name: "Inbox",
      shortcut: ["g", "i"],
      section: "Navigation",
      subtitle: "View your inbox",
      perform: () => {
        setTab("inbox");
      },
    },
    {
      id: "draftsAction",
      name: "Drafts",
      shortcut: ["g", "d"],
      section: "Navigation",
      subtitle: "View your drafts",
      perform: () => {
        setTab("draft");
      },
    },
    {
      id: "sentAction",
      name: "Sent",
      shortcut: ["g", "s"],
      section: "Navigation",
      subtitle: "View the sent messages",
      perform: () => {
        setTab("sent");
      },
    },
    {
      id: "pendingAction",
      name: "See Done",
      shortcut: ["g", "d"],
      keywords: "done",
      section: "Navigation",
      subtitle: "View the done emails",
      perform: () => {
        setDone(true);
      },
    },
    {
      id: "doneAction",
      name: "See Pending",
      shortcut: ["g", "u"],
      keywords: "pending, undone, not done",
      section: "Navigation",
      subtitle: "View the pending emails",
      perform: () => {
        setDone(false);
      },
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <ActualComponent>{children}</ActualComponent>
    </KBarProvider>
  );
};

const ActualComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching();
  useAccountSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hide fixed inset-0 z-[99999] bg-black/40 !p-0 backdrop-blur-sm dark:bg-black/60">
          <KBarAnimator className="text-foreground relative !mt-64 w-full max-w-[600px] !-translate-y-12 overflow-hidden rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <div className="bg-white dark:bg-gray-800">
              <div className="border-x-0 border-b-2 dark:border-gray-700">
                <KBarSearch className="w-full border-none bg-white px-6 py-4 text-lg outline-none focus:ring-0 focus:ring-offset-0 focus:outline-none dark:bg-gray-800" />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};

export default Kbar;
