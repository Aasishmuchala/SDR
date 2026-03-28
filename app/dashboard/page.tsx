"use client";
import { useState, useEffect } from "react";

const gold = "#D4AF37";
const goldLight = "#F3E5AB";
const border = "rgba(255,255,255,0.08)";
const surface = "rgba(255,255,255,0.03)";
const textSec = "rgba(255,255,255,0.55)";
const textMuted = "rgba(255,255,255,0.35)";

/* ── Toast Component ── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999, padding: "12px 20px", background: "rgba(212,175,55,0.15)", border: `1px solid rgba(212,175,55,0.3)`, borderRadius: 10, color: gold, fontSize: 13, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", animation: "fadeIn 0.3s ease" }}>
      {message}
    </div>
  );
}

/* ── Data by Period ── */
const dataByPeriod: Record<string, { stats: { label: string; value: string; change: string; up: boolean; sparkData: number[] }[]; revenue: { month: string; value: number }[] }> = {
  "7d": {
    stats: [
      { label: "Total Spend", value: "₹2,85,000", change: "+8.2%", up: true, sparkData: [65,70,68,75,80,78,85] },
      { label: "Leads Generated", value: "287", change: "+15.4%", up: true, sparkData: [30,35,40,38,42,45,50] },
      { label: "Conversion Rate", value: "5.1%", change: "+0.3%", up: true, sparkData: [46,47,48,49,48,50,51] },
      { label: "Client ROI", value: "6.5x", change: "+0.2x", up: true, sparkData: [60,62,63,64,63,65,66] },
    ],
    revenue: [{ month: "Mon", value: 38 },{ month: "Tue", value: 42 },{ month: "Wed", value: 35 },{ month: "Thu", value: 51 },{ month: "Fri", value: 48 },{ month: "Sat", value: 29 },{ month: "Sun", value: 22 }],
  },
  "30d": {
    stats: [
      { label: "Total Spend", value: "₹12,45,000", change: "+12.5%", up: true, sparkData: [30,45,35,60,50,70,65,80,75,90] },
      { label: "Leads Generated", value: "1,247", change: "+23.1%", up: true, sparkData: [20,30,25,45,40,55,50,65,70,85] },
      { label: "Conversion Rate", value: "4.8%", change: "+0.6%", up: true, sparkData: [35,40,38,42,45,43,47,46,48,52] },
      { label: "Client ROI", value: "6.2x", change: "-0.3x", up: false, sparkData: [60,65,70,68,66,64,65,63,62,60] },
    ],
    revenue: [{ month: "Jul", value: 45 },{ month: "Aug", value: 52 },{ month: "Sep", value: 49 },{ month: "Oct", value: 63 },{ month: "Nov", value: 58 },{ month: "Dec", value: 71 },{ month: "Jan", value: 68 },{ month: "Feb", value: 82 },{ month: "Mar", value: 78 }],
  },
  "90d": {
    stats: [
      { label: "Total Spend", value: "₹38,20,000", change: "+18.7%", up: true, sparkData: [20,28,32,38,42,50,55,62,70,78,82,90] },
      { label: "Leads Generated", value: "3,842", change: "+31.2%", up: true, sparkData: [15,22,28,35,40,48,55,60,68,72,80,88] },
      { label: "Conversion Rate", value: "4.6%", change: "+0.9%", up: true, sparkData: [38,39,40,41,42,43,44,43,45,44,46,47] },
      { label: "Client ROI", value: "6.8x", change: "+0.5x", up: true, sparkData: [55,58,60,62,61,63,65,64,66,67,68,70] },
    ],
    revenue: [{ month: "Jan", value: 68 },{ month: "Feb", value: 82 },{ month: "Mar", value: 78 },{ month: "Apr", value: 0 },{ month: "May", value: 0 },{ month: "Jun", value: 0 },{ month: "Jul", value: 45 },{ month: "Aug", value: 52 },{ month: "Sep", value: 49 },{ month: "Oct", value: 63 },{ month: "Nov", value: 58 },{ month: "Dec", value: 71 }],
  },
};

const campaigns = [
  { name: "Luxury Villa Launch — Goa", status: "Active", spend: "₹3,20,000", leads: 342, roi: "7.1x" },
  { name: "Enterprise SaaS — Pune", status: "Active", spend: "₹2,85,000", leads: 289, roi: "5.8x" },
  { name: "Ultra-Luxury Watches", status: "Paused", spend: "₹1,95,000", leads: 156, roi: "4.2x" },
  { name: "Experiential Resort — Kerala", status: "Review", spend: "₹2,10,000", leads: 198, roi: "6.5x" },
];

const allActivity = [
  { time: "2h ago", text: "New lead captured — Villa Launch campaign", type: "lead" },
  { time: "4h ago", text: "Campaign budget optimized — SaaS Pune", type: "update" },
  { time: "6h ago", text: "Creative asset approved — Watch collection", type: "approval" },
  { time: "1d ago", text: "Mandate #ST-0042 moved to Active", type: "mandate" },
  { time: "1d ago", text: "Monthly report generated — February 2026", type: "report" },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const w = 80, h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return <svg width={w} height={h} style={{ display: "block" }}><polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function MiniBar({ data }: { data: { month: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: "100%", height: `${(d.value / max) * 120}px`, background: d.value > 0 ? `linear-gradient(to top, ${gold}, ${goldLight})` : "rgba(255,255,255,0.04)", borderRadius: "4px 4px 0 0", opacity: 0.85, transition: "height 0.5s ease" }} />
          <span style={{ fontSize: 10, color: textMuted }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Active: { bg: "rgba(34,197,94,0.15)", text: "#22c55e" },
    Paused: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
    Review: { bg: "rgba(99,102,241,0.15)", text: "#818cf8" },
    Completed: { bg: "rgba(255,255,255,0.08)", text: textSec },
  };
  const c = colors[status] || colors.Completed;
  return <span style={{ padding: "3px 10px", borderRadius: 20, background: c.bg, color: c.text, fontSize: 11, fontWeight: 500 }}>{status}</span>;
}

export default function DashboardOverview() {
  const [period, setPeriod] = useState("30d");
  const [toast, setToast] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<string | null>(null);
  const currentData = dataByPeriod[period];
  const filteredActivity = activityFilter ? allActivity.filter(a => a.type === activityFilter) : allActivity;

  const revTotal = currentData.revenue.reduce((s, r) => s + r.value, 0);

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 300, color: "#fff", margin: 0 }}>Welcome back, <span style={{ background: `linear-gradient(to right, ${gold}, ${goldLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Aasish</span></h1>
          <p style={{ fontSize: 13, color: textMuted, marginTop: 4 }}>Here&apos;s your acquisition infrastructure overview.</p>
        </div>
        <div style={{ display: "flex", gap: 4, background: surface, borderRadius: 8, padding: 4, border: `1px solid ${border}` }}>
          {["7d","30d","90d"].map(p => (
            <button key={p} onClick={() => { setPeriod(p); setToast(`Showing ${p === "7d" ? "last 7 days" : p === "30d" ? "last 30 days" : "last 90 days"}`); }}
              style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: period === p ? "rgba(212,175,55,0.15)" : "transparent", color: period === p ? gold : textSec, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        {currentData.stats.map((s, i) => (
          <div key={`${period}-${i}`} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 20, animation: "fadeIn 0.4s ease", animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, color: textMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 300, color: "#fff" }}>{s.value}</div>
              </div>
              <Sparkline data={s.sparkData} color={s.up ? "#22c55e" : "#ef4444"} />
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: s.up ? "#22c55e" : "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>
              <span>{s.up ? "↑" : "↓"}</span>{s.change} <span style={{ color: textMuted }}>vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Activity Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        {/* Revenue Chart */}
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Revenue Generated</div>
              <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>Monthly acquisition revenue</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 300, color: gold }}>₹{revTotal}L</div>
          </div>
          <MiniBar data={currentData.revenue} />
        </div>
        {/* Activity Feed */}
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Recent Activity</div>
            <div style={{ display: "flex", gap: 4 }}>
              {[{ key: null, label: "All" },{ key: "lead", label: "Leads" },{ key: "mandate", label: "Mandates" }].map(f => (
                <button key={f.label} onClick={() => setActivityFilter(f.key)} style={{ padding: "3px 8px", borderRadius: 4, border: "none", background: activityFilter === f.key ? "rgba(212,175,55,0.12)" : "transparent", color: activityFilter === f.key ? gold : textMuted, fontSize: 10, cursor: "pointer" }}>{f.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {filteredActivity.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: textMuted, fontSize: 13 }}>No activity for this filter.</div>
            ) : filteredActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: i < filteredActivity.length - 1 ? `1px solid ${border}` : "none", cursor: "pointer" }}
                onClick={() => setToast(`Viewing: ${a.text}`)}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: a.type === "lead" ? "#22c55e" : a.type === "mandate" ? gold : a.type === "approval" ? "#818cf8" : "rgba(255,255,255,0.2)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Active Campaigns</div>
          <a href="/dashboard/campaigns" style={{ fontSize: 12, color: gold, textDecoration: "none" }}>View all →</a>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {["Campaign", "Status", "Spend", "Leads", "ROI"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: textMuted, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr key={i} style={{ borderBottom: i < campaigns.length - 1 ? `1px solid ${border}` : "none", cursor: "pointer" }}
                onClick={() => setToast(`Opening campaign: ${c.name}`)}>
                <td style={{ padding: "14px 12px", fontSize: 13, color: "#fff" }}>{c.name}</td>
                <td style={{ padding: "14px 12px" }}><StatusBadge status={c.status} /></td>
                <td style={{ padding: "14px 12px", fontSize: 13, color: textSec }}>{c.spend}</td>
                <td style={{ padding: "14px 12px", fontSize: 13, color: textSec }}>{c.leads}</td>
                <td style={{ padding: "14px 12px", fontSize: 13, color: gold, fontWeight: 500 }}>{c.roi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
