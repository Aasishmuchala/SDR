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
  const bg = type === "success" ? "rgba(34,197,94,0.15)" : type === "error" ? "rgba(239,68,68,0.15)" : "rgba(212,175,55,0.15)";
  const col = type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : gold;
  return <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999, padding: "12px 20px", background: bg, border: `1px solid ${col}33`, borderRadius: 10, color: col, fontSize: 13, backdropFilter: "blur(12px)" }}>{message}</div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#111", border: `1px solid ${border}`, borderRadius: 16, padding: 32, width: "90%", maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 400, color: "#fff", margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: textMuted, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: on ? gold : "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
    </button>
  );
}

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [showSessions, setShowSessions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: "Aasish Muchala", email: "aasishmuchala@gmail.com", entity: "Sthyra Ventures Pvt. Ltd.", mandateId: "ST-M0042" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast({ msg: "Settings saved successfully ✓", type: "success" });
    }, 1200);
  };

  const handlePasswordUpdate = () => {
    if (!passwords.current) { setToast({ msg: "Current password is required", type: "error" }); return; }
    if (passwords.newPass.length < 8) { setToast({ msg: "New password must be at least 8 characters", type: "error" }); return; }
    if (passwords.newPass !== passwords.confirm) { setToast({ msg: "Passwords do not match", type: "error" }); return; }
    setShowPassword(false);
    setPasswords({ current: "", newPass: "", confirm: "" });
    setToast({ msg: "Password updated successfully", type: "success" });
  };

  const sessions = [
    { device: "MacBook Pro — Chrome", location: "Mumbai, India", time: "Active now", current: true },
    { device: "iPhone 15 Pro — Safari", location: "Mumbai, India", time: "2h ago", current: false },
    { device: "iPad Air — Safari", location: "Pune, India", time: "3 days ago", current: false },
  ];

  return (
    <div style={{ maxWidth: 720 }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sessions Modal */}
      {showSessions && (
        <Modal title="Active Sessions" onClose={() => setShowSessions(false)}>
          {sessions.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < sessions.length - 1 ? `1px solid ${border}` : "none" }}>
              <div>
                <div style={{ fontSize: 13, color: "#fff" }}>{s.device}</div>
                <div style={{ fontSize: 11, color: textMuted }}>{s.location} · {s.time}</div>
              </div>
              {s.current ? <span style={{ fontSize: 11, color: "#22c55e" }}>Current</span>
                : <button onClick={() => { setToast({ msg: `Session on ${s.device} revoked`, type: "success" }); setShowSessions(false); }}
                    style={{ padding: "4px 10px", background: "rgba(239,68,68,0.1)", border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 6, color: "#ef4444", fontSize: 11, cursor: "pointer" }}>Revoke</button>}
            </div>
          ))}
        </Modal>
      )}

      {/* Password Modal */}
      {showPassword && (
        <Modal title="Change Password" onClose={() => setShowPassword(false)}>
          {[{ label: "Current Password", key: "current" as const }, { label: "New Password", key: "newPass" as const }, { label: "Confirm New Password", key: "confirm" as const }].map((f) => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>{f.label}</label>
              <input type="password" value={passwords[f.key]} onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
            </div>
          ))}
          <button onClick={handlePasswordUpdate} style={{ width: "100%", padding: 12, background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#000", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Update Password</button>
        </Modal>
      )}

      <h1 style={{ fontSize: 24, fontWeight: 300, color: "#fff", margin: 0, marginBottom: 4 }}>Settings</h1>
      <p style={{ fontSize: 13, color: textMuted, marginBottom: 32 }}>Manage your account, notifications, and preferences.</p>

      {/* Profile */}
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: gold, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>Profile</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(212,175,55,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: gold, fontWeight: 300 }}>AM</div>
          <div>
            <div style={{ fontSize: 16, color: "#fff" }}>{profile.name}</div>
            <div style={{ fontSize: 12, color: textMuted }}>{profile.email}</div>
            <button onClick={() => setToast({ msg: "Avatar upload coming soon", type: "info" })} style={{ marginTop: 8, padding: "4px 12px", background: "transparent", border: `1px solid ${border}`, borderRadius: 6, color: textSec, fontSize: 11, cursor: "pointer" }}>Change Avatar</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[{ label: "Full Name", key: "name" as const }, { label: "Email", key: "email" as const }, { label: "Entity", key: "entity" as const }, { label: "Mandate ID", key: "mandateId" as const }].map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>{f.label}</label>
              <input value={profile[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: gold, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Notifications</div>
        {[{ label: "Email Notifications", desc: "Receive campaign updates and lead alerts via email", on: emailNotifs, toggle: () => setEmailNotifs(!emailNotifs) },
          { label: "SMS Alerts", desc: "Get critical notifications via SMS for high-priority leads", on: smsNotifs, toggle: () => setSmsNotifs(!smsNotifs) },
          { label: "Weekly Performance Report", desc: "Automated summary delivered every Monday at 9:00 AM IST", on: weeklyReport, toggle: () => setWeeklyReport(!weeklyReport) }
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: `1px solid ${border}` }}>
            <div><div style={{ fontSize: 14, color: "#fff" }}>{item.label}</div><div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{item.desc}</div></div>
            <Toggle on={item.on} onToggle={() => { item.toggle(); setToast({ msg: `${item.label} ${!item.on ? "enabled" : "disabled"}`, type: "info" }); }} />
          </div>
        ))}
      </div>

      {/* Security */}
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: gold, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>Security</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${border}` }}>
          <div><div style={{ fontSize: 14, color: "#fff" }}>Two-Factor Authentication</div><div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>Add an extra layer of security to your account</div></div>
          <Toggle on={twoFactor} onToggle={() => { setTwoFactor(!twoFactor); setToast({ msg: `2FA ${!twoFactor ? "enabled" : "disabled"}`, type: "success" }); }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${border}` }}>
          <div><div style={{ fontSize: 14, color: "#fff" }}>Active Sessions</div><div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>Manage devices where you are currently signed in</div></div>
          <button onClick={() => setShowSessions(true)} style={{ padding: "6px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: textSec, fontSize: 12, cursor: "pointer" }}>View Sessions</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
          <div><div style={{ fontSize: 14, color: "#fff" }}>Password</div><div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>Last changed 14 days ago</div></div>
          <button onClick={() => setShowPassword(true)} style={{ padding: "6px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: textSec, fontSize: 12, cursor: "pointer" }}>Update Password</button>
        </div>
      </div>

      {/* Billing */}
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: gold, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>Billing</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 14, color: "#fff" }}>Current Plan</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: gold, marginTop: 4 }}>Platinum Mandate</div>
            <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>Billed annually · Next invoice: April 15, 2026</div>
          </div>
          <div style={{ padding: "6px 14px", background: "rgba(212,175,55,0.1)", border: `1px solid rgba(212,175,55,0.2)`, borderRadius: 20, color: gold, fontSize: 11, fontWeight: 600 }}>ACTIVE</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[{ label: "Monthly Rate", value: "₹5,00,000" }, { label: "Total Billed YTD", value: "₹15,00,000" }, { label: "Next Payment", value: "Apr 15, 2026" }].map((m, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${border}`, borderRadius: 8, padding: 16, textAlign: "center" as const }}>
              <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginTop: 6 }}>{m.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button onClick={() => setToast({ msg: "Redirecting to billing portal…", type: "info" })} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: textSec, fontSize: 12, cursor: "pointer" }}>View Invoices</button>
          <button onClick={() => setToast({ msg: "Contact your Sthyra advisor to modify your plan", type: "info" })} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: textSec, fontSize: 12, cursor: "pointer" }}>Change Plan</button>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: "12px 32px", background: saving ? "rgba(212,175,55,0.3)" : `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: saving ? "default" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          {saving && <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
