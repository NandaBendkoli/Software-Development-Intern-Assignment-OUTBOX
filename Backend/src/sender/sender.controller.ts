import prisma from "../config/db.js";

export const createSender = async (req: any, res: any) => {
  try {
    const {
      userId,
      name,
      email,
      smtpUser,
      smtpPassword,
    } = req.body;

    const sender = await prisma.sender.create({
      data: {
        userId,
        name,
        email,
        smtpUser,
        smtpPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: "Sender created successfully",
      sender,
    });
  } catch (error) {
    console.error("Create sender error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create sender",
    });
  }
};

export const getAllSenders = async (req: any, res: any) => {
  try {
    const senders = await prisma.sender.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      senders,
    });
  } catch (error) {
    console.error("Get senders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch senders",
    });
  }
};