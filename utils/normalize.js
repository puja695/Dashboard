/**
 * Convert Gemini output (which may be markdown, code blocks, or text) into a JSON array.
 * Also normalize fields and parse dates.
 */
export function extractJsonArray(geminiText) {
  if (!geminiText) return [];
  let text = geminiText.trim();
  // Remove code fences
  text = text.replace(/^```(json)?/gi, "").replace(/```$/gi, "").trim();

  // Try to find the first JSON array in the string
  const match = text.match(/\[.*\]/s);
  const jsonStr = match ? match[0] : text;

  try {
    const arr = JSON.parse(jsonStr);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch (e) {
    return [];
  }
}

export function normalizeJobs(jobs) {
  const parsed = [];
  for (const j of jobs) {
    if (!j) continue;
    const title = (j.title || "").toString().trim();
    const company = (j.company || "").toString().trim();
    const location = (j.location || "").toString().trim();
    const applyLink = (j.applyLink || j.link || j.url || "").toString().trim();
    const source = (j.source || "LinkedIn").toString().trim();
    const rawPosted = (j.postedTime || j.posted || j.date || "").toString().trim();
    let postedTime = new Date();
    const iso = Date.parse(rawPosted);
    if (!isNaN(iso)) postedTime = new Date(iso);

    if (!title || !company || !applyLink) continue;

    // ensure linkedin link opens correctly
    const link = applyLink.startsWith("http") ? applyLink : `https://www.linkedin.com${applyLink}`;

    parsed.push({
      title,
      company,
      location,
      source,
      applyLink: link,
      postedTime,
      rawPosted,
      keywords: (title + " " + company).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
    });
  }
  return parsed;
}
