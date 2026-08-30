import { Router } from "express";

import {
  createEmailJob,
  getAllEmailJobs,
  getSingleEmailJob,
  createBulkEmailJobs,
} from "./emailJob.controller.js";

const router = Router();

router.post("/create", createEmailJob);
router.get("/getAll", getAllEmailJobs);
router.get("/getOne/:id", getSingleEmailJob);
router.post("/createBulk", createBulkEmailJobs);

export default router;
