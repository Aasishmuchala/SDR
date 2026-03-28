"use client";
import { useState, useRef, useEffect } from "react";

const gold = "#D4AF37";
const goldLight = "#F3E5AB";
const border = "rgba(255,255,255,0.08)";
const surface = "rgba(255,255,255,0.03)";
const textSec = "rgba(255,255,255,0.55)";
const textMuted = "rgba(255,255,255,0.35)";

type Msg = { from: string; text: string; time: string; isMe: boolean; attachment?: string };
type Thread = { id: number; name: string; avatar: string; lastMsg: string; time: string; unread: number };

const initThreads: Thread[] = [
  { id: 1, name: "Acquisition Team", avatar: "AT", lastMsg: "The Villa campaign creatives are ready for review.", time: "2h ago", unread: 2 },
  { id: 2, name: "Rohan — Strategy Lead", avatar: "RS", lastMsg: "Updated the targeting parameters for Pune.", time: "5h ago", unread: 0 },
  { id: 3, name: "Finance & Billing", avatar: "FB", lastMsg: "Invoice #ST-INV-0042-03 has been generated.", time: "1d ago", unread: 1 },
  { id: 4, name: "Creative Studio", avatar: "CS", lastMsg: "UE5 render for the resort campaign is rendering.", time: "2d ago", unread: 0 },
];

const initMessages: Record<number, Msg[]> = {
  1: [
    { from: "Acquisition Team", text: "Good morning! We have completed the initial analysis for the Villa campaign. The ICP targeting looks strong — 2.3x higher intent signals than industry average.", time: "10:30 AM", isMe: false },
    { from: "You", text: "Great work. What about the creative direction? I want the UE5 renders to really capture the ocean-view experience.", time: "10:45 AM", isMe: true },
    { from: "Acquisition Team", text: "The creative team has prepared 3 hero concepts. We are rendering the final versions in UE5 now — expect delivery by EOD tomorrow.", time: "11:02 AM", isMe: false },
    { from: "You", text: "Perfect. Also ensure the landing page funnel has the urgency elements we discussed — limited inventory positioning.", time: "11:15 AM", isMe: true },
    { from: "Acquisition Team", text: "Already integrated. The funnel includes real-time availability counter, social proof notifications, and a 48-hour exclusive access window. The Villa campaign creatives are ready for review.", time: "11:30 AM", isMe: false },
  ],
  2: [
    { from: "Rohan", text: "I have narrowed down the SaaS audience to CTOs and VPs of Engineering at Series B+ companies in Pune/Mumbai.", time: "9:00 AM", isMe: false },
    { from: "You", text: "Good. Add decision-making budget holders — CFOs with tech background.", time: "9:20 AM", isMe: true },
    { from: "Rohan", text: "Updated the targeting parameters for Pune. New estimated reach: 14,200 qualified professionals.", time: "9:45 AM", isMe: false },
  ],
  3: [
    { from: "Finance", text: "Invoice #ST-INV-0042-03 has been generated for the March cycle. Amount: ₹2,15,000.", time: "Yesterday", isMe: false },
  ],
  4: [
    { from: "Creative Studio", text: "The UE5 scene for Kerala resort is 60% complete. Lighting pass coming next.", time: "2 days ago", isMe: false },
    { from: "You", text: "Make sure we capture golden hour lighting. That is the signature look.", time: "2 days ago", isMe: true },
    { from: "Creative Studio", text: "UE5 render for the resort campaign is rendering. Will have preview frames by tomorrow.", time: "2 days ago", isMe: false },
  ],
};

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999, padding: "12px 20px", background: "rgba(212,175,55,0.15)", border: `1px solid rgba(212,175,55,0.2)`, borderRadius: 10, color: gold, fontSize: 13, backdropFilter: "blur(12px)" }}>{message}</div>;
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>(initThreads);
  const [activeThread, setActiveThread] = useState(1);
  const [messages, setMessages] = useState<Record<number, Msg[]>>(initMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadName, setNewThreadName] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const currentMessages = messages[activeThread] || [];
  const activeInfo = threads.find(t => t.id === activeThread);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeThread, currentMessages.length]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setMessages(prev => ({ ...prev, [activeThread]: [...(prev[activeThread] || []), { from: "You", text: input, time: timeStr, isMe: true }] }));
    setThreads(prev => prev.map(t => t.id === activeThread ? { ...t, lastMsg: input, time: "Just now" } : t));
    setInput("");
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setMessages(prev => ({ ...prev, [activeThread]: [...(prev[activeThread] || []), { from: "You", text: `📎 ${file.name}`, time: timeStr, isMe: true, attachment: file.name }] }));
    setThreads(prev => prev.map(t => t.id === activeThread ? { ...t, lastMsg: `📎 ${file.name}`, time: "Just now" } : t));
    setToast(`Attached: ${file.name}`);
    e.target.value = "";
  };

  const createThread = () => {
    if (!newThreadName.trim()) return;
    const newId = Math.max(...threads.map(t => t.id)) + 1;
    const initials = newThreadName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    setThreads(prev => [{ id: newId, name: newThreadName.trim(), avatar: initials, lastMsg: "New conversation", time: "Now", unread: 0 }, ...prev]);
    setMessages(prev => ({ ...prev, [newId]: [] }));
    setActiveThread(newId);
    setNewThreadName("");
    setShowNewThread(false);
    setToast(`Thread "${newThreadName.trim()}" created`);
  };

  const filteredThreads = threads.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.lastMsg.toLowerCase().includes(search.toLowerCase()));
  const highlightedMessages = chatSearch ? currentMessages.map((m, i) => ({ ...m, _highlight: m.text.toLowerCase().includes(chatSearch.toLowerCase()), _idx: i })) : currentMessages.map((m, i) => ({ ...m, _highlight: false, _idx: i }));
  const matchCount = highlightedMessages.filter(m => m._highlight).length;

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <input type="file" ref={fileRef} onChange={handleAttachment} style={{ display: "none" }} />

      {/* New Thread Modal */}
      {showNewThread && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowNewThread(false)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", background: "#111", border: `1px solid ${border}`, borderRadius: 16, padding: 32, width: "90%", maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 400, color: "#fff", margin: 0 }}>New Thread</h2>
              <button onClick={() => setShowNewThread(false)} style={{ background: "none", border: "none", color: textMuted, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <label style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Thread Name</label>
            <input value={newThreadName} onChange={e => setNewThreadName(e.target.value)} onKeyDown={e => e.key === "Enter" && createThread()}
              placeholder="e.g. Design Review, Legal Team..."
              style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", marginBottom: 20 }} />
            <button onClick={createThread} style={{ width: "100%", padding: 12, background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#000", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create Thread</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 300, color: "#fff", margin: 0 }}>Messages</h1>
        <button onClick={() => setShowNewThread(true)} style={{ padding: "8px 16px", background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#000", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>+</span> New Thread
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", height: "calc(100vh - 180px)", border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden" }}>
        {/* Thread List */}
        <div style={{ background: surface, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8 }}>
              <svg width="14" height="14" fill="none" stroke={textMuted} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threads..." style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: 12, outline: "none" }} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: textMuted, cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredThreads.length === 0 && <div style={{ padding: 24, textAlign: "center", color: textMuted, fontSize: 12 }}>No threads found</div>}
            {filteredThreads.map(t => (
              <div key={t.id} onClick={() => { setActiveThread(t.id); setThreads(prev => prev.map(th => th.id === t.id ? { ...th, unread: 0 } : th)); }}
                style={{ padding: "16px 20px", cursor: "pointer", borderBottom: `1px solid ${border}`, background: activeThread === t.id ? "rgba(212,175,55,0.06)" : "transparent", borderLeft: activeThread === t.id ? `2px solid ${gold}` : "2px solid transparent", transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: activeThread === t.id ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: activeThread === t.id ? gold : textSec, flexShrink: 0 }}>{t.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{t.name}</span>
                      <span style={{ fontSize: 10, color: textMuted }}>{t.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: textMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{t.lastMsg}</div>
                  </div>
                  {t.unread > 0 && <div style={{ width: 18, height: 18, borderRadius: "50%", background: gold, color: "#000", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t.unread}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ display: "flex", flexDirection: "column", background: "#000" }}>
          {/* Chat Header */}
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(212,175,55,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: gold }}>{activeInfo?.avatar}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{activeInfo?.name}</div>
                <div style={{ fontSize: 11, color: "#22c55e", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} /> Online</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {showChatSearch && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8 }}>
                  <input value={chatSearch} onChange={e => setChatSearch(e.target.value)} placeholder="Search in chat..." autoFocus
                    style={{ background: "none", border: "none", color: "#fff", fontSize: 12, outline: "none", width: 140 }} />
                  {chatSearch && <span style={{ fontSize: 10, color: textMuted }}>{matchCount} found</span>}
                  <button onClick={() => { setChatSearch(""); setShowChatSearch(false); }} style={{ background: "none", border: "none", color: textMuted, cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
                </div>
              )}
              <button onClick={() => setShowChatSearch(!showChatSearch)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="18" height="18" fill="none" stroke={showChatSearch ? gold : textMuted} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {currentMessages.length === 0 && <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: textMuted, fontSize: 13 }}>No messages yet. Start the conversation!</div>}
            {highlightedMessages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.isMe ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "70%", padding: "12px 16px", borderRadius: m.isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m._highlight ? "rgba(212,175,55,0.25)" : m.isMe ? "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${m._highlight ? "rgba(212,175,55,0.5)" : m.isMe ? "rgba(212,175,55,0.2)" : border}` }}>
                  {m.attachment && <div style={{ fontSize: 11, color: gold, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="12" height="12" fill="none" stroke={gold} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                    Attachment
                  </div>}
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>{m.text}</div>
                  <div style={{ fontSize: 10, color: textMuted, marginTop: 6, textAlign: m.isMe ? "right" as const : "left" as const }}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${border}`, display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={() => fileRef.current?.click()} style={{ width: 36, height: 36, borderRadius: 8, background: surface, border: `1px solid ${border}`, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
            </button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..." style={{ flex: 1, padding: "10px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
            <button onClick={sendMessage} style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${gold}, ${goldLight})`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
