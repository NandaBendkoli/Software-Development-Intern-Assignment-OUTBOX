import { Worker, Job } from "bullmq";
import nodemailer from "nodemailer";

import prisma from "../config/db.js";
import redisConnection from "../queue/redis.connection.js";

import { checkCampaignRateLimit } from "../queue/campaign.rate-limit.js";

const emailWorker = new Worker(
  "email-queue",

  async (job: Job) => {
    const { emailJobId } = job.data;

    console.log(`Processing EmailJob: ${emailJobId}`);

    console.log(`Attempt ${job.attemptsMade + 1}/${job.opts.attempts ?? 1}`);

    const emailJob = await prisma.emailJob.findUnique({
      where: {
        id: emailJobId,
      },

      include: {
        campaign: true,
      },
    });

    if (!emailJob) {
      throw new Error(`EmailJob not found: ${emailJobId}`);
    }

    const campaignStatus = emailJob.campaign.status;

    if (campaignStatus === "PAUSED") {
      console.log(`Campaign paused. Skipping EmailJob: ${emailJob.id}`);

      await prisma.emailJob.update({
        where: {
          id: emailJob.id,
        },
        data: {
          status: "SCHEDULED",
        },
      });

      return {
        success: false,
        skipped: true,
        reason: "Campaign paused",
      };
    }

    if (campaignStatus === "CANCELLED") {
      console.log(`Campaign cancelled. Skipping EmailJob: ${emailJob.id}`);

      await prisma.emailJob.update({
        where: {
          id: emailJob.id,
        },
        data: {
          status: "FAILED",
          errorMessage: "Campaign was cancelled",
        },
      });
      return {
        success: false,
        skipped: true,
        reason: "Campaign cancelled",
      };
    }
    const sender = await prisma.sender.findUnique({
      where: {
        id: emailJob.campaign.senderId,
      },
    });

    if (!sender) {
      throw new Error("Sender not found");
    }

    try {
      const allowed = await checkCampaignRateLimit(
        emailJob.campaign.id,
        emailJob.campaign.hourlyLimit,
      );

      if (!allowed) {
        console.log(
          `Hourly limit reached for campaign ${emailJob.campaign.id}`,
        );

        throw new Error(
          `Hourly email limit reached for campaign ${emailJob.campaign.id}`,
        );
      }
      await prisma.emailJob.update({
        where: {
          id: emailJob.id,
        },

        data: {
          status: "PROCESSING",

          attempts: {
            increment: 1,
          },
        },
      });
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",

        port: Number(process.env.SMTP_PORT) || 465,

        secure: true,

        auth: {
          user: sender.smtpUser,

          pass: sender.smtpPassword,
        },
      });
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,

        to: emailJob.recipient,

        subject: emailJob.campaign.subject,

        text: emailJob.campaign.body,
      });
      console.log(`Email is sent: ${info.messageId}`);

      await prisma.emailJob.update({
        where: {
          id: emailJob.id,
        },

        data: {
          status: "SENT",

          sentAt: new Date(),

          messageId: info.messageId,

          errorMessage: null,
        },
      });

      return {
        success: true,

        messageId: info.messageId,
      };
    } catch (error: any) {
      console.error(`Email attempt ${job.attemptsMade + 1} failed:`,error.message,);

      const maxAttempts = job.opts.attempts ?? 1;
      const currentAttempt = job.attemptsMade + 1;

      if (currentAttempt >= maxAttempts) {
        await prisma.emailJob.update({
          where: {
            id: emailJob.id,
          },

          data: {
            status: "FAILED",

            errorMessage: error.message,
          },
        });

        console.error(`EmailJob permanently failed: ${emailJob.id}`);
      } else {
        console.log(`Retrying EmailJob: ${emailJob.id}`);
      }

      throw error;
    }
  },

  {
    connection: redisConnection,

    concurrency: 5,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Job is completed: ${job.id}`);
});

emailWorker.on("failed", (job, error) => {
  console.error(`Job is failed: ${job?.id}`, error.message);
});

console.log("Email Worker has started");

export default emailWorker;
