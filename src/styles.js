export const ACCENT = "#c0392b";
export const ACCENT_HOVER = "#a93226";

export const cont = (d) => ({ maxWidth: 1400, margin: "0 auto", padding: "80px 60px 40px", fontFamily: "'Inter',system-ui,-apple-system,sans-serif", background: d ? "#111" : "#fff", minHeight: "100vh", boxSizing: "border-box", transition: "background 0.2s" });
export const inp = (d) => ({ padding: "10px 12px", fontSize: 14, border: "1.5px solid " + (d ? "#333" : "#e0e0e0"), borderRadius: 8, outline: "none", background: d ? "#1a1a1a" : "#fafafa", color: d ? "#e0e0e0" : "#333" });
export const icnBtn = (d) => ({ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#888", padding: "4px 6px", borderRadius: 4 });
export const btnAd = { padding: "10px 20px", fontSize: 14, fontWeight: 600, background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" };
export const btnSv = { padding: "6px 14px", fontSize: 13, fontWeight: 600, background: "#27ae60", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
export const btnCn = (d) => ({ padding: "6px 14px", fontSize: 13, fontWeight: 600, background: d ? "#333" : "#eee", color: d ? "#ccc" : "#555", border: "none", borderRadius: 6, cursor: "pointer" });
export const errS = { margin: "8px 0 0", fontSize: 13, color: "#c0392b", fontWeight: 500 };
export const itemCont = (d) => ({ borderRadius: 10, border: "1px solid " + (d ? "#222" : "#eee"), overflow: "hidden" });
export const itemRow = (d) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: d ? "#1a1a1a" : "#f8f9fa" });
export const subPanel = (d) => ({ padding: "8px 14px 12px 42px", background: d ? "#111" : "#f1f3f5", borderTop: "1px solid " + (d ? "#222" : "#e9ecef"), display: "flex", flexDirection: "column", gap: 6 });
export const subRowS = (d) => ({ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: d ? "#1a1a1a" : "#fff", borderRadius: 6, border: "1px solid " + (d ? "#222" : "#e9ecef") });
