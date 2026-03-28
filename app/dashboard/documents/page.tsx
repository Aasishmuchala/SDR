"use client";
import { useState, useEffect, useRef } from "react";

const gold = "#D4AF37";
const goldLight = "#F3E5AB";
const border = "rgba(255,255,255,0.08)";
const surface = "rgba(255,255,255,0.03)";
const textSec = "rgba(255,255,255,0.55)";
const textMuted = "rgba(255,255,255,0.35)";

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999, padding: "12px 20px", background: "rgba(212,175,55,0.15)", border: `1px solid rgba(212,175,55,0.3)`, borderRadius: 10, color: gold, fontSize: 13, backdropFilter: "blur(12px)" }}>{message}</div>;
}

const folders = [
  { name: "Contracts", count: 4, icon: "📄", color: "rgba(212,175,55,0.12)" },
  { name: "Reports", count: 8, icon: "📊", color: "rgba(59,130,246,0.12)" },
  { name: "Invoices", count: 6, icon: "💰", color: "rgba(34,197,94,0.12)" },
  { name: "Creatives", count: 12, icon: "🎨", color: "rgba(168,85,247,0.12)" },
];

const initialFiles = [
  { name: "Master Services Agreement.pdf", folder: "Contracts", size: "2.4 MB", date: "Jan 15, 2026", type: "PDF" },
  { name: "Mandate Engagement Letter.pdf", folder: "Contracts", size: "840 KB", date: "Jan 15, 2026", type: "PDF" },
  { name: "February Performance Report.pdf", folder: "Reports", size: "5.1 MB", date: "Mar 1, 2026", type: "PDF" },
  { name: "March Performance Report.pdf", folder: "Reports", size: "4.8 MB", date: "Mar 28, 2026", type: "PDF" },
  { name: "Invoice #ST-INV-0042-01.pdf", folder: "Invoices", size: "320 KB", date: "Jan 15, 2026", type: "PDF" },
  { name: "Invoice #ST-INV-0042-02.pdf", folder: "Invoices", size: "340 KB", date: "Feb 15, 2026", type: "PDF" },
  { name: "Brand Audit Presentation.pdf", folder: "Reports", size: "12.3 MB", date: "Jan 22, 2026", type: "PDF" },
  { name: "UE5 Hero Creative — Villa.mp4", folder: "Creatives", size: "245 MB", date: "Feb 10, 2026", type: "Video" },
  { name: "Acquisition Funnel Wireframes.fig", folder: "Creatives", size: "18 MB", date: "Feb 5, 2026", type: "Figma" },
  { name: "Social Ad Set — Batch 1.zip", folder: "Creatives", size: "67 MB", date: "Feb 12, 2026", type: "ZIP" },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  PDF: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" }, Video: { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" },
  Figma: { bg: "rgba(168,85,247,0.12)", text: "#a855f7" }, ZIP: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" },
  DOCX: { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" }, PNG: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
};

export default function DocumentsPage() {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState(initialFiles);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = files
    .filter(f => !activeFolder || f.folder === activeFolder)
    .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()));

  const handleUpload = (fileNames: string[]) => {
    const newFiles = fileNames.map(name => {
      const ext = name.split(".").pop()?.toUpperCase() || "PDF";
      return { name, folder: activeFolder || "Reports", size: `${(Math.random() * 10 + 0.5).toFixed(1)} MB`, date: "Mar 28, 2026", type: ext };
    });
    setFiles(prev => [...newFiles, ...prev]);
    setToast(`${fileNames.length} file${fileNames.length > 1 ? "s" : ""} uploaded successfully`);
  };

  const handleDelete = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
    setDeleteConfirm(null);
    setToast(`"${fileName}" deleted`);
  };

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <input ref={fileInputRef} type="file" multiple style={{ display: "none" }}
        onChange={e => { if (e.target.files) handleUpload(Array.from(e.target.files).map(f => f.name)); e.target.value = ""; }} />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setDeleteConfirm(null)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} />
          <div style={{ position: "relative", background: "#111", border: `1px solid ${border}`, borderRadius: 16, padding: 32, width: 400 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, color: "#fff", marginBottom: 8 }}>Delete file?</div>
            <div style={{ fontSize: 13, color: textSec, marginBottom: 20 }}>Are you sure you want to delete &quot;{deleteConfirm}&quot;? This action cannot be undone.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: 10, background: surface, border: `1px solid ${border}`, borderRadius: 8, color: textSec, fontSize: 12, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: 10, background: "rgba(239,68,68,0.15)", border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 8, color: "#ef4444", fontSize: 12, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 300, color: "#fff", margin: 0 }}>Documents</h1>
          <p style={{ fontSize: 13, color: textMuted, marginTop: 4 }}>{files.length} files across {folders.length} folders</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..."
            style={{ padding: "8px 12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 6, color: "#fff", fontSize: 12, outline: "none", width: 180 }} />
          {(["list", "grid"] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)} style={{ padding: "8px 12px", background: viewMode === v ? "rgba(212,175,55,0.15)" : surface, border: `1px solid ${border}`, borderRadius: 6, color: viewMode === v ? gold : textSec, fontSize: 12, cursor: "pointer" }}>
              {v === "list" ? "☰" : "⊞"}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleUpload(Array.from(e.dataTransfer.files).map(f => f.name)); }}
        style={{ border: `2px dashed ${dragOver ? gold : border}`, borderRadius: 12, padding: 32, textAlign: "center", marginBottom: 24, background: dragOver ? "rgba(212,175,55,0.05)" : "transparent", transition: "all 0.2s", cursor: "pointer" }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
        <div style={{ fontSize: 13, color: textSec }}>Drop files here or <span style={{ color: gold, textDecoration: "underline" }}>browse</span></div>
        <div style={{ fontSize: 11, color: textMuted, marginTop: 4 }}>PDF, DOCX, MP4, ZIP up to 500MB</div>
      </div>

      {/* Folders */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {folders.map(f => (
          <div key={f.name} onClick={() => setActiveFolder(activeFolder === f.name ? null : f.name)}
            style={{ background: activeFolder === f.name ? "rgba(212,175,55,0.08)" : surface, border: `1px solid ${activeFolder === f.name ? "rgba(212,175,55,0.3)" : border}`, borderRadius: 10, padding: 16, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{f.icon}</div>
            <div><div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{f.name}</div><div style={{ fontSize: 11, color: textMuted }}>{files.filter(fl => fl.folder === f.name).length} files</div></div>
          </div>
        ))}
      </div>
      {activeFolder && <div style={{ fontSize: 12, color: gold, marginBottom: 16, cursor: "pointer" }} onClick={() => setActiveFolder(null)}>← All files</div>}

      {/* File List / Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: textMuted }}><div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>No files found.</div>
      ) : (
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden" }}>
        {viewMode === "list" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: `1px solid ${border}` }}>
              {["File Name", "Type", "Size", "Date", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, color: textMuted, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((f, i) => {
                const tc = typeColors[f.type] || typeColors.PDF;
                return (
                  <tr key={i} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${border}` : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#fff" }}>{f.name}</td>
                    <td style={{ padding: "12px 16px" }}><span style={{ padding: "2px 8px", borderRadius: 4, background: tc.bg, color: tc.text, fontSize: 10, fontWeight: 600 }}>{f.type}</span></td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: textSec }}>{f.size}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: textMuted }}>{f.date}</td>
                    <td style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
                      <button onClick={() => setToast(`Downloading "${f.name}"...`)} style={{ background: "none", border: "none", cursor: "pointer", color: textMuted, padding: 4 }} title="Download">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      </button>
                      <button onClick={() => setDeleteConfirm(f.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.5)", padding: 4 }} title="Delete">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, padding: 16 }}>
            {filtered.map((f, i) => {
              const tc = typeColors[f.type] || typeColors.PDF;
              return (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${border}`, borderRadius: 10, padding: 16, cursor: "pointer", position: "relative" }}
                  onClick={() => setToast(`Opening "${f.name}"`)}>
                  <button onClick={e => { e.stopPropagation(); setDeleteConfirm(f.name); }} style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: "rgba(239,68,68,0.4)", cursor: "pointer", fontSize: 14 }}>✕</button>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: tc.text, marginBottom: 12 }}>{f.type}</div>
                  <div style={{ fontSize: 13, color: "#fff", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: textMuted }}>{f.size} · {f.date}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
