"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { redirect } from "next/navigation";

type Props = {
  isCollapsed: boolean;
};

const AccountSwitcher = ({ isCollapsed }: Props) => {
  const { data } = api.account.getAccounts.useQuery();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");

  if (!data) return null;

  return (
    <Select defaultValue={accountId} onValueChange={setAccountId}>
      <SelectTrigger
        className={cn(
          "flex w-full flex-1 items-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an Account">
          <span className={cn(!isCollapsed && "hidden")}>
            {data.find((account) => account.id === accountId)?.emailAddress[0]}
          </span>
          <span className={cn(isCollapsed && "hidden", "ml-2")}>
            {data.find((account) => account.id === accountId)?.emailAddress}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data.map((account) => {
          return (
            <SelectItem key={account.id} value={account.id}>
              {account.emailAddress}
            </SelectItem>
          );
        })}
        <div
          onClick={async () => {
            const authUrl = await getAurinkoAuthUrl("Google");
            redirect(authUrl);
          }}
          className="focus:bg-accent relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm text-gray-700 outline-none hover:bg-gray-50"
        >
          <Plus className="mr-1 size-4" />
          Add account
        </div>
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;
