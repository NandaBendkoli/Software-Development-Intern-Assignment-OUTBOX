import prisma from "../config/db.js";

export const createCampaign = async (req: any, res: any) => {
  try {
    const {
      userId,
      senderId,
      subject,
      body,
      startAt,
      delaySeconds,
      hourlyLimit,
    } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        userId,
        senderId,
        subject,
        body,
        startAt: new Date(startAt),
        delaySeconds,
        hourlyLimit,
      },
    });

    res.status(201).json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create campaign",
    });
  }
};

export const getAllCampaign = async (req: any, res: any) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        sender: true,
        emailJobs: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
    });
  }
};

export const getSingleCampaign = async (req: any, res: any) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        sender: true,
        emailJobs: true,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch campaign",
    });
  }
};

export const pauseCampaign = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const campaign = await prisma.campaign.update({
      where: {
        id,
      },
      data: {
        status: "PAUSED",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Campaign paused successfully",
      campaign,
    });
  } catch (error: any) {
    console.error("Pause campaign error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to pause campaign",
      error: error.message,
    });
  }
};

export const resumeCampaign = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const campaign = await prisma.campaign.update({
      where: {
        id,
      },
      data: {
        status: "ACTIVE",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Campaign resumed successfully",
      campaign,
    });
  } catch (error: any) {
    console.error("Resume campaign error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resume campaign",
      error: error.message,
    });
  }
};

export const cancelCampaign = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const campaign = await prisma.campaign.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Campaign cancelled successfully",
      campaign,
    });
  } catch (error: any) {
    console.error("Cancel campaign error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel campaign",
      error: error.message,
    });
  }
};

export const getCampaignStats = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const stats = await prisma.emailJob.groupBy({
      by: ["status"],
      where: {
        campaignId: id,
      },
      _count: {
        _all: true,
      },
    });

    const result = {
      total: 0,
      scheduled: 0,
      processing: 0,
      sent: 0,
      failed: 0,
    };

    for (const item of stats) {
      const count = item._count._all;

      result.total += count;

      if (item.status === "SCHEDULED") {
        result.scheduled = count;
      }

      if (item.status === "PROCESSING") {
        result.processing = count;
      }

      if (item.status === "SENT") {
        result.sent = count;
      }

      if (item.status === "FAILED") {
        result.failed = count;
      }
    }

    return res.status(200).json({
      success: true,
      campaignId: id,
      stats: result,
    });
  } catch (error: any) {
    console.error("Campaign stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign stats",
      error: error.message,
    });
  }
};
