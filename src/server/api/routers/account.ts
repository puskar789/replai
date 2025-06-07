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
      name: true,
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
  getThreads: privateProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
        done: z.boolean(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      return await ctx.db.thread.findMany({
        where: {
          accountId: account.id,
          inboxStatus: input.tab === "inbox" ? true : false,
          draftStatus: input.tab === "draft" ? true : false,
          sentStatus: input.tab === "sent" ? true : false,
          done: input.done,
        },
        include: {
          emails: {
            orderBy: {
              sentAt: "asc",
            },
            select: {
              from: true,
              body: true,
              bodySnippet: true,
              emailLabel: true,
              subject: true,
              sysLabels: true,
              id: true,
              sentAt: true,
            },
          },
        },
        take: 15,
        orderBy: {
          lastMessageDate: "desc",
        },
      });
    }),
  getSuggestions: privateProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      return await ctx.db.emailAddress.findMany({
        where: {
          accountId: account.id,
        },
        select: {
          address: true,
          name: true,
        },
      });
    }),
  getReplyDetails: privateProcedure
    .input(
      z.object({
        threadId: z.string(),
        accountId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      const thread = await ctx.db.thread.findFirst({
        where: {
          id: input.threadId,
        },
        include: {
          emails: {
            orderBy: {
              sentAt: "asc",
            },
            select: {
              from: true,
              to: true,
              cc: true,
              bcc: true,
              sentAt: true,
              subject: true,
              internetMessageId: true,
            },
          },
        },
      });

      if (!thread || thread.emails.length === 0) {
        throw new Error("Thread not found");
      }

      // Find the last email that is not from the current user
      const lastExternalEmail = thread.emails.reverse().find((email) => {
        return email.from.address !== account.emailAddress;
      });

      if (!lastExternalEmail) {
        throw new Error("No external emails found");
      }

      return {
        subject: lastExternalEmail.subject,
        to: [
          lastExternalEmail.from,
          ...lastExternalEmail.to.filter(
            (to) => to.address !== account.emailAddress,
          ),
        ],
        cc: lastExternalEmail.cc.filter(
          (cc) => cc.address !== account.emailAddress,
        ),
        from: {
          name: account.name,
          address: account.emailAddress,
        },
        id: lastExternalEmail.internetMessageId,
      };
    }),
});
