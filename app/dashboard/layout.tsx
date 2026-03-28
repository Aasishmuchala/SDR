"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const gold = "#D4AF37";
const goldLight = "#F3E5AB";
const surface = "rgba(255,255,255,0.03)";
const border = "rgba(255,255,255,0.08)";
const textMuted = "rgba(255,255,255,0.35)";
const textSec = "rgba(255,255,255,0.55)";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { href: "/dashboard/mandate", label: "Mandate", icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { href: "/dashboard/documents", label: "Documents", icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { href: "/dashboard/messages", label: "Messages", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { href: "/dashboard/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

const searchableItems = [
  { label: "Overview Dashboard", href: "/dashboard", category: "Page" },
  { label: "Campaigns", href: "/dashboard/campaigns", category: "Page" },
  { label: "Mandate ST-M0042", href: "/dashboard/mandate", category: "Mandate" },
  { label: "Documents", href: "/dashboard/documents", category: "Page" },
  { label: "Messages", href: "/dashboard/messages", category: "Page" },
  { label: "Settings", href: "/dashboard/settings", category: "Page" },
  { label: "Villa Horizon — Goa Campaign", href: "/dashboard/campaigns", category: "Campaign" },
  { label: "SaaS GTM — Pune Campaign", href: "/dashboard/campaigns", category: "Campaign" },
  { label: "Resort Branding — Kerala", href: "/dashboard/campaigns", category: "Campaign" },
  { label: "Brand Audit Report", href: "/dashboard/documents", category: "Document" },
  { label: "Monthly Report — March", href: "/dashboard/documents", category: "Document" },
  { label: "Acquisition Funnel v1", href: "/dashboard/documents", category: "Document" },
  { label: "Aasish Muchala", href: "/dashboard/settings", category: "Contact" },
];

const notifications = [
  { id: 1, text: "Villa Horizon campaign reached 500 leads", time: "2 hours ago", read: false },
  { id: 2, text: "Monthly Report — March is ready for review", time: "5 hours ago", read: false },
  { id: 3, text: "New message from Acquisition Team", time: "1 day ago", read: false },
  { id: 4, text: "Invoice #ST-INV-0042-03 generated", time: "1 day ago", read: true },
  { id: 5, text: "SaaS GTM campaign paused for optimization", time: "2 days ago", read: true },
];

function NavIcon({ d, active }: { d: string; active: boolean }) {
  return <svg width="20" height="20" fill="none" stroke={active ? gold : textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={d} /></svg>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const sideW = collapsed ? 72 : 240;
  const unreadCount = notifs.filter(n => !n.read).length;

  const searchResults = searchQuery.length > 0 ? searchableItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const markAllRead = () => { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); };
  const dismissNotif = (id: number) => { setNotifs(prev => prev.filter(n => n.id !== id)); };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000" }}>
      {/* Sidebar */}
      <aside style={{ width: sideW, flexShrink: 0, background: surface, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", transition: "width 0.3s ease", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: collapsed ? "24px 16px" : "24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setCollapsed(!collapsed)}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${gold}, ${goldLight})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#000", flexShrink: 0 }}>S</div>
          {!collapsed && <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.05em", color: "#fff" }}>STHYRA</span>}
        </div>
        <nav style={{ flex: 1, padding: "16px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 8, background: active ? "rgba(212,175,55,0.1)" : "transparent", color: active ? gold : textSec, fontSize: 13, fontWeight: active ? 500 : 400, letterSpacing: "0.02em", transition: "all 0.2s" }}>
                <NavIcon d={item.icon} active={active} />
                {!collapsed && item.label}
                {active && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: gold }} />}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: collapsed ? "16px" : "16px 20px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: textSec, flexShrink: 0 }}>AM</div>
          {!collapsed && <div><div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Aasish M.</div><div style={{ fontSize: 11, color: textMuted }}>Admin</div></div>}
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sideW, transition: "margin-left 0.3s ease" }}>
        <header style={{ height: 64, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: "rgba(0,0,0,0.6)", position: "sticky", top: 0, zIndex: 40 }}>
          {/* Search */}
          <div ref={searchRef} style={{ position: "relative" }}>
            <div style={{ position: "relative" }}>
              <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }} onFocus={() => searchQuery && setShowSearch(true)}
                placeholder="Search mandates, campaigns..." style={{ width: 300, padding: "8px 12px 8px 36px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
              <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" fill="none" stroke={textMuted} strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              {searchQuery && <button onClick={() => { setSearchQuery(""); setShowSearch(false); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: textMuted, cursor: "pointer", fontSize: 14 }}>✕</button>}
            </div>
            {showSearch && searchResults.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: 340, background: "#111", border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
                {searchResults.slice(0, 8).map((r, i) => (
                  <Link key={i} href={r.href} onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${border}`, textDecoration: "none", color: "#fff", fontSize: 13, transition: "background 0.1s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.06)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <span>{r.label}</span>
                    <span style={{ fontSize: 10, color: textMuted, padding: "2px 8px", background: "rgba(255,255,255,0.04)", borderRadius: 4 }}>{r.category}</span>
                  </Link>
                ))}
              </div>
            )}
            {showSearch && searchQuery && searchResults.length === 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: 340, background: "#111", border: `1px solid ${border}`, borderRadius: 12, padding: 24, textAlign: "center", color: textMuted, fontSize: 13 }}>No results found</div>
            )}
          </div>

          {/* Right side: Notifications + View Site */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div ref={notifRef} style={{ position: "relative" }}>
              <button onClick={() => setShowNotifs(!showNotifs)} style={{ position: "relative", cursor: "pointer", background: "none", border: "none", padding: 4 }}>
                <svg width="20" height="20" fill="none" stroke={showNotifs ? gold : textSec} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#ef4444", border: "2px solid #000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>{unreadCount}</div>}
              </button>
              {showNotifs && (
                <div style={{ position: "absolute", top: "calc(100% + 12px)", right: 0, width: 360, background: "#111", border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: `1px solid ${border}` }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Notifications</span>
                    {unreadCount > 0 && <button onClick={markAllRead} style={{ background: "none", border: "none", color: gold, fontSize: 11, cursor: "pointer" }}>Mark all read</button>}
                  </div>
                  {notifs.length === 0 && <div style={{ padding: 32, textAlign: "center", color: textMuted, fontSize: 13 }}>All caught up!</div>}
                  {notifs.map(n => (
                    <div key={n.id} style={{ display: "flex", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${border}`, background: n.read ? "transparent" : "rgba(212,175,55,0.03)" }}>
                      {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: gold, flexShrink: 0, marginTop: 6 }} />}
                      <div style={{ flex: 1, marginLeft: n.read ? 16 : 0 }}>
                        <div style={{ fontSize: 13, color: n.read ? textSec : "#fff", lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>{n.time}</div>
                      </div>
                      <button onClick={() => dismissNotif(n.id)} style={{ background: "none", border: "none", color: textMuted, cursor: "pointer", fontSize: 14, flexShrink: 0, padding: 0 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link href="/" style={{ fontSize: 12, color: textMuted, textDecoration: "none", padding: "6px 12px", border: `1px solid ${border}`, borderRadius: 6 }}>View Site</Link>
          </div>
        </header>
        <main style={{ padding: 32, minHeight: "calc(100vh - 64px)" }}>{children}</main>
      </div>
    </div>
  );
}
