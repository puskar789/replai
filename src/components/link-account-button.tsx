"use client";

import React from "react";
import { Button } from "./ui/button";
import { getAurinkoAuthUrl } from "../lib/aurinko";
import { redirect } from "next/navigation";

const LinkAccountButton = () => {
  return (
    <Button
      onClick={async () => {
        const authUrl = await getAurinkoAuthUrl("Google");
        redirect(authUrl);
      }}
    >
      Link Account
    </Button>
  );
};

export default LinkAccountButton;
