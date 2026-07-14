import React, { useMemo, useState } from "react";
import { Sparkles, Target, Plus, RefreshCw } from "lucide-react";
import { recommendArsenal } from "../lib/recommendArsenal.js";

const inputStyle = {
  width: "100%", background: "#171310", border: "1px solid #4A3E2B", borderRadius: 7,
  color: "#EDE6D6", padding: "9px 10px", fontSize: 13,
};

export function ArsenalAdvisor({ balls, selected, onAdd, onReplace }) {
  const [hasRun, setHasRun] = useState(false);
  const [specs, setSpecs] = useState({ speed: "15", revRate: "350", laneCondition: "medium", preferredShape: "auto" });

  const result = useMemo(() => recommendArsenal(balls, selected, specs), [balls, selected, specs]);
  const updateSpec = (key, value) => setSpecs(current => ({ ...current, [key]: value }));

  return (
    <section style={{ background: "#211B13", border: "1px solid #59401F", borderRadius: 12, marginBottom: 22, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: "1px solid #4A3E2B" }}>
        <span style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: "50%", background: "#C9A45C", color: "#171310" }}><Sparkles size={16} /></span>
        <div>
          <div style={{ display: "block", fontFamily: "'Oswald', sans-serif", fontSize: 16 }}>Arsenal Advisor</div>
          <div style={{ display: "block", color: "#B8AC93", fontSize: 11, marginTop: 2 }}>Find the next ball that best fills the gap.</div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <label style={{ fontSize: 11, color: "#B8AC93", textTransform: "uppercase", letterSpacing: 0.8 }}>Ball speed (mph)
            <input aria-label="Ball speed in mph" type="number" min="8" max="25" value={specs.speed} onChange={event => updateSpec("speed", event.target.value)} style={{ ...inputStyle, marginTop: 6 }} />
          </label>
          <label style={{ fontSize: 11, color: "#B8AC93", textTransform: "uppercase", letterSpacing: 0.8 }}>Rev rate (rpm)
            <input aria-label="Rev rate in rpm" type="number" min="100" max="700" step="25" value={specs.revRate} onChange={event => updateSpec("revRate", event.target.value)} style={{ ...inputStyle, marginTop: 6 }} />
          </label>
          <label style={{ fontSize: 11, color: "#B8AC93", textTransform: "uppercase", letterSpacing: 0.8 }}>Typical lane condition
            <select aria-label="Typical lane condition" value={specs.laneCondition} onChange={event => updateSpec("laneCondition", event.target.value)} style={{ ...inputStyle, marginTop: 6 }}>
              <option value="light">Light / dry</option><option value="medium">Medium / house shot</option><option value="heavy">Heavy / fresh</option>
            </select>
          </label>
          <label style={{ fontSize: 11, color: "#B8AC93", textTransform: "uppercase", letterSpacing: 0.8 }}>Preferred shape
            <select aria-label="Preferred ball shape" value={specs.preferredShape} onChange={event => updateSpec("preferredShape", event.target.value)} style={{ ...inputStyle, marginTop: 6 }}>
              <option value="auto">Let the advisor decide</option><option value="smooth">Smooth / controlled</option><option value="angular">Angular / responsive</option>
            </select>
          </label>
        </div>
        <button onClick={() => setHasRun(true)} style={{ marginTop: 16, padding: "10px 14px", display: "inline-flex", alignItems: "center", gap: 8, background: "#C9A45C", color: "#171310", border: "none", borderRadius: 7, fontWeight: 700, cursor: "pointer" }}>
          <Sparkles size={15} /> Analyze my arsenal
        </button>

        {hasRun && <div style={{ marginTop: 18 }}>
          {result.isBalanced ? <div style={{ background: "#1E2A20", border: "1px solid #49634C", borderRadius: 8, padding: 14, display: "flex", gap: 9, alignItems: "flex-start", color: "#BED7B9" }}>
            <Target size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            <div><strong style={{ color: "#E2F0DD" }}>Your arsenal looks pretty balanced.</strong><div style={{ fontSize: 13, marginTop: 3, lineHeight: 1.45 }}>No pair in your lineup overlaps by more than 90% in this motion model, so no addition or replacement is recommended right now.</div></div>
          </div> : <>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 13, color: "#D8C49B" }}>
            <Target size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div><strong style={{ color: "#F5EEDD" }}>Recommended gap: {result.profile.title}</strong><div style={{ color: "#B8AC93", fontSize: 13, marginTop: 3 }}>{result.profile.reason} Based on {selected.length ? `${selected.length} selected ball${selected.length === 1 ? "" : "s"}` : "your player specs and the catalog"}.</div></div>
          </div>
          {result.replacement && <div style={{ background: "#302317", border: "1px solid #71502A", borderRadius: 8, padding: 13, marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 9 }}>
            <RefreshCw size={16} color="#D5A44C" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 13, lineHeight: 1.45, color: "#D8C49B" }}>
              <strong style={{ color: "#F5EEDD" }}>Similar-ball alert</strong><br />
              <strong>{result.replacement.remove.brand} {result.replacement.remove.ball_name}</strong> and <strong>{result.replacement.keep.brand} {result.replacement.keep.ball_name}</strong> are your most similar pair ({result.replacement.similarity}% overlap). Consider replacing <strong>{result.replacement.remove.ball_name}</strong> with <strong>{result.replacement.recommendation.ball.brand} {result.replacement.recommendation.ball.ball_name}</strong> to create a clearer role in the bag.
              <button onClick={() => onReplace(result.replacement.remove, result.replacement.recommendation.ball)} style={{ display: "block", marginTop: 9, padding: "7px 9px", border: "1px solid #D5A44C", borderRadius: 6, background: "transparent", color: "#E8BD6C", cursor: "pointer", fontSize: 12 }}>Replace in comparison</button>
            </div>
          </div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {result.recommendations.map(({ ball, fit, why }) => <article key={ball.id} style={{ background: "#171310", border: "1px solid #3A3226", borderRadius: 8, padding: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "start" }}><strong>{ball.brand} {ball.ball_name}</strong><span style={{ color: "#D5A44C", fontSize: 11, whiteSpace: "nowrap" }}>{fit}% fit</span></div>
              <div style={{ color: "#9C8F76", fontSize: 12, margin: "7px 0 10px", lineHeight: 1.4 }}>{why}</div>
              <button onClick={() => onAdd(ball)} style={{ padding: 0, border: "none", background: "none", color: "#D5A44C", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12 }}><Plus size={14} /> Add to comparison</button>
            </article>)}
          </div>
          {result.recommendations.length === 0 && <p style={{ color: "#B8AC93", fontSize: 13, margin: 0 }}>No catalog balls meet the 90% overlap limit for this lineup.</p>}
          <p style={{ color: "#80745F", fontSize: 11, lineHeight: 1.45, margin: "13px 0 0" }}>Recommendations use this app’s published-spec motion model; layouts, surfaces, lane patterns, and your release can change the result.</p>
          </>}
        </div>}
      </div>
    </section>
  );
}
