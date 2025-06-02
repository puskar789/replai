import { waitUntil } from "@vercel/functions";
import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status != "success") {
    return NextResponse.json(
      {
        message: "Failed to link account",
      },
      { status: 400 },
    );
  }

  const code = params.get("code");
  if (!code) {
    return NextResponse.json(
      {
        message: "No code provided",
      },
      { status: 400 },
    );
  }

  const token = await exchangeCodeForAccessToken(code);

  // adding the test accountId and accessToken for testing purposes
  // token.accountId = 111531;
  // token.accessToken = process.env.AURINKO_TEST_TOKEN as string;

  if (!token) {
    throw new Error("Failed to exchange code for access token");
  }

  const accountDetails = await getAccountDetails(token.accessToken);

  await db.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      token: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
      token: token.accessToken,
    },
  });

  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId,
      })
      .then((res) => console.log("Initial sync started", res.data))
      .catch((err) => console.error("Error starting initial sync", err)),
  );

  return NextResponse.redirect(new URL("/mail", req.url));
};
