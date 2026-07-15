# Build Your Arsenal

Build Your Arsenal is a React + Vite app for comparing bowling balls by motion profile. The interface lets you browse a curated catalog, filter by brand or view only the selected balls, select balls for side-by-side comparison, and open compact side panels for an Arsenal Advisor and a ball-request form.

## Live Demo

A deployed version of the app is available on Vercel.

- [Open the deployed app](bowling-arsenal-builder.vercel.app)

## What the app does

- Search and filter the ball catalog by name, brand, or coverstock
- Toggle between the full catalog and a filtered view of the balls currently selected for comparison
- Compare selected balls with a radar chart across motion-related traits like length, midlane read, flare, backend potential, and hook
- Use the Arsenal Advisor to evaluate the current lineup and suggest balls that could fill a gap
- Submit requests for balls that are missing from the database through a drawer-style form
- View core specs such as RG, differential, intermediate differential, finish, and coverstock
- Score motion traits using a lightweight heuristic model based on each ball's physical attributes

## Current Dataset

The app currently loads 147 bowling balls across 9 brands, including 900 Global, Brunswick, DV8, Ebonite, Hammer, Motiv, Radical, Roto Grip, and Storm.

## Tech Stack

- React
- Vite
- JavaScript
- Recharts
- Lucide React
- Vercel analytics & speed insights

## Project Structure

```text
server/
├── ballRequests.js
├── data/
│   └── ball-requests.json
└── recommendBalls.js
src/
├── App.jsx
├── brandColors.js
├── components/
│   ├── ArsenalAdvisor.jsx
│   ├── BallCard.jsx
│   ├── BallRequestForm.jsx
│   ├── Bar.jsx
│   ├── ComparisonPanel.jsx
│   └── FilterBar.jsx
├── data/
│   └── balls.json
├── index.css
├── lib/
│   ├── ScoreBall.js
│   ├── constants.js
│   └── recommendArsenal.js
└── main.jsx
```

## Data and Scoring

The ball catalog lives in [src/data/balls.json](src/data/balls.json). Each ball includes specs such as RG, differential, intermediate differential, finish grit, and coverstock type. Finish values were normalized where needed, including Polish as roughly 4000 grit, Reacta Gloss as roughly 5000 grit, and Compound as roughly 3000 grit.

The scoring logic in [src/lib/ScoreBall.js](src/lib/ScoreBall.js) normalizes those values and converts them into motion scores for the comparison view.

## Local Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Local Backend and Requests

The app includes lightweight local API routes defined in [vite.config.js](vite.config.js):

- POST /api/ball-requests saves new ball requests to [server/data/ball-requests.json](server/data/ball-requests.json)
- GET /api/ball-requests lists saved requests
- POST /api/recommend-balls is wired for recommendation support

The current recommendation helper in [server/recommendBalls.js](server/recommendBalls.js) is a placeholder, so the advisor UI is ready for future integration with an external recommendation service.

## Notes

The motion scoring is an approximation intended for comparison and visualization rather than a precise physics model. It is useful for exploring how different ball specs may influence motion on the lanes.

## AI Collaboration

This project was completed as part of Anthropic's AI Fluency: Framework & Foundations course, which focused on responsible human-AI collaboration.

Claude AI served as a development assistant throughout the project, helping with implementation, data organization, and UI iteration. My responsibilities included defining the scope, researching and validating the ball dataset, testing the app, refining the experience, and making the final product decisions.

## Acknowledgements

This project was started as part of Anthropic's AI Fluency: Framework & Foundations course, exploring effective and responsible AI-assisted software development using Claude AI.
