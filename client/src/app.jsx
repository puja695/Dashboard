import React, { useEffect, useRef, useState } from "react";

function App() {
  const [jobs, setJobs] = useState([]);               // always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyFilter, setCompanyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("Software Engineer");
  const debounceRef = useRef(null);

  // -------- utils --------
  const toArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.items)) return payload.items;
    if (payload && Array.isArray(payload.data)) return payload.data;
    return [];
  };

  const formatTime = (dateLike) => {
    const t = new Date(dateLike);
    if (isNaN(t.getTime())) return "N/A";
    const diff = (Date.now() - t.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // -------- data fetch --------
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `http://localhost:5000/api/jobs?role=${encodeURIComponent(
          searchQuery
        )}&location=India`;

        const res = await fetch(url, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status}: ${txt || "Failed to fetch jobs"}`);
        }

        const json = await res.json().catch(() => null);
        const list = toArray(json);
        setJobs(list);
      } catch (e) {
        console.error("Fetch error:", e);
        setJobs([]); // keep array to avoid .filter crash
        setError("⚠️ Could not fetch jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // debounce 600ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchJobs, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  // -------- filters --------
  const jobList = Array.isArray(jobs) ? jobs : [];
  const filteredJobs =
    companyFilter === "top"
      ? jobList.filter((j) =>
          ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix"].includes(
            j?.company || ""
          )
        )
      : jobList;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "30%",
          background: "#1c1c1e",
          padding: "20px",
          borderRight: "2px solid #ff8800",
          color: "#fff",
        }}
      >
        <h2 style={{ color: "#ff8800" }}>Search Filters</h2>

        <input
          type="text"
          placeholder="Search role (e.g. Data Scientist)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            display: "block",
            marginBottom: "15px",
            padding: "10px",
            width: "100%",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#2a2a2d",
            color: "#fff",
          }}
        />

        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          style={{
            display: "block",
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#2a2a2d",
            color: "#fff",
          }}
        >
          <option value="all">All Companies</option>
          <option value="top">Top Companies</option>
        </select>
      </div>

      {/* Jobs table */}
      <div
        style={{
          width: "70%",
          background: "#121212",
          color: "#fff",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h2 style={{ color: "#ff8800" }}>Fresh Jobs</h2>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        {loading ? (
          <div style={{ color: "#aaa", padding: "20px" }}>
            <div
              style={{
                border: "4px solid #333",
                borderTop: "4px solid #ff8800",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                margin: "auto",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ textAlign: "center", marginTop: "10px" }}>Loading jobs...</p>
            <style>
              {`@keyframes spin { 0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);} }`}
            </style>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#ff8800", color: "#000" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Title</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Company</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Location</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Source</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Posted</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Apply</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, idx) => {
                  const posted =
                    job.posted || job.postedTime || job.job_posted_at_datetime_utc;
                  const apply =
                    job.applyLink || job.job_apply_link || job.link || "#";
                  return (
                    <tr key={idx} style={{ borderBottom: "1px solid #333" }}>
                      <td style={{ padding: "12px" }}>{job.title || "-"}</td>
                      <td style={{ padding: "12px" }}>{job.company || "-"}</td>
                      <td style={{ padding: "12px" }}>{job.location || "-"}</td>
                      <td style={{ padding: "12px" }}>{job.source || "-"}</td>
                      <td style={{ padding: "12px" }}>{formatTime(posted)}</td>
                      <td style={{ padding: "12px" }}>
                        <a
                          href={apply}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: "#ff8800",
                            color: "#000",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            textDecoration: "none",
                          }}
                        >
                          Apply
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#aaa" }}>
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
