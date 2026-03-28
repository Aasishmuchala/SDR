"use client";
import { useState, useEffect } from "react";

const gold = "#D4AF37";
const goldLight = "#F3E5AB";
const border = "rgba(255,255,255,0.08)";
const surface = "rgba(255,255,255,0.03)";
const textSec = "rgba(255,255,255,0.55)";
const textMuted = "rgba(255,255,255,0.35)";

function Toast({ message, type = "success", onClose }: { message: string; type?: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "success" ? "rgba(34,197,94,0.15)" : type === "info" ? "rgba(212,175,55,0.15)" : "rgba(59,130,246,0.15)";
  const col = type === "success" ? "#22c55e" : type === "info" ? gold : "#3b82f6";
  return <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999, padding: "12px 20px", background: bg, border: `1px solid ${col}33`, borderRadius: 10, color: col, fontSize: 13, backdropFilter: "blur(12px)" }}>{message}</div>;
}

const mandate = {
  id: "ST-M0042", client: "Aasish Muchala", entity: "Sthyra Ventures Pvt. Ltd.",
  tier: "Platinum", value: "₹12,45,000", startDate: "January 15, 2026", status: "Active",
};

const stages = [
  { name: "Application Received", date: "Jan 10, 2026", status: "completed", desc: "Mandate form submitted via sthyra.com" },
  { name: "Internal Review", date: "Jan 12, 2026", status: "completed", desc: "Acquisition council evaluated the mandate fit" },
  { name: "Mandate Accepted", date: "Jan 15, 2026", status: "completed", desc: "Terms agreed, ₹5,00,000 retainer received" },
  { name: "Onboarding & Discovery", date: "Jan 20, 2026", status: "completed", desc: "Brand audit, competitor mapping, ICP definition" },
  { name: "Infrastructure Build", date: "Feb 1, 2026", status: "completed", desc: "Funnels, creatives, tracking architecture deployed" },
  { name: "Campaign Live", date: "Feb 15, 2026", status: "active", desc: "Active acquisition across Meta, Google, LinkedIn" },
  { name: "Optimization Cycle", date: "Apr 2026", status: "pending", desc: "Data-driven iteration and scaling" },
  { name: "Quarterly Review", date: "Apr 2026", status: "pending", desc: "Performance report, strategy recalibration" },
];

const initDeliverables = [
  { name: "Brand Audit Report", date: "Jan 22, 2026", type: "PDF", size: "2.4 MB" },
  { name: "Acquisition Funnel v1", date: "Feb 5, 2026", type: "Figma", size: "—" },
  { name: "UE5 Hero Creative", date: "Feb 10, 2026", type: "Video", size: "148 MB" },
  { name: "Monthly Report — Feb", date: "Mar 1, 2026", type: "PDF", size: "3.1 MB" },
  { name: "Monthly Report — Mar", date: "Mar 28, 2026", type: "PDF", size: "2.8 MB" },
];

export default function MandatePage() {
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState<number | null>(null);

  const handleDownload = (name: string, type: string) => {
    setToast({ msg: `Downloading ${name} (${type})…`, type: "info" });
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Deliverable Detail Modal */}
      {showDetail !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowDetail(null)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", background: "#111", border: `1px solid ${border}`, borderRadius: 16, padding: 32, width: "90%", maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 400, color: "#fff", margin: 0 }}>{initDeliverables[showDetail].name}</h2>
              <button onClick={() => setShowDetail(null)} style={{ background: "none", border: "none", color: textMuted, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[{ l: "Type", v: initDeliverables[showDetail].type }, { l: "Size", v: initDeliverables[showDetail].size }, { l: "Delivered", v: initDeliverables[showDetail].date }, { l: "Status", v: "Approved" }].map((item, j) => (
                <div key={j} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 10, color: textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.l}</div>
                  <div style={{ fontSize: 14, color: "#fff", marginTop: 4 }}>{item.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { handleDownload(initDeliverables[showDetail!].name, initDeliverables[showDetail!].type); setShowDetail(null); }}
                style={{ flex: 1, padding: 12, background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#000", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Download</button>
              <button onClick={() => { setToast({ msg: "Opening preview…", type: "info" }); setShowDetail(null); }}
                style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: textSec, fontSize: 13, cursor: "pointer" }}>Preview</button>
            </div>
          </div>
        </div>
      )}

      <h1 style={{ fontSize: 24, fontWeight: 300, color: "#fff", margin: 0, marginBottom: 4 }}>Mandate</h1>
      <p style={{ fontSize: 13, color: textMuted, marginBottom: 32 }}>Track your engagement lifecycle and deliverables.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        <div>
          {/* Mandate Info Card */}
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, color: textMuted, letterSpacing: "0.08em" }}>{mandate.id}</div>
                <div style={{ fontSize: 18, fontWeight: 400, color: "#fff", marginTop: 4 }}>{mandate.entity}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: 11, fontWeight: 500 }}>{mandate.status}</span>
                <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(212,175,55,0.12)", color: gold, fontSize: 11, fontWeight: 500 }}>{mandate.tier}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${border}` }}>
              {[{ label: "Mandate Value", val: mandate.value }, { label: "Start Date", val: mandate.startDate }, { label: "Contact", val: mandate.client }].map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: textMuted, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 14, color: i === 0 ? gold : "#fff" }}>{m.val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${border}` }}>
              <button onClick={() => setToast({ msg: "Exporting mandate summary as PDF…", type: "info" })} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: textSec, fontSize: 11, cursor: "pointer" }}>Export Summary</button>
              <button onClick={() => setToast({ msg: "Opening mandate contract…", type: "info" })} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: textSec, fontSize: 11, cursor: "pointer" }}>View Contract</button>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 24 }}>Engagement Timeline</div>
            <div style={{ position: "relative", paddingLeft: 28 }}>
              <div style={{ position: "absolute", left: 9, top: 8, bottom: 8, width: 2, background: border }} />
              {stages.map((s, i) => (
                <div key={i} onClick={() => setExpandedStage(expandedStage === i ? null : i)} style={{ position: "relative", paddingBottom: i < stages.length - 1 ? 28 : 0, cursor: "pointer" }}>
                  <div style={{ position: "absolute", left: -28, top: 2, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: s.status === "completed" ? gold : s.status === "active" ? "#000" : "rgba(255,255,255,0.06)",
                    border: s.status === "active" ? `2px solid ${gold}` : s.status === "completed" ? "none" : `1px solid ${border}`,
                    boxShadow: s.status === "active" ? `0 0 12px rgba(212,175,55,0.4)` : "none" }}>
                    {s.status === "completed" && <svg width="10" height="10" fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>}
                    {s.status === "active" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: gold }} />}
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: s.status === "active" ? 500 : 400, color: s.status === "pending" ? textMuted : "#fff" }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: textMuted }}>{s.date}</div>
                    </div>
                    <div style={{ fontSize: 12, color: textSec, marginTop: 4 }}>{s.desc}</div>
                    {expandedStage === i && (
                      <div style={{ marginTop: 10, padding: 12, background: "rgba(255,255,255,0.02)", border: `1px solid ${border}`, borderRadius: 8, fontSize: 12, color: textSec, animation: "fadeIn 0.2s ease" }}>
                        <div>Stage: <span style={{ color: s.status === "completed" ? "#22c55e" : s.status === "active" ? gold : textMuted, fontWeight: 500 }}>{s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span></div>
                        <div style={{ marginTop: 4 }}>Responsible: Sthyra Acquisition Council</div>
                        {s.status === "completed" && <div style={{ marginTop: 4 }}>Completed on schedule ✓</div>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 16 }}>Deliverables</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {initDeliverables.map((d, i) => (
                <div key={i} onClick={() => setShowDetail(i)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < initDeliverables.length - 1 ? `1px solid ${border}` : "none", cursor: "pointer", transition: "background 0.15s" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: d.type === "PDF" ? "rgba(239,68,68,0.12)" : d.type === "Figma" ? "rgba(168,85,247,0.12)" : "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: d.type === "PDF" ? "#ef4444" : d.type === "Figma" ? "#a855f7" : "#3b82f6", flexShrink: 0 }}>{d.type}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#fff" }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: textMuted }}>{d.date} · {d.size}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDownload(d.name, d.type); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <svg width="16" height="16" fill="none" stroke={textMuted} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 16 }}>Mandate Metrics</div>
            {[{ label: "Days Active", val: "73" }, { label: "Campaigns Running", val: "3" }, { label: "Total Leads", val: "829" }, { label: "Avg. ROI", val: "6.2x" }].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${border}` : "none" }}>
                <span style={{ fontSize: 13, color: textSec }}>{m.label}</span>
                <span style={{ fontSize: 13, color: i === 3 ? gold : "#fff", fontWeight: 500 }}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
