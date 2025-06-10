import { db } from "@/server/db";
import {
  type SyncUpdatedResponse,
  type EmailMessage,
  type SyncResponse,
  type EmailAddress,
} from "@/types";

import axios from "axios";
import { syncEmailsToDatabase } from "./sync-to-ds";

export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  // hits the first sync endpoint
  private async startSync() {
    const res = await axios.post<SyncResponse>(
      `https://api.aurinko.io/v1/email/sync`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          daysWithin: 2,
          bodyType: "html",
        },
      },
    );

    return res.data;
  }

  // hits the successive sync endpoint
  async getUpdatedEmails({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }) {
    let params: Record<string, string> = {};

    if (deltaToken) {
      params.deltaToken = deltaToken;
    }
    if (pageToken) {
      params.pageToken = pageToken;
    }

    // console.log("params", params);

    const res = await axios.get<SyncUpdatedResponse>(
      `https://api.aurinko.io/v1/email/sync/updated`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params,
      },
    );

    return res.data;
  }

  async performInitialSync() {
    try {
      let syncResponse = await this.startSync();

      while (!syncResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync();
      }

      // this the basically pointing to the oldest mail in the inbox within the past daysWithin days
      let storedDeltaToken: string = syncResponse.syncUpdatedToken;

      let updatedResponse = await this.getUpdatedEmails({
        deltaToken: storedDeltaToken,
      });

      if (updatedResponse.nextDeltaToken) {
        storedDeltaToken = updatedResponse.nextDeltaToken;
      }

      let allEmails: EmailMessage[] = updatedResponse.records;

      while (updatedResponse.nextPageToken) {
        updatedResponse = await this.getUpdatedEmails({
          pageToken: updatedResponse.nextPageToken,
        });
        allEmails = allEmails.concat(updatedResponse.records);
        if (updatedResponse.nextDeltaToken) {
          storedDeltaToken = updatedResponse.nextDeltaToken;
        }
      }

      console.log(
        "initial sync complete, we have synced ",
        allEmails.length,
        " emails",
      );

      return {
        emails: allEmails,
        deltaToken: storedDeltaToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error during sync: ",
          JSON.stringify(error.response?.data, null, 2),
        );
      } else {
        console.error(error);
      }

      throw error;
    }
  }

  async syncEmails() {
    const account = await db.account.findUnique({
      where: {
        token: this.token,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }
    if (!account.nextDeltaToken) {
      throw new Error("Account not ready for sync");
    }

    let res = await this.getUpdatedEmails({
      deltaToken: account.nextDeltaToken,
    });
    let allEmails: EmailMessage[] = res.records;

    let storedDeltaToken = account.nextDeltaToken;

    if (res.nextDeltaToken) {
      storedDeltaToken = res.nextDeltaToken;
    }

    while (res.nextPageToken) {
      res = await this.getUpdatedEmails({
        pageToken: res.nextPageToken,
      });
      allEmails = allEmails.concat(res.records);
      if (res.nextDeltaToken) {
        storedDeltaToken = res.nextDeltaToken;
      }
    }

    try {
      syncEmailsToDatabase(allEmails, account.id);
    } catch (error) {
      console.error("Error syncing emails to the database", error);
      throw error;
    }

    await db.account.update({
      where: {
        id: account.id,
      },
      data: {
        nextDeltaToken: storedDeltaToken,
      },
    });

    return {
      emails: allEmails,
      deltaToken: storedDeltaToken,
    };
  }

  async sendEmail({
    from,
    subject,
    body,
    inReplyTo,
    threadId,
    references,
    to,
    cc,
    bcc,
    replyTo,
  }: {
    from: EmailAddress;
    subject: string;
    body: string;
    inReplyTo?: string;
    threadId?: string;
    references?: string;
    to: EmailAddress[];
    cc?: EmailAddress[];
    bcc?: EmailAddress[];
    replyTo?: EmailAddress;
  }) {
    try {
      const res = await axios.post(
        "https://api.aurinko.io/v1/email/messages",
        {
          from,
          subject,
          body,
          inReplyTo,
          references,
          to,
          threadId,
          cc,
          bcc,
          replyTo: [replyTo],
        },
        {
          params: {
            returnIds: true,
          },
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      console.log("Email sent");
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error sending email:",
          JSON.stringify(error.response?.data, null, 2),
        );
      } else {
        console.error("Error sending email", error);
      }
      throw error;
    }
  }
}
