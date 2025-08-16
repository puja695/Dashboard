// backend/routes/jobs.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const { role = "Software Engineer", location = "India" } = req.query;

  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
        role
      )}%20in%20${encodeURIComponent(location)}&page=1&num_pages=1`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ RapidAPI error:", errText);
      return res
        .status(500)
        .json({ error: "Failed to fetch jobs", details: errText });
    }

    const data = await response.json();

    // ✅ Always return array
    const jobs = (data.data || []).map((job) => ({
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country,
      source: job.job_publisher,
      posted: job.job_posted_at_datetime_utc,
      applyLink: job.job_apply_link,
    }));

    res.json(jobs); // ✅ not { jobs: [...] }
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

export default router;
