# Ball Motion Explorer

A React + Vite app for comparing bowling balls by their motion characteristics. The interface lets you browse a curated dataset, filter by brand, toggle to only view selected balls, and compare up to six balls side by side through a radar-style motion chart.

## What the app does

- Search and filter the ball catalog by name, brand, or coverstock
- Toggle between the full catalog and a filtered view of the balls currently selected for comparison
- Compare selected balls with a radar chart across length, midlane read, flare, backend, and hook
- Use the Arsenal Gap Advisor to enter player specs and identify three balls that fill a motion gap in the selected lineup
- With a ball comparison of more than one ball, identify the closest pair in the bag and suggest a replacement selected from the full catalog
- View each ball's core specs such as RG, differential, and intermediate differential
- Score motion traits using a lightweight heuristic model based on the ball's physical attributes

## Current dataset

The app currently loads 145 bowling balls across 9 brands, including 900 Global, Brunswick, DV8, Ebonite, Hammer, Motiv, Radical, Roto Grip, and Storm.

## Tech stack

- React
- Vite
- JavaScript
- Recharts
- Lucide React

## Project structure

```text
src/
├── App.jsx
├── components/
│   ├── BallCard.jsx
│   ├── Bar.jsx
│   ├── ComparisonPanel.jsx
│   ├── ArsenalAdvisor.jsx
│   └── FilterBar.jsx
├── data/
│   └── balls.json
├── index.css
├── lib/
│   ├── ScoreBall.js
│   ├── recommendArsenal.js
│   └── constants.js
└── main.jsx
```

## Data and scoring

The ball catalog lives in [src/data/balls.json](src/data/balls.json). Each ball includes specs such as RG, differential, intermediate differential, finish grit, and coverstock type. Finish values were normalized where needed, including Polish as roughly 4000 grit, Reacta Gloss as roughly 5000 grit, and Compound as roughly 3000 grit.
The scoring logic in [src/lib/ScoreBall.js](src/lib/ScoreBall.js) normalizes the values and converts them into motion scores for the comparison view.

## Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

### AI recommendations

The AI recommendation endpoint is available while running the Vite development server and as a Vercel serverless function in production. Copy `.env.example` to `.env`, then add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_key_here
```

Keep this key server-side. Do not use a `VITE_` prefix or commit the `.env` file.

Create a production build:

```bash
npm run build
```

## Notes

The motion scoring is an approximation intended for comparison and visualization rather than a precise physics model. It is useful for exploring how different ball specs may influence motion on the lanes.

## AI Collaboration

This project was completed as part of Anthropic's **AI Fluency: Framework & Foundations** course, which focuses on responsible human-AI collaboration.

Claude AI served as my primary development assistant, generating much of the application's codebase and assisting with data organization. My responsibilities included defining the project's scope, researching and selecting the bowling balls, cleaning and validating the dataset, managing version control, testing the application, identifying UI issues, and refining the final product.

This project demonstrates my ability to effectively direct AI tools while maintaining responsibility for project planning, data quality, testing, and final implementation decisions.

## Acknowledgements

This project was completed as part of Anthropic's **AI Fluency: Framework & Foundations** course, exploring effective and responsible AI-assisted software development using Claude AI.
