import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createJob,
  deleteJob,
  getAnalytics,
  getJobs,
  getStats,
  getUpcomingInterviews,
  updateFollowUpDate,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getStats);
router.get("/analytics", getAnalytics);
router.get("/interviews", getUpcomingInterviews);
router.get("/", getJobs);
router.post("/", createJob);
router.put("/:id", updateJob);
router.patch("/:id/follow-up", updateFollowUpDate);
router.delete("/:id", deleteJob);

export default router;
