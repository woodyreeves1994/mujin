"use client";

import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// Mujin v2 — Block & Numerals
//
// Design direction: cream paper canvas, big bold numerals where
// money lives, block colour zoning (navy = trust, lime = money,
// coral = energy, butter = community), Archivo Black display
// with Inter body. High contrast, accessible, intentionally fun.
// Animations only when they confirm action.
// ─────────────────────────────────────────────────────────────

const COL = {
  cream: "#F5F2EA",
  paper: "#FBF9F2",
  ink: "#0F0F0F",
  inkSoft: "rgba(15,15,15,0.62)",
  inkMuted: "rgba(15,15,15,0.4)",
  border: "rgba(15,15,15,0.08)",
  navy: "#1B2BE5",
  navyDeep: "#0F1AAF",
  lime: "#D2F032",
  coral: "#FF4D6D",
  butter: "#FFD93D",
  white: "#FFFFFF",
};

const F = {
  display: {
    fontFamily: "'Archivo Black', system-ui, sans-serif",
    fontWeight: 900,
  },
  body: {
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  mono: {
    fontFamily: "'JetBrains Mono', monospace",
  },
};

function Ticker({ value, format = (v) => v.toLocaleString() }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 900;
    const animate = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return format(v);
}

function ChipPill({ children, color = COL.ink, bg = "transparent", border }) {
  return (
    <span
      style={{
        ...F.body,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        background: bg,
        color,
        border: border ? `1.5px solid ${border}` : "none",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </span>
  );
}

function ColorBtn({ children, onClick, bg = COL.lime, fg = COL.ink, size = "md", icon }) {
  const ref = useRef(null);
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("background-color", bg, "important");
    ref.current.style.setProperty("color", fg, "important");
  });
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => {
        setH(false);
        setP(false);
      }}
      onMouseDown={() => setP(true)}
      onMouseUp={() => setP(false)}
      style={{
        ...F.body,
        padding: size === "lg" ? "18px 28px" : size === "sm" ? "8px 14px" : "12px 20px",
        border: "none",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: size === "lg" ? 16 : size === "sm" ? 12 : 14,
        cursor: "pointer",
        transform: p ? "scale(0.97)" : h ? "translateY(-2px)" : "translateY(0)",
        transition: "transform .15s cubic-bezier(.2,.7,.2,1), box-shadow .15s",
        boxShadow: h ? "0 8px 24px rgba(15,15,15,0.15)" : "0 2px 8px rgba(15,15,15,0.06)",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick, icon }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        ...F.body,
        padding: "12px 20px",
        background: h ? COL.ink : "transparent",
        color: h ? COL.cream : COL.ink,
        border: `1.5px solid ${COL.ink}`,
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        transition: "all .15s",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

function PoolDetailV2() {
  const [poolTotal, setPoolTotal] = useState(450);
  const [tab, setTab] = useState("activity");
  const [coinShower, setCoinShower] = useState([]);
  const [contributing, setContributing] = useState(false);
  const [contribAmount, setContribAmount] = useState(50);
  const [lastAdd, setLastAdd] = useState(null);

  const target = 1200;
  const pct = Math.min(100, (poolTotal / target) * 100);

  const handleContribute = () => {
    setPoolTotal((p) => p + contribAmount);
    setLastAdd(contribAmount);
    const newCoins = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: i * 0.04,
      dur: 1.2 + Math.random() * 0.6,
    }));
    setCoinShower((c) => [...c, ...newCoins]);
    setContributing(false);
    setTimeout(() => setCoinShower([]), 2400);
    setTimeout(() => setLastAdd(null), 2400);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COL.cream,
        color: COL.ink,
        ...F.body,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes blockFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes coinFall {
          0% { opacity: 0; transform: translateY(-20vh) rotate(0); }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { opacity: 0; transform: translateY(110vh) rotate(720deg); }
        }
        @keyframes barFill {
          from { width: 0; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        @keyframes floatPop {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          20% { opacity: 1; transform: translateY(-10px) scale(1); }
          80% { opacity: 1; transform: translateY(-60px) scale(1); }
          100% { opacity: 0; transform: translateY(-90px) scale(0.9); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0); }
          to { transform: rotate(360deg); }
        }
        .v2-fade { animation: blockFadeUp .55s cubic-bezier(.2,.7,.2,1) both; }
        .v2-bar { animation: barFill 1.1s cubic-bezier(.2,.7,.2,1) both; }
        .v2-wiggle:hover { animation: wiggle .4s ease-in-out; }
        button { appearance: none; -webkit-appearance: none; font-family: inherit; }
        body { background: ${COL.cream}; margin: 0; }
        ::selection { background: ${COL.lime}; color: ${COL.ink}; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px 80px" }}>
        {/* TOP STRIP */}
        <div className="v2-fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              style={{
                background: "transparent",
                border: "none",
                color: COL.ink,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                padding: "8px 0",
                display: "flex",
                alignItems: "center",
                gap: 8,
                ...F.body,
              }}
            >
              ← <span style={{ color: COL.inkSoft }}>back to pools</span>
            </button>
            <span style={{ color: COL.inkMuted, fontSize: 14 }}>/</span>
            <div style={{ ...F.mono, fontSize: 12, color: COL.inkSoft, letterSpacing: "0.05em" }}>
              pool · #summer-trip-26
            </div>
          </div>
          <OutlineBtn icon="⚔">Start a duel</OutlineBtn>
        </div>

        {/* HERO BLOCK */}
        <div
          className="v2-fade"
          style={{
            animationDelay: "0.05s",
            background: COL.navy,
            color: COL.white,
            borderRadius: 36,
            padding: "44px 44px 36px",
            marginBottom: 14,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative shapes top right */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -30,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: COL.lime,
              opacity: 0.95,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 50,
              right: 80,
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: COL.coral,
              animation: "spinSlow 18s linear infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 28,
              right: 200,
              width: 32,
              height: 32,
              background: COL.butter,
              transform: "rotate(18deg)",
              borderRadius: 4,
            }}
          />

          {/* Ed. annotation - top right corner */}
          <div
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              padding: "6px 12px",
              border: `1.5px solid rgba(255,255,255,0.4)`,
              borderRadius: 999,
              ...F.mono,
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.8)",
              zIndex: 1,
            }}
          >
            ED. 03
          </div>

          {/* Status pills */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            <ChipPill bg="rgba(210,240,50,0.18)" color={COL.lime} border="rgba(210,240,50,0.5)">
              ● ACTIVE POOL
            </ChipPill>
            <ChipPill bg="rgba(255,255,255,0.1)" color="rgba(255,255,255,0.9)" border="rgba(255,255,255,0.2)">
              PUBLIC
            </ChipPill>
            <ChipPill bg="rgba(255,255,255,0.1)" color="rgba(255,255,255,0.9)" border="rgba(255,255,255,0.2)">
              3 MEMBERS
            </ChipPill>
          </div>

          <h1
            style={{
              ...F.display,
              fontSize: 96,
              margin: 0,
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              maxWidth: 720,
            }}
          >
            Summer Trip '26
          </h1>

          <div style={{ marginTop: 38, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div
                style={{
                  ...F.body,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 700,
                  marginBottom: 8,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Total pooled
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, position: "relative" }}>
                <span style={{ ...F.display, fontSize: 110, color: COL.lime, lineHeight: 1, letterSpacing: "-0.04em" }}>
                  <Ticker value={poolTotal} />
                </span>
                <span style={{ ...F.display, fontSize: 28, color: "rgba(255,255,255,0.55)" }}>
                  / {target.toLocaleString()} SUI
                </span>
                {lastAdd && (
                  <span
                    style={{
                      position: "absolute",
                      top: -10,
                      left: 0,
                      ...F.display,
                      fontSize: 26,
                      color: COL.lime,
                      animation: "floatPop 2s ease-out forwards",
                    }}
                  >
                    +{lastAdd}
                  </span>
                )}
              </div>
            </div>

            <div style={{ minWidth: 200 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ ...F.body, fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Progress
                </span>
                <span style={{ ...F.display, fontSize: 22, color: COL.lime }}>{Math.round(pct)}%</span>
              </div>
              <div style={{ height: 14, background: "rgba(255,255,255,0.15)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  className="v2-bar"
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: COL.lime,
                    borderRadius: 999,
                    transition: "width 1s cubic-bezier(.2,.7,.2,1)",
                    boxShadow: `0 0 20px ${COL.lime}80`,
                  }}
                />
              </div>
              <div style={{ ...F.body, marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                {target - poolTotal} SUI to go
              </div>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 14 }}>
          {[
            {
              color: COL.butter,
              eyebrow: "MEMBERS",
              big: "3",
              sub: "you, alex, jordan",
              icon: "👥",
              delay: 0.1,
            },
            {
              color: COL.coral,
              eyebrow: "DEADLINE",
              big: "14d",
              sub: "14 May 2026",
              icon: "⏱",
              delay: 0.15,
            },
            {
              color: COL.paper,
              eyebrow: "THIS WEEK",
              big: "+90",
              sub: "SUI added",
              icon: "↗",
              delay: 0.2,
              dark: true,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="v2-fade v2-wiggle"
              style={{
                animationDelay: `${s.delay}s`,
                background: s.color,
                borderRadius: 28,
                padding: 26,
                minHeight: 170,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: s.dark ? `1px solid ${COL.border}` : "none",
                cursor: "default",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ ...F.body, fontSize: 10, letterSpacing: "0.2em", color: COL.ink, fontWeight: 800 }}>
                  {s.eyebrow}
                </span>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
              </div>
              <div>
                <div style={{ ...F.display, fontSize: 64, color: COL.ink, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                  {s.big}
                </div>
                <div style={{ ...F.body, fontSize: 13, color: COL.inkSoft, marginTop: 10, fontWeight: 500 }}>
                  {s.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ACTION CARD */}
        <div
          className="v2-fade"
          style={{
            animationDelay: "0.25s",
            background: COL.lime,
            borderRadius: 32,
            padding: "32px 36px",
            marginBottom: 14,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ ...F.body, fontSize: 11, letterSpacing: "0.22em", fontWeight: 800, color: COL.ink, marginBottom: 8, textTransform: "uppercase" }}>
                Throw in
              </div>
              <h2 style={{ ...F.display, fontSize: 44, color: COL.ink, margin: 0, lineHeight: 1, letterSpacing: "-0.025em" }}>
                {contributing ? "How much?" : "Add to the pot"}
              </h2>
              {!contributing && (
                <div style={{ ...F.body, fontSize: 13, color: COL.ink, opacity: 0.7, marginTop: 8, fontWeight: 500 }}>
                  Mujin takes 1% · Gas ~0.002 SUI
                </div>
              )}
            </div>

            {!contributing ? (
              <ColorBtn bg={COL.ink} fg={COL.lime} size="lg" onClick={() => setContributing(true)} icon="+">
                Contribute SUI →
              </ColorBtn>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                {[25, 50, 100, 250].map((v) => {
                  const active = contribAmount === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setContribAmount(v)}
                      style={{
                        ...F.body,
                        padding: "12px 18px",
                        background: active ? COL.ink : "transparent",
                        color: active ? COL.lime : COL.ink,
                        border: `1.5px solid ${COL.ink}`,
                        borderRadius: 999,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                        transition: "all .12s",
                      }}
                    >
                      {v} SUI
                    </button>
                  );
                })}
                <ColorBtn bg={COL.ink} fg={COL.lime} onClick={handleContribute} icon="✓">
                  Send {contribAmount} SUI
                </ColorBtn>
                <button
                  onClick={() => setContributing(false)}
                  style={{
                    ...F.body,
                    background: "transparent",
                    border: "none",
                    color: COL.ink,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "8px 12px",
                    opacity: 0.6,
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* WHAT THIS IS */}
        <div
          className="v2-fade"
          style={{
            animationDelay: "0.3s",
            background: COL.paper,
            borderRadius: 24,
            padding: "22px 28px",
            marginBottom: 40,
            border: `1px solid ${COL.border}`,
          }}
        >
          <div style={{ ...F.body, fontSize: 11, letterSpacing: "0.2em", fontWeight: 800, color: COL.inkSoft, marginBottom: 8, textTransform: "uppercase" }}>
            What this is
          </div>
          <div style={{ ...F.body, fontSize: 15, color: COL.ink, lineHeight: 1.6 }}>
            Group savings for our annual summer trip. Funds release to{" "}
            <strong style={{ borderBottom: `2px solid ${COL.coral}` }}>Save the Children</strong> on the deadline.
            Use duels to wager fun amounts among members — winners contribute less, the pool still gets the full pot.
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 36, marginBottom: 22, borderBottom: `2px solid ${COL.border}` }}>
          {[
            ["activity", "Activity"],
            ["members", "Who's in"],
            ["receipts", "Receipts"],
          ].map(([id, label]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  ...F.display,
                  background: "transparent",
                  border: "none",
                  color: active ? COL.ink : COL.inkMuted,
                  fontSize: 22,
                  padding: "14px 0",
                  marginBottom: -2,
                  borderBottom: `4px solid ${active ? COL.coral : "transparent"}`,
                  cursor: "pointer",
                  letterSpacing: "-0.015em",
                  transition: "all .15s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <div key={tab} className="v2-fade">
          {tab === "activity" && (
            <div>
              {[
                {
                  who: "alex",
                  initial: "A",
                  color: COL.coral,
                  action: "won a duel",
                  detail: "Higher or Lower · 3 of 3 accepted",
                  amount: "+150",
                  time: "2 days ago",
                  win: true,
                },
                {
                  who: "maya",
                  initial: "M",
                  color: COL.butter,
                  action: "added to the pot",
                  detail: "instant transfer · 1% mujin fee",
                  amount: "+50",
                  time: "5 hours ago",
                },
                {
                  who: "you",
                  initial: "Y",
                  color: COL.lime,
                  action: "created the pool",
                  detail: "destination: Save the Children",
                  amount: "",
                  time: "2 days ago",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="v2-fade"
                  style={{
                    animationDelay: `${0.05 * i}s`,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "20px 26px",
                    background: COL.paper,
                    borderRadius: 24,
                    marginBottom: 10,
                    border: `1px solid ${COL.border}`,
                    transition: "transform .15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: row.color,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...F.display,
                      fontSize: 20,
                      color: COL.ink,
                      flexShrink: 0,
                    }}
                  >
                    {row.initial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...F.body, fontSize: 15, color: COL.ink, marginBottom: 2 }}>
                      <strong>{row.who}</strong> {row.action}
                      {row.win && (
                        <span
                          style={{
                            ...F.body,
                            fontSize: 9,
                            padding: "3px 8px",
                            background: COL.coral,
                            color: COL.ink,
                            borderRadius: 999,
                            fontWeight: 800,
                            letterSpacing: "0.18em",
                            marginLeft: 8,
                            verticalAlign: "middle",
                          }}
                        >
                          WIN
                        </span>
                      )}
                    </div>
                    <div style={{ ...F.body, fontSize: 12, color: COL.inkSoft }}>
                      {row.detail} · {row.time}
                    </div>
                  </div>
                  {row.amount && (
                    <div style={{ ...F.display, fontSize: 26, color: COL.ink, letterSpacing: "-0.02em" }}>
                      {row.amount}{" "}
                      <span style={{ ...F.body, fontSize: 11, color: COL.inkMuted, fontWeight: 600 }}>SUI</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "members" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { who: "You", initial: "Y", color: COL.lime, wallet: "0x89A...4fE1", tag: "OWNER", contribution: 180, pct: 40 },
                { who: "Alex", initial: "A", color: COL.coral, wallet: "0x12B...7cC2", contribution: 144, pct: 32 },
                { who: "Jordan", initial: "J", color: COL.butter, wallet: "0x88C...9dA3", contribution: 126, pct: 28 },
              ].map((m, i) => (
                <div
                  key={m.who}
                  className="v2-fade v2-wiggle"
                  style={{
                    animationDelay: `${0.05 * i}s`,
                    background: COL.paper,
                    borderRadius: 28,
                    padding: 26,
                    border: `1px solid ${COL.border}`,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      background: m.color,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...F.display,
                      fontSize: 34,
                      color: COL.ink,
                      margin: "0 auto 16px",
                    }}
                  >
                    {m.initial}
                  </div>
                  <div style={{ ...F.display, fontSize: 22, color: COL.ink, marginBottom: 6, letterSpacing: "-0.01em" }}>
                    {m.who}
                  </div>
                  {m.tag && (
                    <div
                      style={{
                        ...F.body,
                        display: "inline-block",
                        padding: "3px 10px",
                        background: COL.ink,
                        color: COL.lime,
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        fontWeight: 800,
                        borderRadius: 999,
                        marginBottom: 10,
                      }}
                    >
                      {m.tag}
                    </div>
                  )}
                  <div style={{ ...F.mono, fontSize: 11, color: COL.inkMuted, marginBottom: 18 }}>
                    {m.wallet}
                  </div>
                  <div style={{ ...F.display, fontSize: 36, color: COL.ink, letterSpacing: "-0.02em" }}>
                    {m.contribution}
                  </div>
                  <div style={{ ...F.body, fontSize: 11, color: COL.inkMuted, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase", marginTop: 2 }}>
                    SUI · {m.pct}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "receipts" && (
            <div
              style={{
                background: COL.paper,
                borderRadius: 28,
                padding: 32,
                border: `1px solid ${COL.border}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ ...F.body, fontSize: 11, letterSpacing: "0.22em", fontWeight: 800, color: COL.inkSoft, textTransform: "uppercase" }}>
                  Breakdown by contributor
                </div>
                <ChipPill bg={COL.ink} color={COL.lime}>
                  {poolTotal} SUI total
                </ChipPill>
              </div>
              {[
                { who: "You", pct: 40, amount: 180, color: COL.lime },
                { who: "Alex", pct: 32, amount: 144, color: COL.coral },
                { who: "Jordan", pct: 28, amount: 126, color: COL.butter },
              ].map((c, i) => (
                <div key={c.who} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <span style={{ ...F.display, fontSize: 20, color: COL.ink, letterSpacing: "-0.01em" }}>{c.who}</span>
                    <span>
                      <span style={{ ...F.display, fontSize: 26, color: COL.ink, letterSpacing: "-0.02em" }}>{c.amount}</span>
                      <span style={{ ...F.body, fontSize: 12, color: COL.inkMuted, fontWeight: 600, marginLeft: 6 }}>SUI · {c.pct}%</span>
                    </span>
                  </div>
                  <div style={{ height: 14, background: COL.cream, borderRadius: 999, overflow: "hidden" }}>
                    <div
                      className="v2-bar"
                      style={{
                        height: "100%",
                        width: `${c.pct}%`,
                        background: c.color,
                        borderRadius: 999,
                        transition: "width .9s cubic-bezier(.2,.7,.2,1)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER INFO */}
        <div
          style={{
            marginTop: 56,
            padding: "28px 0 0",
            borderTop: `2px solid ${COL.border}`,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 28,
            ...F.body,
            fontSize: 12,
          }}
        >
          {[
            { label: "POOL WALLET", value: "0x9c3A...b4f1", mono: true },
            { label: "DESTINATION", value: "Save the Children" },
            { label: "DEADLINE", value: "14 May 2026" },
            { label: "CREATED BY", value: "you · 2 days ago" },
          ].map((f) => (
            <div key={f.label}>
              <div
                style={{
                  ...F.body,
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  color: COL.inkMuted,
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                {f.label}
              </div>
              <div style={{ ...(f.mono ? F.mono : F.body), fontSize: 13, color: COL.ink, fontWeight: 600 }}>
                {f.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            ...F.mono,
            fontSize: 10,
            color: COL.inkMuted,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>Mujin v0.3 / sui mainnet</span>
          <span>● secure transfer · audited</span>
        </div>
      </div>

      {/* COIN SHOWER */}
      {coinShower.length > 0 && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, overflow: "hidden" }}>
          {coinShower.map((c) => (
            <div
              key={c.id}
              style={{
                position: "absolute",
                left: `${c.x}%`,
                top: 0,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: COL.lime,
                border: `2.5px solid ${COL.ink}`,
                animation: `coinFall ${c.dur}s cubic-bezier(.5,.1,.7,1) ${c.delay}s forwards`,
                boxShadow: `inset 0 0 0 4px ${COL.lime}, inset 0 0 0 5px ${COL.ink}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...F.display,
                fontSize: 11,
                color: COL.ink,
              }}
            >
              S
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MujinApp() {
  return <PoolDetailV2 />;
}
