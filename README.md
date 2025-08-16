# Job Board Backend (LinkedIn + Gemini + MongoDB)

Node.js/Express backend that uses the Gemini API to extract fresh LinkedIn job listings,
normalizes them, and stores them in MongoDB. Your React frontend can call these endpoints
to show the latest jobs with working "Apply" links that open the LinkedIn posting.

> Note: Scraping LinkedIn can violate their Terms of Service. Use responsibly and only where permitted.

## Endpoints

- `GET /api/jobs/fresh?query=Software Engineer&location=India`  
  Fetch fresh jobs from LinkedIn via Gemini (last 24h), upsert to MongoDB, and return latest.

- `GET /api/jobs?page=1&limit=50&q=react&company=Google&source=LinkedIn`  
  Read from MongoDB with optional filters.

## Quick Start

1. Install
```bash
npm install
cp .env.sample .env
# edit .env and set GEMINI_API_KEY and MONGODB_URI
```

2. Run MongoDB (local or Atlas).

3. Start server
```bash
npm run dev
# or
npm start
```

Server on `http://localhost:5000`

## Frontend Usage

Call the fresh endpoint when user clicks "Apply Filter" or on an interval:

```js
fetch(`http://localhost:5000/api/jobs/fresh?query=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`)
  .then(r => r.json())
  .then(setJobs);
```

Your "Apply" buttons should link to each job's `applyLink` (already absolute).

## Environment Variables

- `GEMINI_API_KEY` - your Google AI Studio API key
- `MONGODB_URI` - e.g. `mongodb://localhost:27017/jobboard` or Atlas URI
- `PORT` - default 5000
- `ALLOW_ORIGIN` - CORS allow origin (default `*`)
```

