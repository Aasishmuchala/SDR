"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

/* ── Mouse Position Hook ── */
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const update = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", update);
    return () => window.removeEventListener("mousemove", update);
  }, []);
  return { ...position, isClient };
}

/* ── Ambient Glow ── */
function AmbientGlow({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <motion.div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <motion.div
        animate={{ x: mouseX - 400, y: mouseY - 400 }}
        transition={{ type: "spring", damping: 25, stiffness: 120, mass: 0.5 }}
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(40,40,40,0.08) 50%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />
    </motion.div>
  );
}

/* ── Custom Cursor ── */
function CustomCursor({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <motion.div
      animate={{ x: mouseX - 6, y: mouseY - 6 }}
      transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.2 }}
      style={{ position: "fixed", zIndex: 9999, pointerEvents: "none", mixBlendMode: "difference" }}
    >
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff" }} />
    </motion.div>
  );
}

/* ── Scroll Reveal ── */
function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Glassmorphism Card ── */
function InfraCard({ title, description, index }: { title: string; description: string; index: number }) {
  const durations = [4, 5, 6];
  const delays = [0, 0.8, 1.6];
  return (
    <Reveal delay={index * 0.15}>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: durations[index], delay: delays[index], repeat: Infinity, ease: "easeInOut" }}
      >
        <div style={{
          position: "relative",
          overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          padding: "40px",
          transition: "all 0.5s ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)" }} />
          <span style={{ display: "block", color: "rgba(212,175,55,0.4)", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 24 }}>
            0{index + 1}
          </span>
          <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.3 }}>
            {title}
          </h3>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7, fontWeight: 300 }}>
            {description}
          </p>
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "75%", height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)", opacity: 0, transition: "opacity 0.5s ease" }} />
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ── Infinite Marquee ── */
function InfiniteMarquee() {
  const text = "EXPERIENTIAL REAL ESTATE  \u2014  ULTRA-LUXURY COMMERCE  \u2014  ENTERPRISE SAAS  \u2014  ";
  const repeated = text.repeat(4);
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap", padding: "80px 0" }}>
      <motion.div
        style={{ display: "inline-block" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" } }}
      >
        <span style={{
          fontSize: "clamp(60px, 10vw, 128px)",
          fontWeight: 200,
          letterSpacing: "-0.05em",
          textTransform: "uppercase",
          userSelect: "none",
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.12)",
        }}>
          {repeated}
        </span>
      </motion.div>
    </div>
  );
}

/* ── Form Input ── */
function FormInput({ label, placeholder }: { label: string; placeholder: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <label style={{ display: "block", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#4b5563", marginBottom: 12, fontWeight: 300 }}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${focused ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.15)"}`,
          paddingBottom: 12,
          color: "#fff",
          fontSize: 14,
          fontWeight: 300,
          outline: "none",
          transition: "all 0.3s ease",
        }}
      />
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: focused ? "100%" : "0%",
        height: 1,
        background: "linear-gradient(to right, #D4AF37, #F3E5AB)",
        transition: "width 0.5s ease",
      }} />
    </div>
  );
}

/* ── Checkbox ── */
function FormCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onChange}
        style={{
          marginTop: 2, flexShrink: 0, width: 16, height: 16, borderRadius: 2,
          border: `1px solid ${checked ? "#D4AF37" : "rgba(255,255,255,0.2)"}`,
          background: checked ? "#D4AF37" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s ease", cursor: "pointer",
        }}
      >
        {checked && <Check style={{ width: 12, height: 12, color: "#000" }} strokeWidth={3} />}
      </button>
      <span style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.6, fontWeight: 300 }}>{label}</span>
    </label>
  );
}

/* ════════════════════════════════════
   MAIN — STHYRA LANDING
   ════════════════════════════════════ */
export default function SthyraLanding() {
  const { x: mouseX, y: mouseY, isClient } = useMousePosition();
  const [acknowledged, setAcknowledged] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);
    return () => { document.body.style.cursor = "auto"; style.remove(); };
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!acknowledged) return;
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  }, [acknowledged]);

  const cards = [
    { title: "Precision Intent Capture", description: "Deploying algorithmic capital to intercept high-net-worth buyers at the exact inflection point of purchase intent." },
    { title: "Conversion Architecture", description: "Building frictionless digital environments mathematically structured to close \u2014 not persuade." },
    { title: "Cinematic Disruption", description: "Leveraging Unreal Engine 5 visual assets that command premium positioning and collapse decision timelines." },
  ];

  return (
    <div style={{ position: "relative", background: "#000", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      {isClient && (
        <>
          <AmbientGlow mouseX={mouseX} mouseY={mouseY} />
          <CustomCursor mouseX={mouseX} mouseY={mouseY} />
        </>
      )}

      {/* ── HERO ── */}
      <section style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
          style={{ position: "absolute", top: 32, left: 32 }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#4b5563", fontWeight: 300 }}>Sthyra</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
          style={{ position: "absolute", top: 32, right: 32 }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#4b5563", fontWeight: 300 }}>Acquisition Studio</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          style={{ position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)" }}
        >
          <a href="/dashboard" style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)", fontWeight: 400, textDecoration: "none", padding: "6px 16px", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 20, transition: "all 0.3s" }}>Client Portal</a>
        </motion.div>

        <div style={{ textAlign: "center", maxWidth: 900 }}>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 200, lineHeight: 1, letterSpacing: "-0.05em", color: "#fff" }}
          >
            ENGINEERED
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 200, lineHeight: 1, letterSpacing: "-0.05em", marginTop: 8,
              background: "linear-gradient(to right, #D4AF37, #F3E5AB, #D4AF37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ACQUISITION.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            style={{ marginTop: 40, color: "#9ca3af", fontSize: "clamp(14px, 1.5vw, 16px)", fontWeight: 300, letterSpacing: "0.02em", maxWidth: 520, margin: "40px auto 0", lineHeight: 1.7 }}
          >
            We do not run campaigns. We build high-ticket revenue infrastructure.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} style={{ marginTop: 80 }}>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)", margin: "0 auto" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── INFRASTRUCTURE ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "128px 24px", maxWidth: 1152, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)", marginBottom: 24, fontWeight: 300 }}>
            The Framework
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 200, lineHeight: 1.2, letterSpacing: "-0.03em", color: "#fff", maxWidth: 680, marginBottom: 80 }}>
            Marketing is a commodity.<br />
            <span style={{ color: "#6b7280" }}>Acquisition is an asset.</span>
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {cards.map((card, i) => (
            <InfraCard key={i} title={card.title} description={card.description} index={i} />
          ))}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <section style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <InfiniteMarquee />
      </section>

      {/* ── FORM ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "128px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)", marginBottom: 24, fontWeight: 300 }}>
              Application
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontSize: "clamp(30px, 5vw, 60px)", fontWeight: 200, lineHeight: 1, letterSpacing: "-0.03em", color: "#fff", marginBottom: 64 }}>
              Request a Mandate.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit}>
              <div style={{
                position: "relative",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 4,
                padding: "48px",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                  <FormInput label="Company Name" placeholder="Enter your entity name" />
                  <FormInput label="Current Cost of Acquisition (COA)" placeholder="₹0.00" />
                  <FormInput label="Estimated Asset Value" placeholder="₹0.00" />
                  <div style={{ paddingTop: 8 }}>
                    <FormCheckbox
                      checked={acknowledged}
                      onChange={() => setAcknowledged(!acknowledged)}
                      label="I acknowledge minimum engagement begins at ₹5,00,000."
                    />
                  </div>
                  <div style={{ paddingTop: 16 }}>
                    <AnimatePresence mode="wait">
                      {!formSubmitted ? (
                        <motion.button
                          key="submit"
                          type="submit"
                          disabled={!acknowledged}
                          whileHover={acknowledged ? { scale: 1.01 } : {}}
                          whileTap={acknowledged ? { scale: 0.99 } : {}}
                          style={{
                            width: "100%", padding: "16px 32px",
                            fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 300,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                            background: acknowledged ? "#fff" : "rgba(255,255,255,0.1)",
                            color: acknowledged ? "#000" : "#4b5563",
                            border: "1px solid transparent",
                            cursor: acknowledged ? "pointer" : "not-allowed",
                            transition: "all 0.3s ease",
                          }}
                        >
                          Submit Mandate
                          <ArrowRight style={{ width: 14, height: 14 }} />
                        </motion.button>
                      ) : (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          style={{
                            width: "100%", padding: "16px 32px",
                            fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 300,
                            color: "#D4AF37", textAlign: "center",
                            border: "1px solid rgba(212,175,55,0.2)",
                          }}
                        >
                          Mandate Received — Under Review
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <p style={{ marginTop: 32, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#374151", textAlign: "center", fontWeight: 300 }}>
                All mandates are subject to internal review.
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#374151", fontWeight: 300 }}>
            © {new Date().getFullYear()} Sthyra
          </span>
          <span style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#374151", fontWeight: 300 }}>
            Engineered in India
          </span>
        </div>
      </footer>

      {/* ── Noise overlay ── */}
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: 1,
          opacity: 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
