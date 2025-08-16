import express from "express";
import { fetchJobsJSearch } from "../services/jobService.js";

const router = express.Router();

// API endpoint → frontend calls this
router.get("/", async (req, res) => {
  const { keyword = "Software Engineer", location = "India" } = req.query;
  try {
    const jobs = await fetchJobsJSearch(keyword, location);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export default router;
