import { Request, Response } from "express";
import { parse } from "csv-parse/sync";

import prisma from "../config/db.js";
import emailQueue from "../queue/email.queue.js";

export const uploadRecipientsCsv = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: "campaignId is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    const csvContent = req.file.buffer.toString("utf-8");

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    // to extaract the recipents emails
    const recipients = records
      .map((row) => row.email)
      .filter((email): email is string => Boolean(email))
      .map((email) => email.trim().toLowerCase());

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid email column found in CSV",
      });
    }

    const emailJobs = [];

    //  creting the mail jobs
    for (let i = 0; i < recipients.length; i++) {
      const scheduledAt = new Date(
        new Date(campaign.startAt).getTime() + i * campaign.delaySeconds * 1000,
      );

      const idempotancyKey = `${campaignId}-${recipients[i]}-${Date.now()}-${i}`;

      const emailJob = await prisma.emailJob.create({
        data: {
          campaignId,
          recipient: recipients[i],
          scheduledAt,
          idempotancyKey,
        },
      });

      await emailQueue.add(
        "send-email",
        {
          emailJobId: emailJob.id,
        },
        {
          jobId: emailJob.id,

          delay: Math.max(scheduledAt.getTime() - Date.now(), 0),

          attempts: 3,

          backoff: {
            type: "exponential",
            delay: 5000,
          },

          removeOnComplete: true,
          removeOnFail: false,
        },
      );

      emailJobs.push(emailJob);
    }

    return res.status(201).json({
      success: true,
      message: "CSV uploaded successfully",
      count: emailJobs.length,
      emailJobs,
    });
  } catch (error: any) {
    console.error("CSV upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process CSV",
      error: error.message,
    });
  }
};
