import React, { useState } from "react";

const initialForm = {
  brand: "",
  ballName: "",
  coverstock: "",
  finish: "",
  notes: "",
  contactEmail: "",
};

export default function BallRequestForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/ball-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: form.brand,
          ballName: form.ballName,
          coverstock: form.coverstock,
          finish: form.finish,
          notes: form.notes,
          contactEmail: form.contactEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save request.");
      }

      setStatus("Thanks! Your request has been saved and will be available in the request list.");
      setForm(initialForm);
    } catch (error) {
      setStatus(error.message || "Something went wrong while saving your request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      style={{
        background: "#1F1A14",
        border: "1px solid #3A3226",
        borderRadius: 12,
        padding: 18,
        marginBottom: 22,
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#C9A45C", letterSpacing: 1.5, textTransform: "uppercase" }}>
          Ball requests
        </div>
        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, margin: "4px 0 6px", color: "#F5EEDD" }}>
          Request a ball to add
        </h2>
        <p style={{ fontSize: 13, color: "#9C8F76", margin: 0, lineHeight: 1.5 }}>
          If you own a ball that is missing from the database, send a quick request here. It will open a prefilled email draft for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#B8AC93" }}>
            Brand
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Storm"
              required
              style={inputStyle}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#B8AC93" }}>
            Ball name
            <input
              name="ballName"
              value={form.ballName}
              onChange={handleChange}
              placeholder="Phaze III"
              required
              style={inputStyle}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#B8AC93" }}>
            Coverstock
            <select
              name="coverstock"
              value={form.coverstock}
              onChange={handleChange}
              required
              style={{ ...inputStyle, display: "flex", flexDirection: "column", fontSize: 12, color: "#B8AC93" }}
            >
              <option value="">Select coverstock type</option>
              <option value="Solid Reactive">Solid Reactive</option>
              <option value="Pearl Reactive">Pearl Reactive</option>
              <option value="Hybrid Reactive">Hybrid Reactive</option>
              <option value="Urethane">Urethane</option>
              <option value="Plastic / Polyester">Plastic / Polyester</option>
              <option value="Urethane Solid">Urethane Solid</option>
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#B8AC93" }}>
            Finish
            <input
              name="finish"
              value={form.finish}
              onChange={handleChange}
              placeholder="4000 Grit"
              style={inputStyle}
            />
          </label>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#B8AC93" }}>
          Notes
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any extra details you want to share..."
            rows={4}
            style={{ ...inputStyle, resize: "vertical", minHeight: 90 }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#B8AC93" }}>
          Contact email (optional)
          <input
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            placeholder="you@example.com"
            type="email"
            style={inputStyle}
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            alignSelf: "flex-start",
            background: isSubmitting ? "#8A7E67" : "#C9A45C",
            color: "#171310",
            border: "none",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: isSubmitting ? "wait" : "pointer",
            opacity: isSubmitting ? 0.8 : 1,
          }}
        >
          {isSubmitting ? "Saving..." : "Send request"}
        </button>
      </form>

      {status ? <p style={{ marginTop: 10, fontSize: 12, color: "#B8AC93", lineHeight: 1.5 }}>{status}</p> : null}
    </section>
  );
}

const inputStyle = {
  background: "#211C16",
  border: "1px solid #3A3226",
  borderRadius: 8,
  padding: "8px 10px",
  color: "#EDE6D6",
  fontSize: 13,
  outline: "none",
};
