"use server";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export const getAurinkoAuthUrl = async (
  serviceType: "Google" | "Office365",
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const googleScopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.labels",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.compose",
  ].join(" ");

  const scope =
    serviceType === "Google"
      ? googleScopes
      : "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All";

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID as string,
    serviceType,
    scope,
    responseType: "code",
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
  });

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
};

export const exchangeCodeForAccessToken = async (code: string) => {
  try {
    const res = await axios.post(
      `https://api.aurinko.io/v1/auth/token/${code}`,
      {},
      {
        auth: {
          username: process.env.AURINKO_CLIENT_ID as string,
          password: process.env.AURINKO_CLIENT_SECRET as string,
        },
      },
    );

    return res.data as {
      accountId: number;
      accessToken: string;
      userId: string;
      userSession: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    } else {
      console.error(error);
    }
    throw error;
  }
};

export const getAccountDetails = async (accessToken: string) => {
  try {
    const res = await axios.get("https://api.aurinko.io/v1/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data as {
      email: string;
      name: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching account details", error.response?.data);
    } else {
      console.error("Unexpected error fetching account details", error);
    }
    throw error;
  }
};
