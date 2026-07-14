import React, { useState, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import BALLS from "./data/balls.json";
import { scoreBall } from "./lib/ScoreBall.js";
import { METRIC_LABELS, LINE_COLORS } from "./lib/constants.js";
import { BallCard } from "./components/BallCard.jsx";
import { FilterBar } from "./components/FilterBar.jsx";
import ComparisonPanel from "./components/ComparisonPanel.jsx";
import { ArsenalAdvisor } from "./components/ArsenalAdvisor.jsx";
import BallRequestForm from "./components/BallRequestForm.jsx";

export default function App() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [selected, setSelected] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [showBallRequestPage, setShowBallRequestPage] = useState(false);
  const [showAdvisorPanel, setShowAdvisorPanel] = useState(false);

  const numBalls = BALLS.length;

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

  function replaceBall(remove, add) {
    setSelected(prev => [...prev.filter(ball => ball.id !== remove.id), add]);
  }

  function handleQueryChange(value) {
    setQuery(value);
    if (value.trim()) setShowSelectedOnly(false);
  }

  function handleToggleShowSelectedOnly() {
    if (!showSelectedOnly) setQuery("");
    setShowSelectedOnly(current => !current);
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
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 34, margin: 0, color: "#F5EEDD" }}>
          Build Your Arsenal
        </h1>
        <p style={{ color: "#9C8F76", fontSize: 13, marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>
          {numBalls} balls across 9 brands, scored on RG, differential, intermediate differential, coverstock type, and factory finish only —
          normalized to 0–100 under a fixed benchmark layout and house-shot assumption. No proprietary cover formulas are ranked.
        </p>
      </header>
      {/* Advisor Panel */}
      {showAdvisorPanel && (
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(480px, 100%)",
          background: "rgba(10, 9, 7, 0.95)",
          backdropFilter: "blur(8px)",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.35)",
          zIndex: 1000,
          padding: "24px 20px 24px",
          overflowY: "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button
              onClick={() => setShowAdvisorPanel(false)}
              style={{
                background: "#211C16",
                border: "1px solid #3A3226",
                color: "#EDE6D6",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
          <ArsenalAdvisor
            balls={BALLS}
            selected={selected}
            onAdd={toggle}
            onReplace={replaceBall}
          />
        </div>
      )}
      {/* Ball Request Page */}
      {showBallRequestPage && (
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100%)",
          background: "rgba(10, 9, 7, 0.95)",
          backdropFilter: "blur(8px)",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.35)",
          zIndex: 1000,
          padding: "24px 20px 24px",
          overflowY: "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button
              onClick={() => setShowBallRequestPage(false)}
              style={{
                background: "#211C16",
                border: "1px solid #3A3226",
                color: "#EDE6D6",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
          <BallRequestForm />
        </div>
      )}

      {/* shows filter bar, arsenal recommendation, ball request */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <FilterBar
            query={query} onQueryChange={handleQueryChange}
            brand={brand} onBrandChange={setBrand}
            brands={brands} resultCount={filtered.length}
            showSelectedOnly={showSelectedOnly}
            onToggleShowSelectedOnly={handleToggleShowSelectedOnly}
            selectedCount={selected.length}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setShowAdvisorPanel(value => !value)}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid #C9A45C",
              background: "#C9A45C",
              color: "#171310",
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            aria-label="Toggle arsenal advisor"
          >
            <Sparkles size={18} />
          </button>
          <button
            onClick={() => setShowBallRequestPage(true)}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid #C9A45C",
              background: "#C9A45C",
              color: "#171310",
              fontSize: 24,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            aria-label="Request a new ball"
          >
            +
          </button>
        </div>
      </div>

      {/* shows radar chart of the selected balls */}
      <ComparisonPanel 
        selected={selected} 
        radarData={radarData} 
        onToggle={toggle} 
      />

      {/* shows the list of filtered balls */}
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
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
