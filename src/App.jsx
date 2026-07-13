import React, { useState, useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import BALLS from "./data/balls.json";
import { scoreBall } from "./lib/ScoreBall.js";
import { METRIC_LABELS, LINE_COLORS } from "./lib/constants.js";
import { BallCard } from "./components/BallCard.jsx";
import { FilterBar } from "./components/FilterBar.jsx";
import ComparisonPanel from "./components/ComparisonPanel.jsx";

export default function App() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [selected, setSelected] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const brands = useMemo(() => ["All", ...Array.from(new Set(BALLS.map(b => b.brand))).sort()], []);

  const scored = useMemo(() => BALLS.map(b => ({ ball: b, scores: scoreBall(b) })), []);

  const filtered = useMemo(() => {
    return scored.filter(({ ball }) => {
      const matchesBrand = brand === "All" || ball.brand === brand;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || ball.ball_name.toLowerCase().includes(q) || ball.brand.toLowerCase().includes(q) || ball.coverstock.toLowerCase().includes(q);
      const matchesSelected = !showSelectedOnly || selected.some(b => b.ball_name === ball.ball_name && b.brand === ball.brand);
      return matchesBrand && matchesQuery && matchesSelected;
    });
  }, [scored, brand, query, showSelectedOnly, selected]);

  function toggle(ball) {
    setSelected(prev => {
      const exists = prev.find(b => b.ball_name === ball.ball_name && b.brand === ball.brand);
      if (exists) return prev.filter(b => !(b.ball_name === ball.ball_name && b.brand === ball.brand));
      if (prev.length >= 6) return prev;
      return [...prev, ball];
    });
  }

  const radarData = useMemo(() => {
    return METRIC_LABELS.map(m => {
      const row = { metric: m.label };
      selected.forEach((b, i) => {
        row[b.ball_name] = scoreBall(b)[m.key];
      });
      return row;
    });
  }, [selected]);

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: "linear-gradient(180deg, #171310 0%, #1B1611 100%)",
      minHeight: "100%",
      color: "#EDE6D6",
      padding: "28px 24px 40px",
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" />

      <header style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#C9A45C", textTransform: "uppercase", marginBottom: 6 }}>
          Published-Spec Motion Model
        </div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 34, margin: 0, color: "#F5EEDD" }}>
          Ball Motion Explorer
        </h1>
        <p style={{ color: "#9C8F76", fontSize: 13, marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>
          142 balls across 9 brands, scored on RG, differential, intermediate differential, coverstock type, and factory finish only —
          normalized to 0–100 under a fixed benchmark layout and house-shot assumption. No proprietary cover formulas are ranked.
        </p>
      </header>

      <FilterBar
        query={query} onQueryChange={setQuery}
        brand={brand} onBrandChange={setBrand}
        brands={brands} resultCount={filtered.length}
        showSelectedOnly={showSelectedOnly}
        onToggleShowSelectedOnly={() => setShowSelectedOnly(!showSelectedOnly)}
        selectedCount={selected.length}
      />

      <ComparisonPanel selected={selected} radarData={radarData} onToggle={toggle} />

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14,
      }}>
        {filtered.map(({ ball, scores }) => {
          const idx = selected.findIndex(b => b.ball_name === ball.ball_name && b.brand === ball.brand);
          return (
            <BallCard key={ball.brand + ball.ball_name} ball={ball} scores={scores}
              onToggle={toggle} selected={idx > -1} colorIndex={idx > -1 ? idx : 0} />
          );
        })}
      </div>
    </div>
  );
}