import prisma from "../config/db.js";
import emailQueue from "../queue/email.queue.js";

export const createEmailJob = async (req: any, res: any) => {
  try {
    const { campaignId, recipient, scheduledAt, idempotancyKey } = req.body;

    if (!campaignId || !recipient || !scheduledAt || !idempotancyKey) {
      return res.status(400).json({
        success: false,
        message:
          "campaignId, recipient, scheduledAt and idempotancyKey are required",
      });
    }

    // Check campaign exists
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

    // Create Email Job
    const emailJob = await prisma.emailJob.create({
      data: {
        campaignId,
        recipient,
        scheduledAt: new Date(scheduledAt),
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
        delay: Math.max(new Date(scheduledAt).getTime() - Date.now(), 0),
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Email job created successfully",
      emailJob,
    });
  } catch (error: any) {
    console.error("Create email job error:", error);

    // Unique constraint
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email job with this idempotancyKey already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create email job",
      error: error.message,
    });
  }
};

export const getAllEmailJobs = async (req: any, res: any) => {
  try {
    const emailJobs = await prisma.emailJob.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        campaign: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: emailJobs.length,
      emailJobs,
    });
  } catch (error: any) {
    console.error("Get EmailJobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch email jobs",
      error: error.message,
    });
  }
};

export const getSingleEmailJob = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const emailJob = await prisma.emailJob.findUnique({
      where: {
        id,
      },
      include: {
        campaign: true,
      },
    });

    if (!emailJob) {
      return res.status(404).json({
        success: false,
        message: "Email job not found",
      });
    }

    return res.status(200).json({
      success: true,
      emailJob,
    });
  } catch (error: any) {
    console.error("Get EmailJob error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch email job",
      error: error.message,
    });
  }
};

export const createBulkEmailJobs = async (req: any, res: any) => {
  try {
    const { campaignId, recipients } = req.body;

    if (!campaignId || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "campaignId and recipients are required",
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

    const startTime = new Date(campaign.startAt);

    const emailJobs = [];

    for (let i = 0; i < recipients.length; i++) {
      const scheduledAt = new Date(
        startTime.getTime() + i * campaign.delaySeconds * 1000,
      );

      const idempotancyKey = `${campaignId}-${recipients[i]}-${i}`;

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
      message: "Email jobs created successfully",
      count: emailJobs.length,
      emailJobs,
    });
  } catch (error: any) {
    console.error("Bulk email jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create email jobs",
      error: error.message,
    });
  }
};
