import { Router } from "express";

import { createSender, getAllSenders } from "./sender.controller.js";

const router = Router();

router.post("/create", createSender);
router.get("/getAll", getAllSenders);

export default router;
