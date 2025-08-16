import React, { useEffect, useState } from "react";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        const data = await res.json();
        setJobs(data.items || []); // ✅ backend returns {items: []}
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading jobs...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Job Listings</h1>

      {jobs.length > 0 ? (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-gray-700">
                {job.company} — {job.location}
              </p>
              <p className="text-sm text-gray-500">
                Source: {job.source || "Unknown"}
              </p>
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No jobs found</p>
      )}
    </div>
  );
};

export default JobBoard;
