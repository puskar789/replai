"use client";

import ThemeToggle from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";

const ComposeButton = dynamic(() => import("./compose-button"), { ssr: false });

const Mail = dynamic(
  () => {
    return import("./mail");
  },
  {
    ssr: false,
  },
);

const MailDashboard = () => {
  return (
    <>
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2">
          <UserButton />
          <ThemeToggle />
          <ComposeButton />
        </div>
      </div>
      <Mail
        defaultLayout={[24, 32, 44]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
    </>
  );
};

export default MailDashboard;
