"use client";
import { useState, useEffect } from "react";

const gold = "#D4AF37";
const goldLight = "#F3E5AB";
const border = "rgba(255,255,255,0.08)";
const surface = "rgba(255,255,255,0.03)";
const textSec = "rgba(255,255,255,0.55)";
const textMuted = "rgba(255,255,255,0.35)";

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999, padding: "12px 20px", background: "rgba(212,175,55,0.15)", border: `1px solid rgba(212,175,55,0.3)`, borderRadius: 10, color: gold, fontSize: 13, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>{message}</div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#111", border: `1px solid ${border}`, borderRadius: 16, padding: 32, width: "90%", maxWidth: 520, maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 400, color: "#fff", margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: textMuted, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const initialCampaigns = [
  { id: "ST-C001", name: "Luxury Villa Launch — Goa", status: "Active", platform: "Meta + Google", spend: "₹3,20,000", budget: "₹5,00,000", leads: 342, conversions: 28, roi: "7.1x", startDate: "Jan 15, 2026", progress: 64 },
  { id: "ST-C002", name: "Enterprise SaaS — Pune", status: "Active", platform: "LinkedIn + Google", spend: "₹2,85,000", budget: "₹4,00,000", leads: 289, conversions: 19, roi: "5.8x", startDate: "Feb 1, 2026", progress: 71 },
  { id: "ST-C003", name: "Ultra-Luxury Watches", status: "Paused", platform: "Instagram + YouTube", spend: "₹1,95,000", budget: "₹3,50,000", leads: 156, conversions: 12, roi: "4.2x", startDate: "Dec 10, 2025", progress: 56 },
  { id: "ST-C004", name: "Experiential Resort — Kerala", status: "Active", platform: "Meta + Native", spend: "₹2,10,000", budget: "₹3,00,000", leads: 198, conversions: 15, roi: "6.5x", startDate: "Feb 20, 2026", progress: 70 },
  { id: "ST-C005", name: "Fintech Premium Cards", status: "Completed", platform: "Google + Programmatic", spend: "₹4,50,000", budget: "₹4,50,000", leads: 512, conversions: 41, roi: "8.3x", startDate: "Oct 5, 2025", progress: 100 },
  { id: "ST-C006", name: "Boutique Hotel Chain — Rajasthan", status: "Review", platform: "Meta", spend: "₹0", budget: "₹2,50,000", leads: 0, conversions: 0, roi: "—", startDate: "Pending", progress: 0 },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = { Active: { bg: "rgba(34,197,94,0.15)", text: "#22c55e" }, Paused: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" }, Review: { bg: "rgba(99,102,241,0.15)", text: "#818cf8" }, Completed: { bg: "rgba(255,255,255,0.08)", text: textSec } };
  const c = colors[status] || colors.Completed;
  return <span style={{ padding: "3px 10px", borderRadius: 20, background: c.bg, color: c.text, fontSize: 11, fontWeight: 500 }}>{status}</span>;
}

function FormField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
    </div>
  );
}

export default function CampaignsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [allCampaigns, setAllCampaigns] = useState(initialCampaigns);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<typeof initialCampaigns[0] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [newCamp, setNewCamp] = useState({ name: "", platform: "", budget: "" });

  const filters = ["All", "Active", "Paused", "Review", "Completed"];
  const filtered = allCampaigns
    .filter(c => filter === "All" || c.status === filter)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.platform.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = () => {
    if (!newCamp.name) { setToast("Campaign name is required"); return; }
    const id = `ST-C${String(allCampaigns.length + 1).padStart(3, "0")}`;
    setAllCampaigns(prev => [...prev, { id, name: newCamp.name, status: "Review", platform: newCamp.platform || "TBD", spend: "₹0", budget: newCamp.budget || "₹0", leads: 0, conversions: 0, roi: "—", startDate: "Pending", progress: 0 }]);
    setShowNewModal(false);
    setNewCamp({ name: "", platform: "", budget: "" });
    setToast(`Campaign "${newCamp.name}" created successfully`);
  };

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* New Campaign Modal */}
      {showNewModal && (
        <Modal title="Create New Campaign" onClose={() => setShowNewModal(false)}>
          <FormField label="Campaign Name" value={newCamp.name} onChange={v => setNewCamp(p => ({ ...p, name: v }))} placeholder="e.g. Luxury Villa Launch — Mumbai" />
          <FormField label="Platform" value={newCamp.platform} onChange={v => setNewCamp(p => ({ ...p, platform: v }))} placeholder="e.g. Meta + Google" />
          <FormField label="Budget" value={newCamp.budget} onChange={v => setNewCamp(p => ({ ...p, budget: v }))} placeholder="e.g. ₹5,00,000" />
          <button onClick={handleCreate} style={{ width: "100%", padding: "12px", background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#000", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>Create Campaign</button>
        </Modal>
      )}

      {/* Detail Modal */}
      {selectedCampaign && (
        <Modal title={selectedCampaign.name} onClose={() => setSelectedCampaign(null)}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}><StatusBadge status={selectedCampaign.status} /><span style={{ fontSize: 11, color: textMuted, padding: "3px 10px", borderRadius: 20, border: `1px solid ${border}` }}>{selectedCampaign.platform}</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {[{ label: "Mandate ID", val: selectedCampaign.id }, { label: "Start Date", val: selectedCampaign.startDate }, { label: "Budget", val: selectedCampaign.budget }, { label: "Spent", val: selectedCampaign.spend }].map((m, i) => (
              <div key={i}><div style={{ fontSize: 11, color: textMuted, marginBottom: 4 }}>{m.label}</div><div style={{ fontSize: 14, color: "#fff" }}>{m.val}</div></div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[{ label: "Leads", val: selectedCampaign.leads }, { label: "Conversions", val: selectedCampaign.conversions }, { label: "ROI", val: selectedCampaign.roi }].map((m, i) => (
              <div key={i} style={{ textAlign: "center", padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 300, color: i === 2 ? gold : "#fff" }}>{m.val}</div>
                <div style={{ fontSize: 11, color: textMuted, marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 11, color: textMuted }}>Budget Utilization</span><span style={{ fontSize: 11, color: textSec }}>{selectedCampaign.progress}%</span></div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}><div style={{ height: "100%", width: `${selectedCampaign.progress}%`, background: `linear-gradient(to right, ${gold}, ${goldLight})`, borderRadius: 3 }} /></div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setSelectedCampaign(null); setToast(`Campaign ${selectedCampaign.id} paused`); }}
              style={{ flex: 1, padding: "10px", background: "rgba(245,158,11,0.1)", border: `1px solid rgba(245,158,11,0.3)`, borderRadius: 8, color: "#f59e0b", fontSize: 12, cursor: "pointer" }}>Pause</button>
            <button onClick={() => { setSelectedCampaign(null); setToast(`Exporting ${selectedCampaign.id} report...`); }}
              style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${gold}, ${goldLight})`, border: "none", borderRadius: 8, color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Export Report</button>
          </div>
        </Modal>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 300, color: "#fff", margin: 0 }}>Campaigns</h1>
          <p style={{ fontSize: 13, color: textMuted, marginTop: 4 }}>{allCampaigns.length} total campaigns across all mandates</p>
        </div>
        <button onClick={() => setShowNewModal(true)} style={{ padding: "10px 20px", background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#000", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>+</span> New Campaign
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns by name or platform..."
          style={{ width: "100%", maxWidth: 400, padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: surface, borderRadius: 8, padding: 4, border: `1px solid ${border}`, width: "fit-content" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: filter === f ? "rgba(212,175,55,0.15)" : "transparent", color: filter === f ? gold : textSec, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
            {f} {f !== "All" && <span style={{ marginLeft: 4, opacity: 0.5 }}>({allCampaigns.filter(c => c.status === f).length})</span>}
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: textMuted }}><div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>No campaigns found matching your search.</div>
      ) : (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelectedCampaign(c)}
            style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24, cursor: "pointer", transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = border)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div><div style={{ fontSize: 11, color: textMuted, marginBottom: 4 }}>{c.id}</div><div style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>{c.name}</div><div style={{ fontSize: 11, color: textMuted, marginTop: 4 }}>{c.platform}</div></div>
              <StatusBadge status={c.status} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 11, color: textMuted }}>Budget Utilization</span><span style={{ fontSize: 11, color: textSec }}>{c.progress}%</span></div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}><div style={{ height: "100%", width: `${c.progress}%`, background: c.progress === 100 ? "rgba(255,255,255,0.2)" : `linear-gradient(to right, ${gold}, ${goldLight})`, borderRadius: 2, transition: "width 0.5s" }} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[{ label: "Leads", val: c.leads }, { label: "Conversions", val: c.conversions }, { label: "ROI", val: c.roi }].map((m, i) => (
                <div key={i} style={{ textAlign: "center", padding: "8px 0", background: "rgba(255,255,255,0.02)", borderRadius: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 400, color: i === 2 ? gold : "#fff" }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: textMuted, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
