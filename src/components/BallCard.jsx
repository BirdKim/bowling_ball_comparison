import React from 'react';
import Bar from './Bar.jsx';
import { METRIC_LABELS, LINE_COLORS } from '../lib/constants.js';

export function BallCard({ ball, scores, onToggle, selected, colorIndex }) {
  return (
    <button
      onClick={() => onToggle(ball)}
      style={{
        textAlign: "left",
        width: "100%",
        background: selected ? "#2E2A22" : "#211C16",
        border: selected ? `1px solid ${LINE_COLORS[colorIndex]}` : "1px solid #3A3226",
        borderRadius: 10,
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, letterSpacing: 0.3, color: "#F1E9D8" }}>
            {ball.ball_name}
          </div>
          <div style={{ fontSize: 11, color: "#9C8F76", textTransform: "uppercase", letterSpacing: 1 }}>
            {ball.brand}
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#C9A45C", fontFamily: "'IBM Plex Mono', monospace", textAlign: "right" }}>
          {ball.coverstock_type}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 14px", fontSize: 11, color: "#B8AC93" }}>
        <span>RG {ball.rg != null ? ball.rg.toFixed(3) : "—"}</span>
        <span>Diff {ball.differential != null ? ball.differential.toFixed(3) : "—"}</span>
        <span>Mass Bias {ball.intermediate_differential != null ? ball.intermediate_differential.toFixed(3) : "—"}</span>
        <span>{ball.finish_grit === "Polish" ? "Polish" : `${ball.finish_grit ?? "—"} grit`}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 2 }}>
        {METRIC_LABELS.map(m => (
          <div key={m.key} style={{ display: "grid", gridTemplateColumns: "70px 1fr 26px", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "#8A7E67", textTransform: "uppercase", letterSpacing: 0.5 }}>{m.label}</span>
            <Bar value={scores[m.key]} color={selected ? LINE_COLORS[colorIndex] : "#6B5F49"} />
            <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "#D8CBAE", textAlign: "right" }}>{scores[m.key]}</span>
          </div>
        ))}
      </div>
    </button>
  );
}