import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { X, Info } from "lucide-react";
import { LINE_COLORS } from "../lib/constants";

export default function ComparisonPanel({ selected, radarData, onToggle }) {
  if (selected.length === 0) return null;

  return (
    <div style={{
      background: "#1F1A14", border: "1px solid #3A3226", borderRadius: 12, padding: 18, marginBottom: 22,
      display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center",
    }}>
      <div style={{ width: 300, height: 260 }}>
        <ResponsiveContainer>
          <RadarChart data={radarData} outerRadius="75%">
            <PolarGrid stroke="#3A3226" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#B8AC93", fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#6B5F49", fontSize: 9 }} />
            {selected.map((b, i) => (
              <Radar key={b.ball_name} name={b.ball_name} dataKey={b.ball_name}
                stroke={LINE_COLORS[i]} fill={LINE_COLORS[i]} fillOpacity={0.18} strokeWidth={2} />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 11, color: "#8A7E67", textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}>
          <Info size={12} /> Comparing {selected.length} of 6
        </div>
        {selected.map((b, i) => (
          <div key={b.ball_name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: LINE_COLORS[i], flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#EDE6D6" }}>{b.brand} {b.ball_name}</span>
            <button onClick={() => onToggle(b)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#8A7E67", cursor: "pointer" }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
