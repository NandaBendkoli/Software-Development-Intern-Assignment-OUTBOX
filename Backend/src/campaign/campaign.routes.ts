import { Router } from "express";
import {
  createCampaign,
  getAllCampaign,
  getSingleCampaign,
  getCampaignStats,
  pauseCampaign,
  resumeCampaign,
  cancelCampaign,
} from "./campaign.controller.js";

const router = Router();

router.post("/create", createCampaign);
router.get("/getAll", getAllCampaign);
router.get("/getOne/:id", getSingleCampaign);
router.patch("/pause/:id", pauseCampaign);
router.patch("/resume/:id", resumeCampaign);
router.patch("/cancel/:id", cancelCampaign);
router.get("/stats/:id", getCampaignStats);

export default router;
