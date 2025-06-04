import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { db } from "@/server/db";

export const authoriseAccountAccess = async (
  accountId: string,
  userId: string,
) => {
  const account = await db.account.findFirst({
    where: {
      id: accountId,
      userId: userId,
    },
    select: {
      id: true,
      emailAddress: true,
      token: true,
    },
  });

  if (!account) {
    throw new Error("Account not found.");
  }

  return account;
};

export const accountRouter = createTRPCRouter({
  getAccounts: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.account.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        id: true,
        name: true,
        emailAddress: true,
      },
    });
  }),
  getNumThreads: privateProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      return await ctx.db.thread.count({
        where: {
          accountId: account.id,
          inboxStatus: input.tab === "inbox" ? true : false,
          draftStatus: input.tab === "draft" ? true : false,
          sentStatus: input.tab === "sent" ? true : false,
        },
      });
    }),
});
