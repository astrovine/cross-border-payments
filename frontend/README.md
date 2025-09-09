# Cross-Border Payment Optimizer (Frontend)

This is a React + Tailwind CSS frontend for the Cross-Border Payment Optimizer.

## Quick start

1. Install dependencies:

```powershell
cd frontend
npm install
```

2. Run the dev server:

```powershell
npm start
```

3. Make sure your FastAPI backend is running at `http://localhost:8000` so the frontend can fetch recommendations.

## Notes
- Replace `/map-bg.svg` in `public/` with a map-style background image if desired.
- The fetch URL in `src/App.jsx` points to `http://localhost:8000/recommend`.
- For deployment to Vercel, push the `frontend` folder to a git repo and connect to Vercel; it will run `npm build` automatically.
