"use client";

import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// Mujin v2 — Block & Numerals (refined)
// Cream paper canvas + intentional block colour zoning,
// big confident numerals, contributor-segmented progress bar,
// asymmetric stats grid, grouped activity with action icons,
// donut chart for receipts, springy directional entrances.
// ─────────────────────────────────────────────────────────────

const COL = {
  cream: "#F5F2EA",
  paper: "#FBF9F2",
  paperHi: "#F0EBDE",
  ink: "#0F0F0F",
  inkSoft: "rgba(15,15,15,0.62)",
  inkMuted: "rgba(15,15,15,0.42)",
  inkFaint: "rgba(15,15,15,0.18)",
  border: "rgba(15,15,15,0.08)",
  navy: "#1B2BE5",
  navyDeep: "#0D1AB8",
  lime: "#D2F032",
  limeDeep: "#A8C81F",
  coral: "#FF4D6D",
  coralDeep: "#E83158",
  butter: "#FFD93D",
  butterDeep: "#E8B91A",
  white: "#FFFFFF",
};

const CONTRIBUTORS = [
  { who: "You", initial: "Y", color: COL.lime, wallet: "0x89A...4fE1", amount: 180, tag: "OWNER" },
  { who: "Alex", initial: "A", color: COL.coral, wallet: "0x12B...7cC2", amount: 144 },
  { who: "Jordan", initial: "J", color: COL.butter, wallet: "0x88C...9dA3", amount: 126 },
];

const F = {
  display: { fontFamily: "'Archivo Black', system-ui, sans-serif", fontWeight: 900 },
  body: { fontFamily: "'Inter', system-ui, sans-serif" },
  mono: { fontFamily: "'JetBrains Mono', monospace" },
};

function Ticker({ value, format = (v) => v.toLocaleString() }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 1000;
    const animate = (t) => {
      const p = Math.min(1, (t - start) / dur);
      // easeOutBack for a tiny overshoot
      const c1 = 1.2;
      const c3 = c1 + 1;
      const eased = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
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
        fontWeight: 800,
        letterSpacing: "0.08em",
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
      onMouseLeave={() => { setH(false); setP(false); }}
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
        transform: p ? "scale(0.94)" : h ? "translateY(-3px)" : "translateY(0)",
        transition: "transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s",
        boxShadow: h ? "0 12px 28px rgba(15,15,15,0.18)" : "0 3px 10px rgba(15,15,15,0.08)",
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
        transition: "all .18s",
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

// Multi-segment contributor progress bar — the key visual
function ContributorBar({ contributors, total, poolTotal }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <div>
      {/* Bar */}
      <div
        style={{
          display: "flex",
          height: 22,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 999,
          overflow: "hidden",
          position: "relative",
          gap: 2,
          padding: 2,
        }}
      >
        {contributors.map((c, i) => {
          const widthPct = (c.amount / total) * 100;
          return (
            <div
              key={c.who}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="v2-bar-seg"
              style={{
                width: `${widthPct}%`,
                background: c.color,
                borderRadius: 999,
                transition: "transform .25s cubic-bezier(.34,1.56,.64,1), opacity .15s",
                transformOrigin: "left center",
                animationDelay: `${0.4 + i * 0.08}s`,
                opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.4 : 1,
                cursor: "pointer",
                position: "relative",
              }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
        {contributors.map((c, i) => (
          <div
            key={c.who}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px 6px 8px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 999,
              opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.5 : 1,
              transition: "opacity .15s, transform .15s",
              transform: hoveredIdx === i ? "translateY(-2px)" : "translateY(0)",
              cursor: "pointer",
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: 999, background: c.color, flexShrink: 0 }} />
            <span style={{ ...F.body, fontSize: 12, color: "rgba(255,255,255,0.92)", fontWeight: 700 }}>
              {c.who}
            </span>
            <span style={{ ...F.display, fontSize: 13, color: "#fff", letterSpacing: "-0.01em" }}>
              {c.amount}
            </span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px 6px 8px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 999,
            border: `1px dashed rgba(255,255,255,0.25)`,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
          <span style={{ ...F.body, fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 700 }}>To go</span>
          <span style={{ ...F.display, fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
            {total - poolTotal}
          </span>
        </div>
      </div>
    </div>
  );
}

// Avatar fan — overlapping circles
function AvatarFan({ contributors, size = 36 }) {
  return (
    <div style={{ display: "flex" }}>
      {contributors.map((c, i) => (
        <div
          key={c.who}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: c.color,
            border: `3px solid ${COL.butter}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...F.display,
            fontSize: size * 0.4,
            color: COL.ink,
            marginLeft: i === 0 ? 0 : -size * 0.32,
            zIndex: contributors.length - i,
            transition: "transform .2s cubic-bezier(.34,1.56,.64,1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px) scale(1.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
        >
          {c.initial}
        </div>
      ))}
    </div>
  );
}

// Donut chart for receipts
function ContribDonut({ contributors, total, size = 220 }) {
  const radius = (size - 36) / 2;
  const circ = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;
  let cumOffset = 0;
  const sumPct = contributors.reduce((s, c) => s + c.amount, 0);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={COL.cream} strokeWidth="28" />
      {contributors.map((c, i) => {
        const pct = c.amount / sumPct;
        const len = pct * circ;
        const gap = circ - len;
        const offset = -cumOffset;
        cumOffset += len;
        return (
          <circle
            key={c.who}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={c.color}
            strokeWidth="28"
            strokeDasharray={`${len} ${gap}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              animation: `donutSeg .9s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.12}s both`,
              transformOrigin: `${cx}px ${cy}px`,
            }}
          />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="800" fill="rgba(15,15,15,0.5)" letterSpacing="0.18em">TOTAL</text>
      <text x={cx} y={cy + 22} textAnchor="middle" fontFamily="Archivo Black" fontSize="38" fill={COL.ink} letterSpacing="-0.02em">{sumPct}</text>
      <text x={cx} y={cy + 40} textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="700" fill="rgba(15,15,15,0.45)" letterSpacing="0.15em">SUI</text>
    </svg>
  );
}

// Action type icons
const ActionIcon = ({ type, color }) => {
  const common = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 12, background: color, flexShrink: 0, color: COL.ink };
  if (type === "win") return <div style={common}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22m7-7.34V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg></div>;
  if (type === "add") return <div style={common}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></div>;
  if (type === "create") return <div style={common}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>;
  return <div style={common}><span>•</span></div>;
};

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
    const newCoins = Array.from({ length: 16 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: i * 0.04,
      dur: 1.3 + Math.random() * 0.7,
      rot: Math.random() * 720,
    }));
    setCoinShower((c) => [...c, ...newCoins]);
    setContributing(false);
    setTimeout(() => setCoinShower([]), 2600);
    setTimeout(() => setLastAdd(null), 2400);
  };

  return (
    <div style={{ minHeight: "100vh", background: COL.cream, color: COL.ink, ...F.body, overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes springUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.94); }
          70% { transform: translateY(-6px) scale(1.015); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideLeft {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes barSegment {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(210,240,50,0.55); }
          50% { box-shadow: 0 0 0 10px rgba(210,240,50,0); }
        }
        @keyframes coinFall {
          0% { opacity: 0; transform: translateY(-20vh) rotate(0); }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { opacity: 0; transform: translateY(110vh) rotate(var(--r,720deg)); }
        }
        @keyframes floatPop {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          20% { opacity: 1; transform: translateY(-14px) scale(1.05); }
          80% { opacity: 1; transform: translateY(-80px) scale(1); }
          100% { opacity: 0; transform: translateY(-110px) scale(0.9); }
        }
        @keyframes spinSlow { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes donutSeg {
          from { stroke-dasharray: 0 9999; }
        }
        .v2-up { animation: springUp .65s cubic-bezier(.34,1.56,.64,1) both; }
        .v2-left { animation: slideLeft .5s cubic-bezier(.2,.7,.2,1) both; }
        .v2-right { animation: slideRight .5s cubic-bezier(.2,.7,.2,1) both; }
        .v2-bar-seg { animation: barSegment .9s cubic-bezier(.34,1.56,.64,1) both; }
        .v2-pulse { animation: pulse 2s infinite; }
        button { appearance: none; -webkit-appearance: none; font-family: inherit; }
        body { background: ${COL.cream}; margin: 0; }
        ::selection { background: ${COL.lime}; color: ${COL.ink}; }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 28px 80px" }}>

        {/* TOP STRIP */}
        <div className="v2-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button style={{ ...F.body, background: "transparent", border: "none", color: COL.ink, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 0", display: "flex", alignItems: "center", gap: 8 }}>
              ← <span style={{ color: COL.inkSoft }}>back to pools</span>
            </button>
            <span style={{ color: COL.inkFaint, fontSize: 14 }}>·</span>
            <div style={{ ...F.mono, fontSize: 11, color: COL.inkSoft, letterSpacing: "0.06em" }}>
              pool/summer-trip-26
            </div>
          </div>
          <OutlineBtn icon="⚔">Start a duel</OutlineBtn>
        </div>

        {/* HERO BLOCK */}
        <div
          className="v2-up"
          style={{
            animationDelay: "0.05s",
            background: COL.navy,
            color: COL.white,
            borderRadius: 36,
            padding: "44px 44px 38px",
            marginBottom: 14,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Tasteful corner decoration */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: COL.lime, opacity: 0.92 }} />
          <div style={{ position: "absolute", top: 40, right: 110, width: 64, height: 64, borderRadius: "50%", background: COL.coral, animation: "spinSlow 22s linear infinite" }} />

          <div style={{ position: "absolute", top: 24, right: 24, padding: "6px 12px", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 999, ...F.mono, fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.85)", zIndex: 2 }}>
            ED. 03
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", position: "relative" }}>
            <div className="v2-pulse" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 8px", background: "rgba(210,240,50,0.18)", border: "1.5px solid rgba(210,240,50,0.5)", borderRadius: 999 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: COL.lime }} />
              <span style={{ ...F.body, fontSize: 11, color: COL.lime, fontWeight: 800, letterSpacing: "0.18em" }}>LIVE</span>
            </div>
            <ChipPill bg="rgba(255,255,255,0.08)" color="rgba(255,255,255,0.9)" border="rgba(255,255,255,0.2)">PUBLIC POOL</ChipPill>
            <ChipPill bg="rgba(255,255,255,0.08)" color="rgba(255,255,255,0.9)" border="rgba(255,255,255,0.2)">SAVE THE CHILDREN</ChipPill>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "flex-end", position: "relative" }}>
            <div>
              <h1 style={{ ...F.display, fontSize: 78, margin: 0, lineHeight: 0.94, letterSpacing: "-0.035em", maxWidth: 580 }}>
                Summer Trip '26
              </h1>
              <div style={{ ...F.body, fontSize: 14, color: "rgba(255,255,255,0.62)", marginTop: 14, fontWeight: 500, lineHeight: 1.5, maxWidth: 460 }}>
                Group savings pool. Funds release to Save the Children on 14 May 2026.
              </div>
            </div>

            <div style={{ textAlign: "right", position: "relative", minWidth: 280 }}>
              <div style={{ ...F.body, fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 800, marginBottom: 6, letterSpacing: "0.22em" }}>
                TOTAL POOLED
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, justifyContent: "flex-end", position: "relative" }}>
                <span style={{ ...F.display, fontSize: 120, color: COL.lime, lineHeight: 1, letterSpacing: "-0.04em" }}>
                  <Ticker value={poolTotal} />
                </span>
                {lastAdd && (
                  <span style={{ position: "absolute", top: -20, right: 0, ...F.display, fontSize: 28, color: COL.lime, animation: "floatPop 2.4s ease-out forwards" }}>
                    +{lastAdd}
                  </span>
                )}
              </div>
              <div style={{ ...F.body, fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 600, marginTop: -4 }}>
                of {target.toLocaleString()} SUI · <span style={{ color: COL.lime }}>{Math.round(pct)}% there</span>
              </div>
            </div>
          </div>

          {/* CONTRIBUTOR-SEGMENTED BAR */}
          <div style={{ marginTop: 32, position: "relative" }}>
            <ContributorBar contributors={CONTRIBUTORS} total={target} poolTotal={poolTotal} />
          </div>
        </div>

        {/* ASYMMETRIC STATS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>
          {/* Big members card */}
          <div
            className="v2-left"
            style={{
              animationDelay: "0.15s",
              background: COL.butter,
              borderRadius: 32,
              padding: 30,
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ ...F.body, fontSize: 11, letterSpacing: "0.22em", color: COL.ink, fontWeight: 800 }}>
                  MEMBERS
                </div>
                <div style={{ ...F.body, fontSize: 13, color: COL.inkSoft, marginTop: 6, fontWeight: 500 }}>
                  pooling together
                </div>
              </div>
              <button style={{ ...F.body, padding: "6px 14px", background: COL.ink, color: COL.butter, border: "none", borderRadius: 999, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                + invite
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 22, justifyContent: "space-between" }}>
              <AvatarFan contributors={CONTRIBUTORS} size={56} />
              <div style={{ ...F.display, fontSize: 88, color: COL.ink, lineHeight: 0.9, letterSpacing: "-0.04em" }}>
                3
              </div>
            </div>
          </div>

          {/* Right stack: 2 small cards */}
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 14 }}>
            <div
              className="v2-right"
              style={{
                animationDelay: "0.2s",
                background: COL.coral,
                borderRadius: 28,
                padding: 22,
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: COL.ink, color: COL.coral, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...F.body, fontSize: 10, letterSpacing: "0.22em", color: COL.ink, fontWeight: 800 }}>DEADLINE</div>
                <div style={{ ...F.display, fontSize: 28, color: COL.ink, lineHeight: 1.05, letterSpacing: "-0.02em", marginTop: 4 }}>
                  14 days
                </div>
                <div style={{ ...F.body, fontSize: 11, color: COL.inkSoft, fontWeight: 600, marginTop: 2 }}>
                  14 May 2026
                </div>
              </div>
            </div>

            <div
              className="v2-right"
              style={{
                animationDelay: "0.28s",
                background: COL.paper,
                borderRadius: 28,
                padding: 22,
                display: "flex",
                alignItems: "center",
                gap: 18,
                border: `1px solid ${COL.border}`,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: COL.lime, color: COL.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...F.body, fontSize: 10, letterSpacing: "0.22em", color: COL.inkSoft, fontWeight: 800 }}>THIS WEEK</div>
                <div style={{ ...F.display, fontSize: 28, color: COL.ink, lineHeight: 1.05, letterSpacing: "-0.02em", marginTop: 4 }}>
                  +90 <span style={{ ...F.body, fontSize: 14, color: COL.inkMuted, fontWeight: 600, letterSpacing: 0 }}>SUI</span>
                </div>
                {/* Mini sparkline */}
                <svg width="80" height="14" style={{ marginTop: 6 }}>
                  <polyline points="0,12 16,9 32,11 48,7 64,8 80,3" fill="none" stroke={COL.limeDeep} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION CARD */}
        <div
          className="v2-up"
          style={{
            animationDelay: "0.32s",
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
                Your move
              </div>
              <h2 style={{ ...F.display, fontSize: 44, color: COL.ink, margin: 0, lineHeight: 1, letterSpacing: "-0.025em" }}>
                {contributing ? "How much?" : "Add to the pot"}
              </h2>
              {!contributing && (
                <div style={{ ...F.body, fontSize: 13, color: COL.ink, opacity: 0.7, marginTop: 8, fontWeight: 500 }}>
                  Mujin takes 1% · Gas ~0.002 SUI · You've added <strong>180 SUI</strong> so far
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
                        transition: "all .15s cubic-bezier(.34,1.56,.64,1)",
                        transform: active ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      {v} SUI
                    </button>
                  );
                })}
                <ColorBtn bg={COL.ink} fg={COL.lime} onClick={handleContribute} icon="✓">
                  Send {contribAmount} SUI
                </ColorBtn>
                <button onClick={() => setContributing(false)} style={{ ...F.body, background: "transparent", border: "none", color: COL.ink, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "8px 12px", opacity: 0.6 }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* WHAT THIS IS */}
        <div
          className="v2-up"
          style={{
            animationDelay: "0.36s",
            background: COL.paper,
            borderRadius: 24,
            padding: "22px 28px",
            marginBottom: 40,
            border: `1px solid ${COL.border}`,
          }}
        >
          <div style={{ ...F.body, fontSize: 11, letterSpacing: "0.22em", fontWeight: 800, color: COL.inkSoft, marginBottom: 8, textTransform: "uppercase" }}>
            What this is
          </div>
          <div style={{ ...F.body, fontSize: 15, color: COL.ink, lineHeight: 1.6 }}>
            Group savings for our annual summer trip. Funds release to{" "}
            <strong style={{ borderBottom: `2px solid ${COL.coral}` }}>Save the Children</strong> on the deadline.
            Use duels to wager fun amounts among members — winners contribute less, the pool still gets the full pot.
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 40, marginBottom: 22, borderBottom: `2px solid ${COL.border}` }}>
          {[["activity", "Activity"], ["members", "Who's in"], ["receipts", "Receipts"]].map(([id, label]) => {
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
                  transition: "all .18s cubic-bezier(.34,1.56,.64,1)",
                  transform: active ? "translateY(-1px)" : "translateY(0)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <div key={tab}>
          {tab === "activity" && (
            <div>
              {/* TODAY group */}
              <div style={{ ...F.body, fontSize: 11, letterSpacing: "0.22em", fontWeight: 800, color: COL.inkSoft, marginBottom: 12, marginTop: 8 }}>
                TODAY
              </div>
              {[
                { who: "maya", initial: "M", color: COL.butter, type: "add", action: "added to the pot", detail: "instant transfer · 1% mujin fee", amount: "+50", time: "5 hours ago", iconColor: COL.lime },
              ].map((row, i) => (
                <ActivityRow key={i} row={row} index={i} />
              ))}

              <div style={{ ...F.body, fontSize: 11, letterSpacing: "0.22em", fontWeight: 800, color: COL.inkSoft, marginBottom: 12, marginTop: 28 }}>
                EARLIER THIS WEEK
              </div>
              {[
                { who: "alex", initial: "A", color: COL.coral, type: "win", action: "won a duel", detail: "Higher or Lower · 3 of 3 accepted", amount: "+150", time: "2 days ago", win: true, iconColor: COL.butter },
                { who: "you", initial: "Y", color: COL.lime, type: "create", action: "created the pool", detail: "destination: Save the Children", amount: "", time: "2 days ago", iconColor: COL.coral },
              ].map((row, i) => (
                <ActivityRow key={i} row={row} index={i + 1} />
              ))}
            </div>
          )}

          {tab === "members" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {CONTRIBUTORS.map((m, i) => (
                <div
                  key={m.who}
                  className="v2-up"
                  style={{
                    animationDelay: `${0.05 + i * 0.06}s`,
                    background: COL.paper,
                    borderRadius: 28,
                    padding: 26,
                    border: `1px solid ${COL.border}`,
                    textAlign: "center",
                    transition: "transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px) rotate(-0.5deg)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,15,15,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) rotate(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: 80, height: 80, background: m.color, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    ...F.display, fontSize: 34, color: COL.ink,