"use client";

import { useState, useEffect, useMemo, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// MUJIN — refined dark / mono UI
// Sidebar nav, warm charcoal palette, coral accent. Mono type
// for labels & numerals, no ASCII flourish, no scan lines.
// Subtle animations: fade-in, count-up, sparkline draw.
// ─────────────────────────────────────────────────────────────

const C = {
  bg: "#131211",
  panel: "#1a1918",
  panelHi: "#1f1e1d",
  text: "#ecebe7",
  muted: "#8a857d",
  dim: "#5a554f",
  faint: "rgba(236,235,231,0.06)",
  border: "rgba(236,235,231,0.07)",
  borderHi: "rgba(236,235,231,0.16)",
  accent: "#ff7849",
  accentSoft: "rgba(255,120,73,0.5)",
  accentFaint: "rgba(255,120,73,0.08)",
  good: "#7fb069",
  goodSoft: "rgba(127,176,105,0.4)",
};

const MONO = {
  fontFamily:
    "'JetBrains Mono','IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace",
};

// ─────────────────────────────────────────────────────────────
// Atoms

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
  return <>{format(v)}</>;
}

function Sparkline({ data, color = C.accent, w = 80, h = 28 }) {
  const path = useMemo(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    return data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((d - min) / range) * h;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [data, w, h]);
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 300,
          strokeDashoffset: 300,
          animation: "mjnDraw 1.1s cubic-bezier(.2,.7,.2,1) forwards",
        }}
      />
    </svg>
  );
}

function Bar({ value, total, height = 3, color = C.accent }) {
  const pct = Math.min(100, (value / total) * 100);
  return (
    <div style={{ height, background: C.faint, overflow: "hidden", borderRadius: 1 }}>
      <div
        className="mjn-bar"
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
        }}
      />
    </div>
  );
}

function Tag({ children, tone = "muted", style = {} }) {
  const palette = {
    muted: { color: C.muted, bg: "transparent", border: C.border },
    accent: { color: C.accent, bg: C.accentFaint, border: C.accentSoft },
    good: { color: C.good, bg: "rgba(127,176,105,0.08)", border: C.goodSoft },
    solid: { color: C.bg, bg: C.text, border: C.text },
  }[tone];
  return (
    <span
      style={{
        ...MONO,
        fontSize: 9,
        letterSpacing: "0.18em",
        padding: "3px 8px",
        border: `1px solid ${palette.border}`,
        background: palette.bg,
        color: palette.color,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Btn({ children, onClick, primary = false, accent = C.accent, style = {} }) {
  const [h, setH] = useState(false);
  const isPrimary = primary;
  const fillClass = isPrimary
    ? accent === C.warn
      ? "mjn-fill-amber"
      : accent === C.accent
      ? "mjn-fill-coral"
      : ""
    : "";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className={fillClass}
      style={{
        ...MONO,
        padding: "9px 16px",
        ...(isPrimary
          ? { border: "1px solid" }
          : {
              background: "transparent",
              color: h ? C.text : C.muted,
              border: `1px solid ${h ? C.borderHi : C.border}`,
            }),
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all .15s ease",
        opacity: isPrimary && h ? 0.92 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Label({ children, style = {} }) {
  return (
    <div
      style={{
        ...MONO,
        fontSize: 10,
        letterSpacing: "0.22em",
        color: C.muted,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Icons & dropdowns

function MujinLogo({ size = 26, color = C.accent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" style={{ display: "block" }}>
      <path d="M24.838 15H40.2234C40.3907 14.9998 40.555 15.0446 40.6999 15.1298C40.8448 15.215 40.965 15.3376 41.0486 15.4853C41.8978 16.9792 42.5447 18.5833 42.9717 20.2541C43.0061 20.3981 43.0091 20.548 42.9805 20.6933C42.952 20.8386 42.8927 20.9758 42.8067 21.0953C42.7146 21.2094 42.5995 21.302 42.4691 21.3668C42.3388 21.4315 42.1963 21.4669 42.0514 21.4706H24.838C23.9127 21.4722 23.0257 21.8477 22.3714 22.5147C21.7171 23.1818 21.3487 24.086 21.3471 25.0294C21.3473 25.1569 21.3228 25.2832 21.275 25.401C21.2272 25.5188 21.1571 25.6259 21.0686 25.7161C20.9802 25.8062 20.8752 25.8777 20.7596 25.9264C20.644 25.9751 20.5201 26.0001 20.3951 26H15.9521C15.827 26.0001 15.7031 25.9751 15.5875 25.9264C15.4719 25.8777 15.3669 25.8062 15.2785 25.7161C15.19 25.6259 15.1199 25.5188 15.0721 25.401C15.0243 25.2832 14.9998 25.1569 15 25.0294C15.0022 22.3701 16.0395 19.8204 17.884 17.9401C19.7285 16.0597 22.2295 15.0023 24.838 15Z" fill={color} />
      <path d="M25.1638 35H9.77977C9.61255 35.0002 9.44823 34.9554 9.30338 34.8702C9.15853 34.785 9.03827 34.6624 8.95473 34.5147C8.10563 33.0208 7.45875 31.4166 7.03173 29.7459C6.97239 29.5156 6.99955 29.2709 7.10789 29.06C7.18796 28.9017 7.30887 28.7686 7.4576 28.6751C7.60633 28.5816 7.77726 28.5312 7.95197 28.5294H25.1638C26.089 28.5277 26.9759 28.1523 27.6302 27.4852C28.2844 26.8182 28.6527 25.9139 28.6544 24.9706C28.6542 24.8431 28.6787 24.7168 28.7265 24.599C28.7743 24.4811 28.8444 24.3741 28.9328 24.2839C29.0212 24.1937 29.1263 24.1223 29.2418 24.0735C29.3574 24.0248 29.4813 23.9998 29.6063 24H34.0489C34.174 23.9998 34.2978 24.0248 34.4134 24.0735C34.529 24.1223 34.634 24.1937 34.7224 24.2839C34.8109 24.3741 34.881 24.4811 34.9288 24.599C34.9765 24.7168 35.0011 24.8431 35.0009 24.9706C34.9986 27.6298 33.9615 30.1795 32.1172 32.0599C30.2728 33.9403 27.772 34.9977 25.1638 35Z" fill={color} />
      <path d="M6.96962 25.9999C6.84224 26.0001 6.71608 25.9752 6.59836 25.9266C6.48064 25.878 6.37369 25.8068 6.28362 25.7169C6.19354 25.627 6.12213 25.5202 6.07346 25.4027C6.0248 25.2852 5.99983 25.1593 6 25.0322C5.99849 21.3705 7.05579 17.7862 9.04499 14.7094C11.0342 11.6327 13.8708 9.19427 17.2143 7.68685C20.5578 6.17944 24.2661 5.66709 27.8942 6.21129C31.5222 6.75549 34.9158 8.33313 37.6677 10.7548C37.7812 10.8562 37.8699 10.9822 37.9271 11.1231C37.9842 11.264 38.0082 11.4161 37.9973 11.5677C37.9738 11.8086 37.8616 12.0323 37.6826 12.1955C37.5035 12.3587 37.2702 12.4499 37.0277 12.4516H25.0691C21.7274 12.4559 18.5237 13.7827 16.1608 16.1411C13.7978 18.4995 12.4684 21.6969 12.4641 25.0322C12.4643 25.1593 12.4393 25.2852 12.3906 25.4027C12.342 25.5202 12.2706 25.627 12.1805 25.7169C12.0904 25.8068 11.9835 25.878 11.8658 25.9266C11.748 25.9752 11.6219 26.0001 11.4945 25.9999H6.96962Z" fill={color} />
      <path d="M43.9998 24.9679C44.0494 41.2348 24.4984 50.0445 12.3276 39.2479C12.1439 39.0851 12.0286 38.8591 12.0047 38.6151C11.9807 38.3711 12.0499 38.1271 12.1984 37.9318C12.2885 37.8133 12.4048 37.7173 12.5383 37.6513C12.6718 37.5852 12.8187 37.5509 12.9677 37.5511H24.928C28.2702 37.5468 31.4743 36.2197 33.8376 33.8608C36.2009 31.5019 37.5305 28.3039 37.5348 24.9679C37.5346 24.8408 37.5596 24.7148 37.6083 24.5973C37.6569 24.4798 37.7284 24.373 37.8184 24.2831C37.9085 24.1932 38.0155 24.1219 38.1332 24.0733C38.251 24.0248 38.3771 23.9998 38.5045 24H43.0301C43.1574 23.9998 43.2836 24.0248 43.4014 24.0733C43.5191 24.1219 43.6261 24.1932 43.7162 24.2831C43.8062 24.373 43.8777 24.4798 43.9263 24.5973C43.975 24.7148 44 24.8408 43.9998 24.9679Z" fill={color} />
      <circle opacity="0.25" cx="25" cy="25" r="23.5" stroke={color} strokeWidth="3" />
    </svg>
  );
}

// AmberBtn forces the amber fill via a ref-based DOM call. This bypasses
// any CSS specificity / cascade issues from Tailwind preflight, browser
// dark-mode form-control rules, dark-reader-style extensions, etc.
function AmberBtn({ children, onClick, style = {}, full, big }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("background", "#f7e08a", "important");
    ref.current.style.setProperty("background-color", "#f7e08a", "important");
    ref.current.style.setProperty("color", "#131211", "important");
    ref.current.style.setProperty("border-color", "#f7e08a", "important");
  });
  return (
    <button
      ref={ref}
      onClick={onClick}
      style={{
        fontFamily: "'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace",
        appearance: "none",
        WebkitAppearance: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: big ? "14px 36px" : "12px 22px",
        width: full ? "100%" : "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 0,
        fontSize: big ? 13 : 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontWeight: 600,
        boxShadow: "0 0 24px rgba(247,224,138,0.28)",
        transition: "opacity .15s",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.92")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
}

function AmberCircle({ children, size = 88, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("background", "#f7e08a", "important");
    ref.current.style.setProperty("background-color", "#f7e08a", "important");
  });
  return (
    <div
      ref={ref}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 40px rgba(247,224,138,0.5)",
        color: "#131211",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function BellIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function PeopleIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function TicketIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}

function TrophyIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}

function CogIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconBtn({ children, onClick, active, badge }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: active ? C.panelHi : "transparent",
        border: `1px solid ${active ? C.borderHi : C.border}`,
        color: active || h ? C.text : C.muted,
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all .15s",
        position: "relative",
      }}
    >
      {children}
      {badge && (
        <span
          className="mjn-pulse"
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 6,
            height: 6,
            borderRadius: 999,
            background: C.accent,
            boxShadow: `0 0 6px ${C.accent}`,
          }}
        />
      )}
    </button>
  );
}

function DropdownPanel({ children, width = 320 }) {
  return (
    <div
      className="mjn-fade-in"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width,
        background: C.bg,
        border: `1px solid ${C.borderHi}`,
        padding: 16,
        zIndex: 30,
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
      }}
    >
      {children}
    </div>
  );
}

function MenuItem({ children, onClick, danger }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        ...MONO,
        display: "block",
        width: "100%",
        textAlign: "left",
        background: h ? C.panelHi : "transparent",
        border: "none",
        color: danger ? "#ff6b6b" : h ? C.text : C.muted,
        padding: "10px 14px",
        fontSize: 12,
        letterSpacing: "0.04em",
        cursor: "pointer",
        transition: "all .12s",
      }}
    >
      {children}
    </button>
  );
}

function WalletPanel({ setScreen, onClose }) {
  return (
    <DropdownPanel width={280}>
      <div style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}`, marginBottom: 6 }}>
        <div style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em", marginBottom: 8 }}>
          0x89A...4fE1
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Tag>Sui Mainnet</Tag>
          <Tag tone="accent">450 SUI</Tag>
        </div>
      </div>
      <div>
        <MenuItem
          onClick={() => {
            try { navigator.clipboard?.writeText("0x89A...4fE1"); } catch {}
            onClose?.();
          }}
        >
          Copy address
        </MenuItem>
        <MenuItem onClick={onClose}>View on explorer</MenuItem>
        <MenuItem
          onClick={() => {
            setScreen("settings");
            onClose?.();
          }}
        >
          Settings
        </MenuItem>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 6, paddingTop: 4 }}>
        <MenuItem
          danger
          onClick={() => {
            setScreen("disconnect");
            onClose?.();
          }}
        >
          Disconnect wallet
        </MenuItem>
      </div>
    </DropdownPanel>
  );
}

const INITIAL_BADGES = [
  { id: "pool_creator", name: "Pool Pioneer", desc: "Create your first pool", earned: true, tokens: 10, icon: "◆" },
  { id: "first_contribution", name: "First Drop", desc: "Make your first contribution", earned: true, tokens: 5, icon: "●" },
  { id: "social_butterfly", name: "Network Effect", desc: "Add 3 friends", earned: true, tokens: 15, icon: "✦" },
  { id: "first_win", name: "Duel Champ", desc: "Win your first duel", earned: false, tokens: 25, icon: "♠" },
  { id: "hot_streak", name: "Hot Streak", desc: "Win 5 duels in a row", earned: false, tokens: 50, icon: "▲" },
  { id: "pool_complete", name: "Target Hit", desc: "Complete a pool to its target", earned: false, tokens: 100, icon: "★" },
  { id: "big_spender", name: "Big Spender", desc: "Contribute 1000 SUI total", earned: false, tokens: 40, icon: "◈" },
];

function BadgeRow({ badge, locked, index, big }) {
  return (
    <div
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.04 * index}s`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        background: locked ? "transparent" : C.panel,
        border: `1px solid ${locked ? C.border : "rgba(247,224,138,0.35)"}`,
        marginBottom: 6,
        opacity: locked ? 0.55 : 1,
        transition: "all .15s",
      }}
    >
      <div
        style={{
          width: big ? 40 : 32,
          height: big ? 40 : 32,
          background: locked ? C.faint : "rgba(247,224,138,0.18)",
          color: locked ? C.dim : C.warn,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...MONO,
          fontSize: big ? 18 : 14,
          flexShrink: 0,
        }}
      >
        {locked ? "?" : badge.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...MONO, fontSize: 12, color: C.text, letterSpacing: "0.02em" }}>{badge.name}</div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, marginTop: 2, letterSpacing: "0.04em" }}>{badge.desc}</div>
      </div>
      <div style={{ ...MONO, fontSize: 11, color: locked ? C.dim : C.warn, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
        +{badge.tokens} MJ
      </div>
    </div>
  );
}

function CollectiblesPanel({ badges, mujinTokens }) {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);
  return (
    <DropdownPanel width={340}>
      <div style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ ...MONO, fontSize: 14, fontWeight: 500, margin: 0, color: C.text, letterSpacing: "0.04em" }}>
            Collectibles
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              ...MONO,
              fontSize: 12,
              color: C.warn,
              padding: "4px 10px",
              border: `1px solid rgba(247,224,138,0.35)`,
              background: "rgba(247,224,138,0.06)",
            }}
          >
            <span style={{ fontSize: 13 }}>◆</span>
            <span style={{ letterSpacing: "0.05em" }}>
              <Ticker value={mujinTokens} /> MJ
            </span>
          </div>
        </div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, marginTop: 8, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {earned.length} of {badges.length} earned
        </div>
      </div>

      {earned.length > 0 && (
        <>
          <Label style={{ marginBottom: 8 }}>Earned</Label>
          <div style={{ marginBottom: 14 }}>
            {earned.map((b, i) => <BadgeRow key={b.id} badge={b} index={i} />)}
          </div>
        </>
      )}

      {locked.length > 0 && (
        <>
          <Label style={{ marginBottom: 8 }}>Locked</Label>
          <div style={{ maxHeight: 180, overflowY: "auto" }}>
            {locked.map((b, i) => <BadgeRow key={b.id} badge={b} index={i} locked />)}
          </div>
        </>
      )}
    </DropdownPanel>
  );
}

const MOCK_RAFFLE_WALLETS = [
  "0x89A...4fE1", "0x12B...7cC2", "0x88C...9dA3", "0x44D...2bB4",
  "0x3d4...8c5e", "0x9c3...b4f1", "0x1f2...8aC3", "0x7B5...e9D4",
  "0x6A8...f3C2", "0xC04...d8E7", "0x4E2...b1A9", "0x9F1...0c5B",
  "0x2D6...e4F8", "0x5A3...b7E2", "0x8C7...f1D9", "0xB42...a3C5",
  "0x1E9...d6F3", "0xF50...b8A2", "0x7D3...c5E1", "0x3B6...a9F4",
  "0xE1A...c7B6", "0x5F8...d2A4", "0x9B3...e6C1", "0x2C4...b8F7",
];

const INITIAL_RAFFLE_TICKETS = [
  { id: 3, count: 3, amount: 30, source: "Summer trip '26", date: "2h ago" },
  { id: 2, count: 6, amount: 60, source: "Tokyo '27", date: "Yesterday" },
  { id: 1, count: 9, amount: 90, source: "House deposit", date: "3 days ago" },
];

const RAFFLE_PRIZES = [500, 250, 100];
const MONTHLY_SECONDS = 30 * 24 * 3600;

function formatRaffleTime(seconds) {
  if (seconds <= 0) return "00:00";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (d > 0) return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function formatRaffleShort(seconds) {
  if (seconds <= 0) return "DRAW";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (d > 0) return `${d}D ${pad(h)}H`;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `00:${pad(s)}`;
}

function RaffleTicketRow({ t, index }) {
  return (
    <div
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.04 * index}s`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        background: C.panel,
        border: `1px solid ${C.border}`,
        marginBottom: 6,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          background: "rgba(247,224,138,0.15)",
          color: C.warn,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <TicketIcon size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...MONO, fontSize: 12, color: C.text, letterSpacing: "0.02em" }}>
          {t.count} ticket{t.count !== 1 ? "s" : ""}
        </div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, marginTop: 2, letterSpacing: "0.04em" }}>
          {t.amount} SUI · {t.source}
        </div>
      </div>
      <div style={{ ...MONO, fontSize: 10, color: C.dim, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
        {t.date}
      </div>
    </div>
  );
}

function RafflePanel({ tickets, totalTickets, seconds, drawn, onViewDraw }) {
  const recent = tickets.slice(0, 3);
  const ready = seconds === 0 && !drawn;
  const justReset = seconds > 86400; // more than 1 day = post-draw state

  return (
    <DropdownPanel width={360}>
      <div style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}`, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ ...MONO, fontSize: 14, fontWeight: 500, margin: 0, color: C.text, letterSpacing: "0.04em" }}>
            Mujin Raffle
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              ...MONO,
              fontSize: 12,
              color: C.warn,
              padding: "4px 10px",
              border: `1px solid rgba(247,224,138,0.35)`,
              background: "rgba(247,224,138,0.06)",
            }}
          >
            <TicketIcon size={12} />
            <span style={{ letterSpacing: "0.05em" }}>
              <Ticker value={totalTickets} /> tickets
            </span>
          </div>
        </div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, marginTop: 8, letterSpacing: "0.04em", lineHeight: 1.55 }}>
          Earn 1 ticket per £10 of SUI you pool. 3 winners drawn monthly.
        </div>
      </div>

      <div
        style={{
          padding: "18px",
          background: C.panel,
          border: `1px solid ${ready ? C.warn : seconds <= 5 ? "rgba(247,224,138,0.35)" : C.border}`,
          textAlign: "center",
          marginBottom: 14,
          position: "relative",
          overflow: "hidden",
          boxShadow: ready ? `0 0 30px rgba(247,224,138,0.15)` : "none",
          transition: "all .25s",
        }}
      >
        <div
          style={{
            ...MONO,
            fontSize: 9,
            color: ready ? C.warn : C.muted,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {ready ? "Draw is live" : "Next draw in"}
        </div>
        <div
          style={{
            ...MONO,
            fontSize: ready ? 22 : justReset ? 22 : 32,
            fontWeight: 500,
            color: ready ? C.warn : seconds <= 60 ? C.warn : C.text,
            letterSpacing: justReset ? "0.04em" : "0.08em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {ready ? "Tap to draw" : formatRaffleTime(seconds)}
        </div>
        {justReset && (
          <div style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 8 }}>
            Tickets reset · earn again
          </div>
        )}
      </div>

      {ready && (
        <div style={{ marginBottom: 14 }}>
          <AmberBtn onClick={onViewDraw} full>
            ◆ View live draw →
          </AmberBtn>
        </div>
      )}

      <Label style={{ marginBottom: 8 }}>Recent tickets earned</Label>
      <div>
        {recent.length > 0 ? (
          recent.map((t, i) => <RaffleTicketRow key={t.id} t={t} index={i} />)
        ) : (
          <div style={{ ...MONO, fontSize: 11, color: C.muted, padding: 12, textAlign: "center", letterSpacing: "0.02em" }}>
            No tickets yet. Contribute to a pool to earn some.
          </div>
        )}
      </div>
    </DropdownPanel>
  );
}

function NotificationsPanel() {
  const notifs = [
    { title: "Higher or Lower duel ready", time: "2h ago", context: "Summer trip '26", unread: true },
    { title: "You were invited to a duel", time: "30m ago", context: "Tokyo '27", unread: true },
  ];
  return (
    <DropdownPanel>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
        <h3 style={{ ...MONO, fontSize: 14, fontWeight: 500, margin: 0, color: C.text, letterSpacing: "0.04em" }}>
          Notifications
        </h3>
        <span style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {notifs.filter((n) => n.unread).length} updates
        </span>
      </div>
      {notifs.map((n, i) => (
        <NotifRow key={i} n={n} index={i} />
      ))}
    </DropdownPanel>
  );
}

function NotifRow({ n, index }) {
  const [h, setH] = useState(false);
  return (
    <div
      className="mjn-fade-in"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        animationDelay: `${0.05 * index}s`,
        padding: "12px 14px",
        border: `1px solid ${h ? C.borderHi : C.border}`,
        background: h ? C.panelHi : C.panel,
        marginBottom: 8,
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        {n.unread && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: C.accent,
              boxShadow: `0 0 6px ${C.accent}`,
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ ...MONO, fontSize: 12, color: C.text, letterSpacing: "0.02em" }}>{n.title}</div>
      </div>
      <div style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.06em", paddingLeft: n.unread ? 14 : 0 }}>
        {n.time} · {n.context}
      </div>
    </div>
  );
}

function FriendsPanel() {
  const [mode, setMode] = useState("list");
  const [name, setName] = useState("");
  const [wallet, setWallet] = useState("");
  const [friends, setFriends] = useState([
    { name: "alex", wallet: "0x12B...7cC2" },
    { name: "jordan", wallet: "0x88C...9dA3" },
    { name: "maya", wallet: "0x44D...2bB4" },
    { name: "alice", wallet: "0x3d4...8c5e" },
  ]);

  if (mode === "add") {
    const inputStyle = {
      ...MONO,
      width: "100%",
      background: C.panel,
      border: `1px solid ${C.border}`,
      outline: "none",
      color: C.text,
      padding: "10px 12px",
      fontSize: 13,
      letterSpacing: "0.02em",
    };
    return (
      <DropdownPanel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${C.border}`, marginBottom: 14 }}>
          <h3 style={{ ...MONO, fontSize: 14, fontWeight: 500, margin: 0, color: C.text, letterSpacing: "0.04em" }}>
            Add friend
          </h3>
          <button
            onClick={() => setMode("list")}
            style={{
              ...MONO,
              background: "transparent",
              border: "none",
              color: C.muted,
              fontSize: 10,
              cursor: "pointer",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            ← Back
          </button>
        </div>
        <div style={{ marginBottom: 12 }}>
          <Label style={{ marginBottom: 6 }}>Name</Label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
            style={inputStyle}
            autoFocus
            onFocus={(e) => (e.target.style.borderColor = C.borderHi)}
            onBlur={(e) => (e.target.style.borderColor = C.border)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label style={{ marginBottom: 6 }}>Wallet address</Label>
          <input
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x..."
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = C.borderHi)}
            onBlur={(e) => (e.target.style.borderColor = C.border)}
          />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn onClick={() => setMode("list")}>Cancel</Btn>
          <Btn
            primary
            onClick={() => {
              if (name && wallet) {
                setFriends([...friends, { name: name.toLowerCase(), wallet }]);
                setName("");
                setWallet("");
                setMode("list");
              }
            }}
          >
            Save
          </Btn>
        </div>
      </DropdownPanel>
    );
  }

  return (
    <DropdownPanel>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
        <h3 style={{ ...MONO, fontSize: 14, fontWeight: 500, margin: 0, color: C.text, letterSpacing: "0.04em" }}>
          Friends
        </h3>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button
            style={{
              width: 28,
              height: 28,
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
          >
            <CogIcon />
          </button>
          <Btn primary onClick={() => setMode("add")}>+ Add</Btn>
        </div>
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {friends.map((f, i) => (
          <FriendRow key={f.wallet} friend={f} index={i} />
        ))}
      </div>
    </DropdownPanel>
  );
}

function FriendRow({ friend, index }) {
  const [h, setH] = useState(false);
  return (
    <div
      className="mjn-fade-in"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        animationDelay: `${0.04 * index}s`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        background: h ? C.panel : "transparent",
        cursor: "pointer",
        transition: "background .12s",
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          background: C.faint,
          color: C.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...MONO,
          fontSize: 12,
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        {friend.name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em" }}>{friend.name}</div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.06em", marginTop: 2 }}>
          {friend.wallet}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top nav

function TopNav({ screen, setScreen, badges, mujinTokens, raffleTickets, totalRaffleTickets, raffleSeconds, raffleDrawn }) {
  const [openMenu, setOpenMenu] = useState(null);
  const raffleReady = raffleSeconds === 0 && !raffleDrawn;
  const raffleUrgent = raffleSeconds > 0 && raffleSeconds <= 5;

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("[data-dropdown]")) setOpenMenu(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const item = (id, label, available = true) => {
    const active =
      screen === id ||
      (id === "dashboard" && screen === "dashboard") ||
      (id === "pools" && (screen === "pool" || screen === "duel"));
    return (
      <button
        key={id}
        onClick={() => available && setScreen(id === "pools" ? "dashboard" : id)}
        style={{
          ...MONO,
          background: "transparent",
          border: "none",
          color: active ? C.text : C.muted,
          fontSize: 12,
          letterSpacing: "0.06em",
          cursor: available ? "pointer" : "default",
          opacity: available ? 1 : 0.5,
          padding: "6px 0",
          borderBottom: `1px solid ${active ? C.accent : "transparent"}`,
          transition: "all .15s",
        }}
        onMouseEnter={(e) => available && (e.currentTarget.style.color = C.text)}
        onMouseLeave={(e) =>
          available && (e.currentTarget.style.color = active ? C.text : C.muted)
        }
      >
        {label}
      </button>
    );
  };

  return (
    <header
      style={{
        borderBottom: `1px solid ${C.border}`,
        background: "rgba(19,18,17,0.85)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderLeft: `1px solid ${C.border}`,
          borderRight: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => setScreen("dashboard")}
          >
            <MujinLogo size={28} color={C.accent} />
          </div>
          <nav style={{ display: "flex", gap: 26 }}>
            {item("pools", "My pools")}
            {item("explore", "Explore", false)}
            {item("games", "Games", false)}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, ...MONO }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              color: C.muted,
              letterSpacing: "0.06em",
              marginRight: 4,
            }}
          >
            <span
              className="mjn-pulse"
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: C.good,
                boxShadow: `0 0 6px ${C.good}`,
              }}
            />
            Connected
          </span>

          <div data-dropdown style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <IconBtn
              onClick={() => setOpenMenu(openMenu === "notif" ? null : "notif")}
              active={openMenu === "notif"}
              badge
            >
              <BellIcon />
            </IconBtn>
            {openMenu === "notif" && <NotificationsPanel />}
          </div>

          <div data-dropdown style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <IconBtn
              onClick={() => setOpenMenu(openMenu === "friends" ? null : "friends")}
              active={openMenu === "friends"}
            >
              <PeopleIcon />
            </IconBtn>
            {openMenu === "friends" && <FriendsPanel />}
          </div>

          <div data-dropdown style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenMenu(openMenu === "trophy" ? null : "trophy")}
              style={{
                ...MONO,
                display: "flex",
                alignItems: "center",
                gap: 6,
                height: 32,
                padding: "0 10px",
                background: openMenu === "trophy" ? C.panelHi : "transparent",
                border: `1px solid ${openMenu === "trophy" ? C.borderHi : C.border}`,
                color: openMenu === "trophy" ? C.text : C.muted,
                cursor: "pointer",
                fontSize: 11,
                letterSpacing: "0.05em",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = openMenu === "trophy" ? C.text : C.muted)}
            >
              <span style={{ color: C.warn, fontSize: 13 }}>◆</span>
              <span><Ticker value={mujinTokens} /></span>
            </button>
            {openMenu === "trophy" && <CollectiblesPanel badges={badges} mujinTokens={mujinTokens} />}
          </div>

          <div data-dropdown style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            {raffleReady ? (
              <AmberBtn
                onClick={() => setOpenMenu(openMenu === "raffle" ? null : "raffle")}
                style={{
                  height: 32,
                  padding: "0 12px",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  gap: 7,
                  boxShadow: "0 0 16px rgba(247,224,138,0.4)",
                }}
              >
                <TicketIcon size={13} />
                <Ticker value={totalRaffleTickets} />
                <span style={{ letterSpacing: "0.08em" }}>· DRAW</span>
              </AmberBtn>
            ) : (
              <button
                onClick={() => setOpenMenu(openMenu === "raffle" ? null : "raffle")}
                style={{
                  ...MONO,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  height: 32,
                  padding: "0 10px",
                  background: openMenu === "raffle" ? C.panelHi : "transparent",
                  border: `1px solid ${
                    openMenu === "raffle" ? C.borderHi : raffleUrgent ? "rgba(247,224,138,0.4)" : C.border
                  }`,
                  color: openMenu === "raffle" ? C.text : C.muted,
                  cursor: "pointer",
                  fontSize: 11,
                  letterSpacing: "0.05em",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = openMenu === "raffle" ? C.text : C.muted)}
              >
                <TicketIcon size={13} />
                <span><Ticker value={totalRaffleTickets} /></span>
                <span
                  style={{
                    color: raffleUrgent ? C.warn : C.dim,
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  · {formatRaffleShort(raffleSeconds)}
                </span>
              </button>
            )}
            {openMenu === "raffle" && (
              <RafflePanel
                tickets={raffleTickets}
                totalTickets={totalRaffleTickets}
                seconds={raffleSeconds}
                drawn={raffleDrawn}
                onViewDraw={() => {
                  setScreen("raffle-draw");
                  setOpenMenu(null);
                }}
              />
            )}
          </div>

          <div data-dropdown style={{ position: "relative", marginLeft: 4 }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenMenu(openMenu === "wallet" ? null : "wallet")}
              style={{
                ...MONO,
                fontSize: 11,
                letterSpacing: "0.04em",
                padding: "7px 12px",
                border: `1px solid ${openMenu === "wallet" ? C.borderHi : C.border}`,
                background: openMenu === "wallet" ? C.panelHi : "transparent",
                color: C.text,
                cursor: "pointer",
                transition: "all .15s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.borderHi)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = openMenu === "wallet" ? C.borderHi : C.border)}
            >
              0x89A...4fE1
              <span style={{ color: C.muted, fontSize: 9 }}>▾</span>
            </button>
            {openMenu === "wallet" && <WalletPanel setScreen={setScreen} onClose={() => setOpenMenu(null)} />}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Page chrome

function PageHeader({ title, breadcrumbs, range, setRange, children, banner }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
      <div style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {breadcrumbs && (
            <div style={{ ...MONO, fontSize: 11, color: C.muted, letterSpacing: "0.15em", marginBottom: 8 }}>
              {breadcrumbs}
            </div>
          )}
          <h1
            style={{
              ...MONO,
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: 0,
              color: C.text,
            }}
          >
            {title}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {children}
        </div>
      </div>
      {banner}
    </div>
  );
}

function Banner({ tone = "accent", children, onDismiss }) {
  const color = tone === "accent" ? C.accent : C.good;
  return (
    <div
      style={{
        padding: "10px 32px",
        background: tone === "accent" ? "rgba(255,120,73,0.08)" : "rgba(127,176,105,0.08)",
        borderTop: `1px solid ${tone === "accent" ? C.accentSoft : C.goodSoft}`,
        borderBottom: `1px solid ${tone === "accent" ? C.accentSoft : C.goodSoft}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        ...MONO,
        fontSize: 11,
        letterSpacing: "0.08em",
        color: C.text,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Tag tone={tone === "accent" ? "accent" : "good"}>{tone === "accent" ? "duel mode" : "active"}</Tag>
        <span>{children}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            ...MONO,
            background: "transparent",
            border: "none",
            color: color,
            fontSize: 10,
            letterSpacing: "0.18em",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          dismiss →
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dashboard

const POOLS = [
  { id: "p1", name: "Summer trip '26", amount: 450, target: 1200, members: 3, type: "OWNED", duel: true, spark: [10, 18, 22, 35, 40, 55, 70, 90, 110, 150, 200, 280, 340, 450] },
  { id: "p2", name: "House deposit", amount: 15000, target: 20000, members: 2, type: "OWNED", duel: false, spark: [2000, 4000, 5500, 7000, 9000, 10500, 12000, 13500, 14000, 14500, 14800, 15000] },
  { id: "p3", name: "New car fund", amount: 250, target: 5000, members: 3, type: "OWNED", duel: false, spark: [0, 25, 40, 80, 120, 150, 180, 200, 220, 235, 245, 250] },
  { id: "p4", name: "Tokyo '27", amount: 8500, target: 15000, members: 4, type: "JOINED", duel: true, spark: [500, 1200, 2200, 3000, 4200, 5500, 6500, 7200, 7800, 8200, 8400, 8500] },
  { id: "p5", name: "Weekend getaway", amount: 120, target: 300, members: 2, type: "JOINED", duel: false, spark: [10, 25, 40, 60, 75, 85, 95, 105, 110, 115, 118, 120] },
];

function StatCard({ label, value, sub, spark, sparkColor, accent = false, index }) {
  return (
    <div
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.04 * index}s`,
        background: C.panel,
        border: `1px solid ${C.border}`,
        padding: 18,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Label>{label}</Label>
        {spark && <Sparkline data={spark} color={sparkColor || C.muted} w={64} h={20} />}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 12 }}>
        <span
          style={{
            ...MONO,
            fontSize: 32,
            fontWeight: 400,
            color: accent ? C.accent : C.text,
            letterSpacing: "-0.01em",
          }}
        >
          <Ticker value={value} />
        </span>
        {sub && (
          <span style={{ ...MONO, fontSize: 11, color: C.muted, letterSpacing: "0.05em" }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

function PoolCard({ pool, onOpen, index }) {
  const [h, setH] = useState(false);
  const pct = Math.round((pool.amount / pool.target) * 100);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.05 * index}s`,
        background: h ? C.panelHi : C.panel,
        border: `1px solid ${h ? C.borderHi : C.border}`,
        padding: 20,
        cursor: "pointer",
        transition: "all .15s ease",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {pool.duel ? <Tag tone="accent">duel</Tag> : <Tag>standard</Tag>}
        </div>
        <span style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.12em" }}>
          {pool.type} · {pool.members} members
        </span>
      </div>

      <div
        style={{
          ...MONO,
          fontSize: 15,
          fontWeight: 500,
          color: C.text,
          letterSpacing: "0.02em",
          marginBottom: 18,
        }}
      >
        {pool.name}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ ...MONO, fontSize: 26, fontWeight: 400, color: C.text, letterSpacing: "-0.01em" }}>
            <Ticker value={pool.amount} />
          </span>
          <span style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.18em" }}>SUI</span>
        </div>
        <Sparkline data={pool.spark} color={pool.duel ? C.accent : C.muted} w={70} h={22} />
      </div>

      <Bar value={pool.amount} total={pool.target} color={pool.duel ? C.accent : C.text} />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.06em" }}>
          {pct}% of {pool.target.toLocaleString()}
        </span>
        <span
          style={{
            ...MONO,
            fontSize: 10,
            color: h ? C.accent : C.dim,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            transition: "color .15s",
          }}
        >
          Open →
        </span>
      </div>
    </div>
  );
}

function ActivityRow({ who, time, action, type, index }) {
  return (
    <div
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.04 * index}s`,
        display: "grid",
        gridTemplateColumns: "80px 80px 1fr 100px",
        gap: 16,
        padding: "11px 0",
        borderBottom: `1px solid ${C.border}`,
        alignItems: "center",
      }}
    >
      <span style={{ ...MONO, fontSize: 10, color: C.dim, letterSpacing: "0.1em" }}>{time}</span>
      <Tag tone={type === "WIN" ? "accent" : "muted"}>{type}</Tag>
      <span style={{ ...MONO, fontSize: 12, color: C.text, letterSpacing: "0.02em" }}>
        <span style={{ color: C.muted }}>{who}</span> {action}
      </span>
      <span style={{ ...MONO, fontSize: 10, color: C.dim, letterSpacing: "0.14em", textAlign: "right", textTransform: "uppercase" }}>
        View →
      </span>
    </div>
  );
}

function ReferralGraphic() {
  const dots = [
    { top: 6, left: 18, c: 1 },
    { top: 24, left: 142, c: 0 },
    { top: 52, left: 6, c: 1 },
    { top: 70, left: 150, c: 0 },
    { top: 96, left: 16, c: 0 },
    { top: 118, left: 132, c: 1 },
  ];
  return (
    <div
      style={{
        width: 170,
        height: 140,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {dots.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            width: 3,
            height: 3,
            background: p.c === 0 ? C.warn : C.accent,
            borderRadius: 999,
            opacity: 0.75,
            boxShadow: `0 0 6px ${p.c === 0 ? C.warn : C.accent}`,
          }}
        />
      ))}
      <div style={{ position: "relative", width: 92, height: 112 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(247,224,138,0.10)",
            border: `1px solid rgba(247,224,138,0.45)`,
            transform: "rotate(-14deg) translate(-14px, 10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...MONO,
            fontSize: 14,
            color: C.warn,
            letterSpacing: "0.06em",
            opacity: 0.75,
          }}
        >
          +50
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,120,73,0.15)",
            border: `1px solid ${C.accentSoft}`,
            transform: "rotate(7deg) translate(10px, 4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...MONO,
            fontSize: 15,
            color: C.accent,
            letterSpacing: "0.06em",
          }}
        >
          +50
        </div>
        <div
          className="mjn-fill-amber"
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotate(-3deg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            border: "1.5px solid",
            boxShadow: `0 0 32px rgba(247,224,138,0.45), inset 0 0 16px rgba(255,255,255,0.12)`,
          }}
        >
          <span style={{ ...MONO, fontSize: 9, letterSpacing: "0.3em", fontWeight: 600, opacity: 0.65 }}>BONUS</span>
          <span style={{ ...MONO, fontSize: 30, fontWeight: 700, letterSpacing: "0.01em", lineHeight: 1 }}>+50</span>
          <span style={{ ...MONO, fontSize: 8, letterSpacing: "0.24em", fontWeight: 600, opacity: 0.65 }}>TICKETS</span>
        </div>
      </div>
    </div>
  );
}

function ReferralCard() {
  const [copied, setCopied] = useState(false);
  const link = "mujin.app/r/0x89A-4fE1";

  const copyLink = () => {
    try {
      navigator.clipboard?.writeText(`https://${link}`);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="mjn-fade-in"
      style={{
        position: "relative",
        marginBottom: 32,
        background:
          "linear-gradient(135deg, rgba(255,120,73,0.12) 0%, rgba(247,224,138,0.05) 50%, rgba(255,120,73,0.10) 100%)",
        border: `1px solid rgba(255,120,73,0.32)`,
        overflow: "hidden",
        boxShadow: "0 0 50px rgba(255,120,73,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.accent}, ${C.warn}, ${C.accent}, transparent)`,
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(236,235,231,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(236,235,231,0.02) 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 32,
          padding: "28px 32px",
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              ...MONO,
              fontSize: 10,
              color: C.warn,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              marginBottom: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 10px",
              border: `1px solid rgba(247,224,138,0.4)`,
              background: "rgba(247,224,138,0.06)",
            }}
          >
            <TicketIcon size={11} />
            Refer &amp; earn
          </div>
          <h3
            style={{
              ...MONO,
              fontSize: 24,
              fontWeight: 500,
              color: C.text,
              margin: "0 0 10px",
              letterSpacing: "0.02em",
              lineHeight: 1.3,
            }}
          >
            Earn{" "}
            <span
              style={{
                color: C.warn,
                textShadow: "0 0 22px rgba(247,224,138,0.5)",
              }}
            >
              50 raffle tickets
            </span>{" "}
            per friend you invite
          </h3>
          <div
            style={{
              ...MONO,
              fontSize: 12,
              color: C.muted,
              letterSpacing: "0.02em",
              lineHeight: 1.7,
              marginBottom: 22,
              maxWidth: 540,
            }}
          >
            Share your referral link. When a friend creates an account with their Sui wallet, you stack 50 tickets toward the next monthly raffle draw.
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Btn primary onClick={copyLink}>
              {copied ? "✓ Link copied" : "↗ Copy referral link"}
            </Btn>
            <div
              style={{
                ...MONO,
                fontSize: 11,
                color: C.muted,
                letterSpacing: "0.04em",
                padding: "9px 12px",
                border: `1px solid ${C.border}`,
                background: "rgba(5,4,3,0.35)",
                userSelect: "all",
              }}
            >
              {link}
            </div>
          </div>
        </div>
        <ReferralGraphic />
      </div>
    </div>
  );
}

function Dashboard({ setScreen }) {
  const [filter, setFilter] = useState("all");
  const [range, setRange] = useState("30d");
  const filtered = filter === "all" ? POOLS : POOLS.filter((p) => p.type.toLowerCase() === filter);

  const totalPooled = POOLS.reduce((s, p) => s + p.amount, 0);
  const activeDuels = 2;
  const winRate = 72;

  return (
    <>
      <PageHeader
        title="Dashboard"
        range={range}
        setRange={setRange}
        banner={
          <Banner tone="accent" onDismiss={() => {}}>
            2 active duels in progress — Summer trip '26 and Tokyo '27
          </Banner>
        }
      >
        <Btn primary onClick={() => setScreen("create")}>+ New pool</Btn>
      </PageHeader>

      <div style={{ padding: 32 }} className="mjn-fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Label style={{ fontSize: 14, letterSpacing: "0.16em", color: C.text }}>Overview</Label>
          <span style={{ ...MONO, fontSize: 10, color: C.dim, letterSpacing: "0.15em" }}>
            Last 30 days
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <StatCard index={0} label="Total pooled" value={totalPooled} sub="SUI" spark={[2000, 5000, 8000, 11000, 14000, 17000, 20000, 22000, 23000, 24000, 24320]} sparkColor={C.text} />
          <StatCard index={1} label="Active pools" value={POOLS.length} sub={`of ${POOLS.length}`} spark={[1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5]} sparkColor={C.muted} />
          <StatCard index={2} label="Active duels" value={activeDuels} sub="in progress" spark={[0, 1, 1, 0, 1, 2, 2, 1, 2, 2, 2]} sparkColor={C.accent} accent />
          <StatCard index={3} label="Win rate" value={winRate} sub="%" spark={[40, 50, 55, 60, 58, 65, 68, 70, 72, 72]} sparkColor={C.good} />
        </div>

        <ReferralCard />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Label style={{ fontSize: 14, letterSpacing: "0.16em", color: C.text }}>My pools · {filtered.length}</Label>
          <div style={{ display: "inline-flex", border: `1px solid ${C.border}`, padding: 2 }}>
            {["all", "owned", "joined"].map((t) => {
              const active = filter === t;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  style={{
                    ...MONO,
                    background: active ? C.panelHi : "transparent",
                    color: active ? C.text : C.muted,
                    border: "none",
                    padding: "5px 12px",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12,
            marginBottom: 40,
          }}
        >
          {filtered.map((p, i) => (
            <PoolCard key={p.id} pool={p} index={i} onOpen={() => setScreen("pool")} />
          ))}
        </div>

        <div
          className="mjn-fade-in"
          style={{
            animationDelay: "0.3s",
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Label style={{ fontSize: 14, letterSpacing: "0.16em", color: C.text }}>Activity stream</Label>
            <div style={{ display: "flex", gap: 18 }}>
              <span style={{ ...MONO, fontSize: 10, color: C.text, letterSpacing: "0.18em", textTransform: "uppercase", borderBottom: `1px solid ${C.accent}`, paddingBottom: 4 }}>
                All
              </span>
              <span style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>
                Contributions
              </span>
              <span style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>
                Wins
              </span>
            </div>
          </div>
          <ActivityRow index={0} time="2h ago" type="WIN" who="alex" action="won higher_or_lower in Summer trip '26 · +150 SUI" />
          <ActivityRow index={1} time="5h ago" type="ADD" who="maya" action="added 50 SUI to House deposit" />
          <ActivityRow index={2} time="2d ago" type="NEW" who="you" action="created Summer trip '26" />
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Pool Detail

function Countdown() {
  const [t, setT] = useState({ d: 3, h: 14, m: 22, s: 44 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((p) => {
        let { d, h, m, s } = p;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
      {[
        ["d", t.d],
        ["h", t.h],
        ["m", t.m],
        ["s", t.s],
      ].map(([u, v]) => (
        <div key={u}>
          <span style={{ ...MONO, fontSize: 26, color: C.text, letterSpacing: "-0.01em" }}>
            {pad(v)}
          </span>
          <span style={{ ...MONO, fontSize: 11, color: C.muted, letterSpacing: "0.1em", marginLeft: 3 }}>
            {u}
          </span>
        </div>
      ))}
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div style={{ padding: "14px 18px", borderRight: `1px solid ${C.border}`, flex: 1, minWidth: 0 }}>
      <Label style={{ marginBottom: 6 }}>{label}</Label>
      <div
        style={{
          ...MONO,
          fontSize: 13,
          color: C.text,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function TimelineRow({ row, index }) {
  return (
    <div
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.05 * index}s`,
        display: "grid",
        gridTemplateColumns: "auto 110px 1fr 90px",
        gap: 16,
        alignItems: "center",
        padding: "14px 0",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          background: row.accent || C.muted,
          boxShadow: row.accent ? `0 0 8px ${row.accent}55` : "none",
        }}
      />
      <span style={{ ...MONO, fontSize: 11, color: C.muted, letterSpacing: "0.1em" }}>
        {row.who} · {row.when}
      </span>
      <span style={{ ...MONO, fontSize: 12, color: C.text, letterSpacing: "0.02em" }}>
        {row.title}
      </span>
      <div style={{ textAlign: "right" }}>
        <Tag tone={row.tone || "muted"}>{row.status}</Tag>
      </div>
    </div>
  );
}

const CONTRIBUTORS = [
  { id: "you", name: "You", wallet: "0x89A...4fE1", amount: 180, color: "#ff7849", isOwner: true },
  { id: "alex", name: "Alex", wallet: "0x12B...7cC2", amount: 144, color: "#f7e08a" },
  { id: "jordan", name: "Jordan", wallet: "0x88C...9dA3", amount: 126, color: "rgba(255,120,73,0.5)" },
];

function Donut({ contributors, total, size = 220, thickness = 22 }) {
  const center = size / 2;
  const radius = (size - thickness) / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 60);
    return () => clearTimeout(t);
  }, []);

  let cumOffset = 0;
  const segments = contributors.map((c) => {
    const length = (c.amount / total) * circumference;
    const offset = cumOffset;
    cumOffset += length;
    return { ...c, length, offset };
  });

  return (
    <div style={{ position: "relative", display: "inline-block", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke={C.faint} strokeWidth={thickness} />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeLinecap="butt"
            strokeDasharray={`${drawn ? seg.length : 0} ${circumference}`}
            strokeDashoffset={-seg.offset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{
              transition: `stroke-dasharray .9s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s`,
              filter: `drop-shadow(0 0 6px ${seg.color}55)`,
            }}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: size - thickness * 2,
        }}
      >
        <div style={{ ...MONO, fontSize: 9, color: C.muted, letterSpacing: "0.22em", textTransform: "uppercase" }}>
          Total pooled
        </div>
        <div style={{ ...MONO, fontSize: 28, color: C.text, marginTop: 6, letterSpacing: "-0.01em" }}>
          <Ticker value={total} />
        </div>
        <div style={{ ...MONO, fontSize: 9, color: C.accent, letterSpacing: "0.25em", marginTop: 2 }}>SUI</div>
      </div>
    </div>
  );
}

function ContributorRow({ c, total, index }) {
  const pct = Math.round((c.amount / total) * 100);
  return (
    <div
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.08 * index}s`,
        padding: "14px 0",
        borderBottom: index === CONTRIBUTORS.length - 1 ? "none" : `1px solid ${C.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: c.color,
            flexShrink: 0,
            boxShadow: `0 0 6px ${c.color}66`,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em" }}>{c.name}</div>
          <div style={{ ...MONO, fontSize: 10, color: C.muted, marginTop: 2, letterSpacing: "0.06em" }}>
            {c.wallet}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...MONO, fontSize: 13, color: C.text }}>
            <Ticker value={c.amount} />{" "}
            <span style={{ fontSize: 10, color: C.muted, letterSpacing: "0.18em" }}>SUI</span>
          </div>
          <div style={{ ...MONO, fontSize: 10, color: C.muted, marginTop: 2, letterSpacing: "0.04em" }}>{pct}%</div>
        </div>
      </div>
      <div style={{ height: 3, background: C.faint, overflow: "hidden", marginLeft: 22 }}>
        <div className="mjn-bar" style={{ height: "100%", width: `${pct}%`, background: c.color }} />
      </div>
    </div>
  );
}

function ContributionsPanel() {
  const total = CONTRIBUTORS.reduce((s, c) => s + c.amount, 0);
  const top = [...CONTRIBUTORS].sort((a, b) => b.amount - a.amount)[0];
  const topPct = Math.round((top.amount / total) * 100);

  return (
    <div className="mjn-fade-in" style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <h3 style={{ ...MONO, fontSize: 15, fontWeight: 500, color: C.text, margin: 0, letterSpacing: "0.04em" }}>
            Contributions
          </h3>
          <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 4, letterSpacing: "0.02em" }}>
            A clear split of who has added SUI to this pool.
          </div>
        </div>
        <Tag tone="accent">{total} SUI pooled</Tag>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 36,
          alignItems: "center",
          padding: "24px 0 8px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Donut contributors={CONTRIBUTORS} total={total} />
        </div>
        <div>
          {CONTRIBUTORS.map((c, i) => (
            <ContributorRow key={c.id} c={c} total={total} index={i} />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${C.border}`,
          paddingTop: 14,
          marginTop: 8,
        }}
      >
        <Label>Top contributor</Label>
        <span style={{ ...MONO, fontSize: 12, color: C.text, letterSpacing: "0.04em" }}>
          {top.name} <span style={{ color: C.accent }}>{topPct}%</span>
        </span>
      </div>
    </div>
  );
}

function MemberMenu({ m, onClose }) {
  const item = (label, danger) => {
    const [h, setH] = useState(false);
    return (
      <button
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        onClick={onClose}
        style={{
          ...MONO,
          display: "block",
          width: "100%",
          textAlign: "left",
          background: h ? C.panelHi : "transparent",
          border: "none",
          color: danger ? "#ff6b6b" : h ? C.text : C.muted,
          padding: "10px 14px",
          fontSize: 12,
          letterSpacing: "0.04em",
          cursor: "pointer",
          transition: "all .12s",
        }}
      >
        {label}
      </button>
    );
  };
  return (
    <div
      className="mjn-fade-in"
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        right: 0,
        width: 200,
        background: C.bg,
        border: `1px solid ${C.borderHi}`,
        zIndex: 25,
        boxShadow: "0 12px 28px rgba(0,0,0,0.5)",
        padding: 4,
      }}
    >
      {item("Copy wallet address")}
      {!m.isOwner && item("Remove member", true)}
    </div>
  );
}

function MemberRow({ m, index, menuOpen, setMenu }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.05 * index}s`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 18px",
        border: `1px solid ${h || menuOpen ? C.borderHi : C.border}`,
        background: h || menuOpen ? C.panelHi : C.panel,
        marginBottom: 8,
        transition: "all .15s",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          background: C.faint,
          color: C.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...MONO,
          fontSize: 13,
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        {m.name[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em" }}>{m.name}</span>
          {m.isOwner && <Tag>Owner</Tag>}
        </div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, marginTop: 3, letterSpacing: "0.06em" }}>{m.wallet}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ ...MONO, fontSize: 13, color: C.text }}>
          {m.amount} <span style={{ fontSize: 10, color: C.muted, letterSpacing: "0.18em" }}>SUI</span>
        </div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, marginTop: 3, letterSpacing: "0.04em" }}>contributed</div>
      </div>
      <div data-member-menu style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setMenu(!menuOpen)}
          style={{
            width: 30,
            height: 30,
            background: menuOpen ? C.panelHi : "transparent",
            border: `1px solid ${menuOpen ? C.borderHi : "transparent"}`,
            color: menuOpen || h ? C.text : C.muted,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...MONO,
            fontSize: 18,
            transition: "all .12s",
          }}
        >
          ⋮
        </button>
        {menuOpen && <MemberMenu m={m} onClose={() => setMenu(false)} />}
      </div>
    </div>
  );
}

function MembersPanel() {
  const [menu, setMenu] = useState(null);
  const [addr, setAddr] = useState("");

  useEffect(() => {
    const h = (e) => {
      if (!e.target.closest("[data-member-menu]")) setMenu(null);
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "flex-start" }}>
      <div>
        {CONTRIBUTORS.map((m, i) => (
          <MemberRow
            key={m.id}
            m={m}
            index={i}
            menuOpen={menu === m.id}
            setMenu={(v) => setMenu(v ? m.id : null)}
          />
        ))}
      </div>
      <div
        className="mjn-fade-in"
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          padding: 22,
          position: "sticky",
          top: 84,
        }}
      >
        <h3 style={{ ...MONO, fontSize: 15, fontWeight: 500, color: C.text, margin: 0, letterSpacing: "0.04em" }}>
          Add member
        </h3>
        <div
          style={{
            ...MONO,
            fontSize: 11,
            color: C.muted,
            marginTop: 8,
            marginBottom: 18,
            letterSpacing: "0.02em",
            lineHeight: 1.55,
          }}
        >
          Invite others to join the pool via wallet address.
        </div>
        <div style={{ marginBottom: 14 }}>
          <TextInput value={addr} onChange={setAddr} placeholder="Address or alias" />
        </div>
        <button
          onClick={() => setAddr("")}
          style={{
            ...MONO,
            width: "100%",
            padding: "12px",
            background: C.accent,
            color: C.bg,
            border: `1px solid ${C.accent}`,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontWeight: 500,
            transition: "opacity .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.92)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
        >
          Invite
        </button>
      </div>
    </div>
  );
}

function FeeLine({ label, value, sub, highlight, bold, dim }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
        ...MONO,
        fontSize: sub ? 11 : 12,
        letterSpacing: "0.02em",
        alignItems: "baseline",
      }}
    >
      <span style={{ color: dim ? C.dim : sub ? C.muted : C.muted }}>{label}</span>
      <span style={{ color: highlight ? C.accent : sub ? C.text : C.text, fontWeight: bold ? 500 : 400 }}>
        {value}
      </span>
    </div>
  );
}

function ContributePanel({ remaining, poolTotal, onClose, onConfirm }) {
  const [amount, setAmount] = useState(Math.min(100, remaining));
  const safe = Math.max(0, Math.min(remaining, amount));
  const mujinFee = +(safe * 0.01).toFixed(3);
  const gasFee = 0.002;
  const poolReceives = +(safe - mujinFee).toFixed(3);
  const youPay = +(safe + gasFee).toFixed(3);

  return (
    <div
      className="mjn-fade-in"
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        padding: 28,
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          opacity: 0.55,
        }}
      />

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ ...MONO, fontSize: 18, fontWeight: 500, color: C.text, margin: 0, letterSpacing: "0.02em" }}>
          Make a contribution
        </h2>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 6, letterSpacing: "0.02em", lineHeight: 1.55 }}>
          SUI will be transferred directly to the verified destination once the target is hit.
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "baseline" }}>
          <Label>Amount</Label>
          <span style={{ ...MONO, fontSize: 14, color: C.accent, letterSpacing: "0.04em" }}>
            <Ticker value={safe} /> SUI
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="range"
            min="1"
            max={remaining}
            value={safe}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 999,
              background: `linear-gradient(to right, ${C.accent} 0%, ${C.accent} ${(safe / remaining) * 100}%, rgba(236,235,231,0.1) ${(safe / remaining) * 100}%, rgba(236,235,231,0.1) 100%)`,
            }}
          />
          <input
            type="number"
            value={safe}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              setAmount(isNaN(v) ? 0 : Math.min(remaining, Math.max(0, v)));
            }}
            style={{
              ...MONO,
              width: 90,
              background: C.bg,
              border: `1px solid ${C.borderHi}`,
              outline: "none",
              color: C.text,
              padding: "10px 12px",
              fontSize: 14,
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ ...MONO, fontSize: 10, color: C.dim, letterSpacing: "0.1em" }}>0</span>
          <span style={{ ...MONO, fontSize: 10, color: C.dim, letterSpacing: "0.1em" }}>
            Max {remaining} (target hit)
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[25, 50, 100, 250].filter((v) => v <= remaining).map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              style={{
                ...MONO,
                background: safe === v ? C.panelHi : "transparent",
                border: `1px solid ${safe === v ? C.borderHi : C.border}`,
                color: safe === v ? C.text : C.muted,
                padding: "6px 14px",
                fontSize: 11,
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all .12s",
              }}
            >
              {v} SUI
            </button>
          ))}
          <button
            onClick={() => setAmount(remaining)}
            style={{
              ...MONO,
              background: safe === remaining ? C.panelHi : "transparent",
              border: `1px solid ${safe === remaining ? C.borderHi : C.border}`,
              color: safe === remaining ? C.accent : C.muted,
              padding: "6px 14px",
              fontSize: 11,
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all .12s",
            }}
          >
            Max
          </button>
        </div>
      </div>

      <div
        style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          padding: "14px 18px",
          marginBottom: 20,
        }}
      >
        <Label style={{ marginBottom: 10 }}>Transaction breakdown</Label>
        <FeeLine label="Your contribution" value={`${safe} SUI`} />
        <FeeLine label="Mujin fee · 1%" value={`− ${mujinFee} SUI`} sub dim />
        <FeeLine label="Network gas · est." value={`+ ${gasFee} SUI`} sub dim />
        <div style={{ borderTop: `1px dashed ${C.border}`, marginTop: 10, paddingTop: 10 }}>
          <FeeLine label="Pool receives" value={`${poolReceives} SUI`} highlight bold />
          <FeeLine label="You pay from wallet" value={`${youPay} SUI`} bold />
        </div>
        <div
          style={{
            ...MONO,
            fontSize: 10,
            color: C.dim,
            marginTop: 10,
            letterSpacing: "0.04em",
            lineHeight: 1.5,
          }}
        >
          Gas fees are paid to the Sui network. Mujin fees fund app development.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onClose}
          style={{
            ...MONO,
            flex: 1,
            padding: "12px",
            background: "transparent",
            color: C.muted,
            border: `1px solid ${C.border}`,
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = C.text;
            e.currentTarget.style.borderColor = C.borderHi;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = C.muted;
            e.currentTarget.style.borderColor = C.border;
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => safe > 0 && onConfirm(safe, poolReceives, youPay)}
          disabled={safe <= 0}
          style={{
            ...MONO,
            flex: 2,
            padding: "12px",
            background: C.accent,
            color: C.bg,
            border: `1px solid ${C.accent}`,
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: safe > 0 ? "pointer" : "not-allowed",
            fontWeight: 500,
            opacity: safe > 0 ? 1 : 0.4,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => safe > 0 && (e.currentTarget.style.opacity = 0.92)}
          onMouseLeave={(e) => safe > 0 && (e.currentTarget.style.opacity = 1)}
        >
          Confirm deposit · {youPay} SUI
        </button>
      </div>
    </div>
  );
}

function SuccessToast({ amount, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className="mjn-fade-in"
      style={{
        background: "rgba(127,176,105,0.06)",
        border: `1px solid rgba(127,176,105,0.4)`,
        padding: "14px 20px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          background: C.good,
          color: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        ✓
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em" }}>
          Contribution confirmed
        </div>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 2, letterSpacing: "0.02em" }}>
          {amount} SUI added to Summer trip '26.
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          ...MONO,
          background: "transparent",
          border: "none",
          color: C.muted,
          cursor: "pointer",
          fontSize: 14,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

function PoolDetail({ setScreen, activeDuel, setActiveDuel, poolTotal, setPoolTotal, addRaffleTickets }) {
  const [tab, setTab] = useState("activity");
  const [openDesc, setOpenDesc] = useState(false);
  const [range, setRange] = useState("30d");
  const [contributing, setContributing] = useState(false);
  const [successAmt, setSuccessAmt] = useState(null);
  const target = 1200;
  const remaining = Math.max(1, target - poolTotal);
  const pct = ((poolTotal / target) * 100).toFixed(1);

  return (
    <>
      <PageHeader
        title="Summer trip '26"
        breadcrumbs="Pools / Summer trip '26"
        range={range}
        setRange={setRange}
      >
        <Btn onClick={() => setScreen("duel")} accent={C.accent}>⚔ Start duel</Btn>
        <Btn primary onClick={() => setContributing((c) => !c)}>
          {contributing ? "Close panel" : "+ Contribute"}
        </Btn>
      </PageHeader>

      <div style={{ padding: 32 }} className="mjn-fade-in">
        {successAmt !== null && (
          <SuccessToast amount={successAmt} onClose={() => setSuccessAmt(null)} />
        )}

        {contributing && (
          <ContributePanel
            remaining={remaining}
            poolTotal={poolTotal}
            onClose={() => setContributing(false)}
            onConfirm={(amt, poolReceives) => {
              setPoolTotal((t) => +(t + poolReceives).toFixed(2));
              if (addRaffleTickets) addRaffleTickets(amt, "Summer trip '26");
              setContributing(false);
              setSuccessAmt(poolReceives);
            }}
          />
        )}

        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            marginBottom: 24,
          }}
        >
          <div style={{ padding: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Label style={{ marginBottom: 12 }}>Total pooled</Label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ ...MONO, fontSize: 52, fontWeight: 400, color: C.text, letterSpacing: "-0.02em" }}>
                  <Ticker value={Math.round(poolTotal)} />
                </span>
                <span style={{ ...MONO, fontSize: 13, color: C.muted, letterSpacing: "0.2em" }}>SUI</span>
              </div>
              <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 6, letterSpacing: "0.05em" }}>
                Target {target.toLocaleString()} · {pct}% complete
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Label style={{ marginBottom: 12 }}>Time remaining</Label>
              <Countdown />
            </div>
          </div>

          <div style={{ padding: "0 28px 24px" }}>
            <Bar value={poolTotal} total={target} height={4} />
          </div>

          <div style={{ display: "flex", borderTop: `1px solid ${C.border}` }}>
            <Meta label="Destination" value="save_the_children" />
            <Meta label="Wallet" value="0x9c3A...b4f1" />
            <Meta label="Visibility" value="Public" />
            <Meta label="Members" value="3 active" />
            <Meta label="Deadline" value="14 May 2026" />
          </div>

          <button
            onClick={() => setOpenDesc(!openDesc)}
            style={{
              ...MONO,
              width: "100%",
              padding: "12px 28px",
              background: "transparent",
              border: "none",
              borderTop: `1px solid ${C.border}`,
              color: C.muted,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              textAlign: "left",
            }}
          >
            <span style={{ transform: openDesc ? "rotate(90deg)" : "rotate(0)", transition: "transform .2s", display: "inline-block" }}>›</span>
            Description
          </button>
          <div
            style={{
              ...MONO,
              fontSize: 12,
              color: C.muted,
              lineHeight: 1.7,
              padding: openDesc ? "0 28px 20px 44px" : "0 28px 0 44px",
              maxHeight: openDesc ? 200 : 0,
              overflow: "hidden",
              transition: "all .25s ease",
            }}
          >
            Group savings pool for our annual summer trip. Contribute when you can, and use higher_or_lower duels to wager fun amounts among members. Funds release on deadline to the save_the_children wallet.
          </div>
        </div>

        {activeDuel && (
          <DuelPendingCard
            duel={activeDuel}
            onClear={() => setActiveDuel(null)}
            onPlay={() => setScreen("duel-play")}
          />
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              ["activity", "Activity"],
              ["contributions", "Contributions"],
              ["members", "Members"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  ...MONO,
                  background: "transparent",
                  border: "none",
                  color: tab === id ? C.text : C.muted,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  padding: "8px 0",
                  borderBottom: `1px solid ${tab === id ? C.accent : "transparent"}`,
                  transition: "all .15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <Btn>Settings</Btn>
        </div>

        <div key={tab} className="mjn-fade-in">
          {tab === "activity" && (
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 24 }}>
              <TimelineRow
                index={0}
                row={{
                  who: "alex",
                  when: "2 days ago",
                  title: "Won higher_or_lower duel · +150 SUI",
                  status: "Completed",
                  tone: "accent",
                  accent: C.accent,
                }}
              />
              <TimelineRow
                index={1}
                row={{
                  who: "alex",
                  when: "2h ago",
                  title: "Won a duel in Summer trip '26",
                  status: "Resolved",
                  tone: "accent",
                  accent: C.accent,
                }}
              />
              <TimelineRow
                index={2}
                row={{
                  who: "maya",
                  when: "5h ago",
                  title: "Added 50 SUI to House deposit",
                  status: "Added",
                  tone: "muted",
                }}
              />
              <TimelineRow
                index={3}
                row={{
                  who: "you",
                  when: "2d ago",
                  title: "Created pool Summer trip '26",
                  status: "Added",
                  tone: "muted",
                }}
              />
            </div>
          )}
          {tab === "contributions" && <ContributionsPanel />}
          {tab === "members" && <MembersPanel />}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Duel Setup

function StepRow({ steps, active }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
      {steps.map((s, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={s} style={{ flex: 1 }}>
            <div
              style={{
                height: 2,
                background: done || current ? C.accent : C.faint,
                marginBottom: 10,
                transition: "all .3s",
              }}
            />
            <div
              style={{
                ...MONO,
                fontSize: 10,
                letterSpacing: "0.22em",
                color: current ? C.text : done ? C.muted : C.dim,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: current ? C.accent : C.dim }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{s}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PLAYERS = [
  { id: 1, name: "alex", wallet: "0x128...7cC2", added: 35, w: 1, l: 0 },
  { id: 2, name: "jordan", wallet: "0x88C...9dA3", added: 24, w: 0, l: 1 },
  { id: 3, name: "maya", wallet: "0x4A1...0eF8", added: 18, w: 2, l: 1 },
  { id: 4, name: "ren", wallet: "0xB72...4cD9", added: 12, w: 0, l: 0 },
];

function PlayerRow({ p, selected, onToggle, index }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.04 * index}s`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        border: `1px solid ${selected ? C.accentSoft : h ? C.borderHi : C.border}`,
        background: selected ? C.accentFaint : h ? C.panelHi : C.panel,
        cursor: "pointer",
        marginBottom: 6,
        transition: "all .12s",
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          border: `1px solid ${selected ? C.accent : C.borderHi}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {selected && (
          <span style={{ width: 6, height: 6, background: C.accent }} />
        )}
      </span>
      <div
        style={{
          width: 28,
          height: 28,
          background: C.faint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...MONO,
          fontSize: 11,
          color: C.text,
          textTransform: "uppercase",
        }}
      >
        {p.name[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em" }}>{p.name}</div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.08em", marginTop: 2 }}>
          {p.wallet}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ ...MONO, fontSize: 12, color: selected ? C.accent : C.text }}>
          {p.added} <span style={{ color: C.muted, fontSize: 10, letterSpacing: "0.15em" }}>SUI</span>
        </div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.1em", marginTop: 2 }}>
          {p.w}W / {p.l}L
        </div>
      </div>
    </div>
  );
}

const DUEL_GAMES = [
  { id: "higher_or_lower", name: "Higher or Lower", description: "Draw the next card and call whether it lands higher or lower.", icon: "♠" },
  { id: "pick_a_card", name: "Pick a Card", description: "Each player draws a hidden card. Highest card ranks first.", icon: "✦" },
  { id: "spin_match", name: "Spin Match", description: "Each player spins. Highest multiplier ranks first.", icon: "↻" },
  { id: "number_rush", name: "Number Rush", description: "Closest guess to the hidden number ranks first.", icon: "#" },
];

const POOL_TARGET_AMT = 1200;
const POOL_CURRENT_AMT = 450;

const WARN_SOFT = "rgba(247,224,138,0.4)";
const WARN_FAINT = "rgba(247,224,138,0.06)";
const WARN_BORDER = "rgba(247,224,138,0.3)";

function DuelStepPlayers({ selected, toggle, setAll, query, setQuery }) {
  const filtered = PLAYERS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.wallet.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ ...MONO, fontSize: 15, fontWeight: 500, letterSpacing: "0.04em", margin: 0, color: C.text }}>
          Invite members
        </h2>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 6, letterSpacing: "0.02em" }}>
          Pick who's joining the duel. Everyone you invite has to accept before it starts.
        </div>
      </div>

      <Label style={{ marginBottom: 8 }}>Search</Label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name or wallet address"
          style={{
            ...MONO,
            flex: 1,
            background: C.bg,
            border: `1px solid ${C.border}`,
            outline: "none",
            color: C.text,
            padding: "10px 14px",
            fontSize: 13,
            letterSpacing: "0.02em",
          }}
          onFocus={(e) => (e.target.style.borderColor = C.borderHi)}
          onBlur={(e) => (e.target.style.borderColor = C.border)}
        />
        <Btn onClick={setAll}>Select all</Btn>
      </div>

      <div
        style={{
          ...MONO,
          fontSize: 11,
          color: C.muted,
          letterSpacing: "0.06em",
          padding: "10px 14px",
          border: `1px solid ${C.border}`,
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          <span style={{ color: C.warn }}>{selected.size + 1}</span> players selected, including you
        </span>
        <span style={{ color: C.dim, letterSpacing: "0.1em" }}>
          {filtered.length} match{filtered.length !== 1 ? "es" : ""}
        </span>
      </div>

      <div>
        {filtered.map((p, i) => (
          <PlayerRow key={p.id} p={p} index={i} selected={selected.has(p.id)} onToggle={() => toggle(p.id)} />
        ))}
      </div>
    </div>
  );
}

function ModeCard({ active, onClick, title, desc }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "14px 16px",
        border: `1px solid ${active ? C.warn : h ? C.borderHi : C.border}`,
        background: active ? WARN_FAINT : h ? C.panelHi : C.bg,
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      <div style={{ ...MONO, fontSize: 13, fontWeight: 500, color: C.text, letterSpacing: "0.02em" }}>{title}</div>
      <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 4, letterSpacing: "0.02em" }}>{desc}</div>
    </div>
  );
}

function StatTile({ label, value, highlight }) {
  return (
    <div style={{ padding: "12px 14px", border: `1px solid ${highlight ? WARN_BORDER : C.border}`, background: highlight ? WARN_FAINT : C.bg }}>
      <Label style={{ marginBottom: 4 }}>{label}</Label>
      <div style={{ ...MONO, fontSize: 13, color: highlight ? C.warn : C.text, letterSpacing: "0.02em" }}>{value}</div>
    </div>
  );
}

function DuelStepAmount({ stakeMode, setStakeMode, stake, setStake, poolNeeds, winnerPays, othersPay, poolReceives }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 28 }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ ...MONO, fontSize: 15, fontWeight: 500, margin: 0, color: C.text, letterSpacing: "0.04em" }}>
          Set the stake
        </h2>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 6, letterSpacing: "0.02em" }}>
          Choose how much SUI the pool receives from this duel.
        </div>
      </div>

      <div
        style={{
          padding: "12px 14px",
          border: `1px solid ${C.border}`,
          background: C.bg,
          marginBottom: 16,
          ...MONO,
          fontSize: 12,
          color: C.muted,
          letterSpacing: "0.02em",
        }}
      >
        This pool needs <span style={{ color: C.text, fontWeight: 500 }}>{poolNeeds} SUI</span> to reach its target.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        <ModeCard
          active={stakeMode === "target"}
          onClick={() => { setStakeMode("target"); setStake(String(poolNeeds)); }}
          title="Reach pool target"
          desc={`${poolNeeds} SUI needed`}
        />
        <ModeCard
          active={stakeMode === "custom"}
          onClick={() => setStakeMode("custom")}
          title="Custom amount"
          desc="Choose a stake that fits this duel."
        />
      </div>

      <Label style={{ marginBottom: 8 }}>Stake</Label>
      <TextInput value={stake} onChange={setStake} suffix="SUI" large />

      <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 12, letterSpacing: "0.02em" }}>
        If you win, you pay <span style={{ color: C.text }}>{winnerPays} SUI</span>. If you do not win, you pay <span style={{ color: C.text }}>{othersPay.toFixed(0)} SUI</span>.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 18 }}>
        <StatTile label="Winner pays" value={`${winnerPays} SUI`} />
        <StatTile label="Others pay" value={`${othersPay.toFixed(0)} SUI each`} />
        <StatTile label="Pool receives" value={`${poolReceives} SUI`} highlight />
      </div>
    </div>
  );
}

function GameCard({ g, active, onClick, index }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.04 * index}s`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 18px",
        border: `1px solid ${active ? C.warn : h ? C.borderHi : C.border}`,
        background: active ? WARN_FAINT : h ? C.panelHi : C.bg,
        cursor: "pointer",
        marginBottom: 8,
        transition: "all .15s",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          background: active ? "rgba(247,224,138,0.18)" : C.faint,
          color: active ? C.warn : C.muted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...MONO,
          fontSize: 16,
          flexShrink: 0,
          transition: "all .15s",
        }}
      >
        {g.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...MONO, fontSize: 13, fontWeight: 500, color: C.text, letterSpacing: "0.02em" }}>{g.name}</div>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 4, letterSpacing: "0.02em" }}>{g.description}</div>
      </div>
    </div>
  );
}

function DuelStepGame({ game, setGame }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 28 }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ ...MONO, fontSize: 15, fontWeight: 500, margin: 0, color: C.text, letterSpacing: "0.04em" }}>
          Choose duel game
        </h2>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 6, letterSpacing: "0.02em" }}>
          Pick the mini-game that decides the result.
        </div>
      </div>
      {DUEL_GAMES.map((g, i) => (
        <GameCard key={g.id} g={g} active={game === g.id} onClick={() => setGame(g.id)} index={i} />
      ))}
    </div>
  );
}

function ReviewLine({ label, value, last }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 18px",
        borderBottom: last ? "none" : `1px solid rgba(247,224,138,0.12)`,
        ...MONO,
        fontSize: 12,
        letterSpacing: "0.02em",
      }}
    >
      <span style={{ color: C.muted }}>{label}</span>
      <span style={{ color: C.text }}>{value}</span>
    </div>
  );
}

function DuelStepReview({ playerObjs, game, stakeNum, winnerPays, othersPay, poolReceives, canCompletePool, poolNeeds }) {
  const gameData = DUEL_GAMES.find((g) => g.id === game);
  const playerNames = ["You", ...playerObjs.map((p) => p.name[0].toUpperCase() + p.name.slice(1))].join(", ");

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 28 }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ ...MONO, fontSize: 15, fontWeight: 500, margin: 0, color: C.text, letterSpacing: "0.04em" }}>
          Review duel
        </h2>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 6, letterSpacing: "0.02em" }}>
          Check who's joining and how the duel pot works.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 22 }}>
        <StatTile label="Winner pays" value={`${winnerPays} SUI`} />
        <StatTile label="Others pay" value={`${othersPay.toFixed(0)} SUI each`} />
        <StatTile label="Pool receives" value={`${poolReceives} SUI`} highlight />
      </div>

      <div style={{ background: WARN_FAINT, border: `1px solid ${WARN_BORDER}`, marginBottom: 18 }}>
        <ReviewLine label="Pool" value="Summer trip '26" />
        <ReviewLine label="Players" value={playerNames} />
        <ReviewLine label="Game" value={gameData.name} />
        <ReviewLine label="Pool receives" value={`${poolReceives} SUI`} last />

        <div style={{ padding: "14px 18px", borderTop: `1px solid ${WARN_BORDER}` }}>
          <Label style={{ marginBottom: 10 }}>Payment split</Label>
          <div style={{ display: "flex", justifyContent: "space-between", ...MONO, fontSize: 11, color: C.muted, letterSpacing: "0.02em", padding: "4px 0" }}>
            <span>Winner pays</span>
            <span style={{ color: C.text }}>{winnerPays} SUI</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...MONO, fontSize: 11, color: C.muted, letterSpacing: "0.02em", padding: "4px 0" }}>
            <span>Others pay</span>
            <span style={{ color: C.text }}>{othersPay.toFixed(0)} SUI each</span>
          </div>
        </div>
      </div>

      <div
        style={{
          ...MONO,
          fontSize: 12,
          color: C.warn,
          padding: "10px 14px",
          border: `1px solid ${WARN_BORDER}`,
          background: WARN_FAINT,
          letterSpacing: "0.04em",
          marginBottom: 14,
        }}
      >
        All SUI goes into this pool.
      </div>

      <div style={{ ...MONO, fontSize: 11, color: C.muted, letterSpacing: "0.02em", lineHeight: 1.6 }}>
        This pool needs {poolNeeds} SUI. The pool receives {poolReceives} SUI from this duel.{" "}
        {canCompletePool && <span style={{ color: C.text, fontWeight: 500 }}>This duel can complete the pool target.</span>}
      </div>
    </div>
  );
}

function DuelSetup({ setScreen, setActiveDuel }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(new Set([1, 2]));
  const [query, setQuery] = useState("");
  const [stakeMode, setStakeMode] = useState("target");
  const poolNeeds = POOL_TARGET_AMT - POOL_CURRENT_AMT;
  const [stake, setStake] = useState(String(poolNeeds));
  const [game, setGame] = useState("higher_or_lower");

  const playerObjs = PLAYERS.filter((p) => selected.has(p.id));
  const totalPlayers = playerObjs.length + 1;
  const stakeNum = parseFloat(stake) || 0;
  const winnerPays = 0;
  const othersPay = totalPlayers > 1 ? stakeNum / (totalPlayers - 1) : 0;
  const poolReceives = stakeNum;
  const canCompletePool = stakeNum >= poolNeeds;

  const STEPS = ["players", "amount", "game", "review"];
  const isLast = step === STEPS.length - 1;
  const stepKey = STEPS[step];
  const canAdvance = step === 0 ? selected.size > 0 : true;

  const toggle = (id) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const next = () => {
    if (!canAdvance) return;
    if (isLast) {
      const gameData = DUEL_GAMES.find((g) => g.id === game);
      setActiveDuel({
        game: gameData.name,
        gameId: game,
        stake: stakeNum,
        winnerPays,
        othersPay,
        poolReceives,
        players: [
          { id: "you", name: "you", accepted: true },
          ...playerObjs.map((p) => ({ id: p.id, name: p.name, accepted: false })),
        ],
        sentAt: Date.now(),
      });
      setScreen("duel-sent");
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => {
    if (step === 0) setScreen("pool");
    else setStep((s) => s - 1);
  };

  return (
    <>
      <PageHeader title="Start duel" breadcrumbs="Pools / Summer trip '26 / Duel">
        <Btn onClick={() => setScreen("pool")}>Cancel</Btn>
      </PageHeader>

      <div style={{ padding: 32, maxWidth: 880, margin: "0 auto" }} className="mjn-fade-in">
        <StepRow steps={["Players", "Amount", "Game", "Review"]} active={step} />

        <div key={step} className="mjn-fade-in" style={{ marginBottom: 24 }}>
          {stepKey === "players" && (
            <DuelStepPlayers
              selected={selected}
              toggle={toggle}
              setAll={() => setSelected(new Set(PLAYERS.map((p) => p.id)))}
              query={query}
              setQuery={setQuery}
            />
          )}
          {stepKey === "amount" && (
            <DuelStepAmount
              stakeMode={stakeMode}
              setStakeMode={setStakeMode}
              stake={stake}
              setStake={setStake}
              poolNeeds={poolNeeds}
              winnerPays={winnerPays}
              othersPay={othersPay}
              poolReceives={poolReceives}
            />
          )}
          {stepKey === "game" && <DuelStepGame game={game} setGame={setGame} />}
          {stepKey === "review" && (
            <DuelStepReview
              playerObjs={playerObjs}
              game={game}
              stakeNum={stakeNum}
              winnerPays={winnerPays}
              othersPay={othersPay}
              poolReceives={poolReceives}
              canCompletePool={canCompletePool}
              poolNeeds={poolNeeds}
            />
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Btn onClick={back}>← Back</Btn>
          <Btn primary accent={C.warn} onClick={next}>
            {isLast ? "Send duel invite →" : "Next →"}
          </Btn>
        </div>
      </div>
    </>
  );
}

function DuelSent({ setScreen }) {
  useEffect(() => {
    const t = setTimeout(() => setScreen("pool"), 2200);
    return () => clearTimeout(t);
  }, [setScreen]);

  return (
    <div style={{ padding: "140px 32px", textAlign: "center" }} className="mjn-fade-in">
      <AmberCircle style={{ animation: "mjnPop .55s cubic-bezier(.2,1.4,.4,1) both" }}>
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          style={{
            display: "block",
            transform: "scale(0)",
            animation: "mjnTickPop .4s cubic-bezier(.2,1.4,.4,1) .3s forwards",
          }}
        >
          <path
            d="M11 22 L19 30 L33 14"
            stroke="#131211"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </AmberCircle>
      <h1
        style={{
          ...MONO,
          fontSize: 24,
          fontWeight: 500,
          color: C.text,
          margin: "24px 0 8px",
          letterSpacing: "0.04em",
        }}
      >
        Invite sent
      </h1>
      <div style={{ ...MONO, fontSize: 12, color: C.muted, letterSpacing: "0.04em" }}>
        Returning to Summer trip '26.
      </div>
    </div>
  );
}

function RaffleDraw({ setScreen, totalTickets }) {
  const [phase, setPhase] = useState("intro");
  const [currentWallet, setCurrentWallet] = useState(MOCK_RAFFLE_WALLETS[0]);
  const [winners, setWinners] = useState([]);
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [stopped, setStopped] = useState(false);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  const drawNext = (idx) => {
    setStopped(false);
    setWinnerIndex(idx);
    let cycles = 0;
    let i = Math.floor(Math.random() * MOCK_RAFFLE_WALLETS.length);

    const tick = () => {
      setCurrentWallet(MOCK_RAFFLE_WALLETS[i % MOCK_RAFFLE_WALLETS.length]);
      i++;
      cycles++;

      let speed;
      if (cycles < 30) speed = 55;
      else if (cycles < 50) speed = 95;
      else if (cycles < 65) speed = 180;
      else if (cycles < 73) speed = 340;
      else if (cycles < 78) speed = 600;
      else {
        // Stop on a random winner (not already won)
        const taken = new Set(winners.map((w) => w.wallet));
        const pool = MOCK_RAFFLE_WALLETS.filter((w) => !taken.has(w));
        const winner = pool[Math.floor(Math.random() * pool.length)];
        setCurrentWallet(winner);
        setStopped(true);
        setWinners((prev) => [...prev, { wallet: winner, prize: RAFFLE_PRIZES[idx], rank: idx + 1 }]);
        const t = setTimeout(() => {
          if (idx < 2) drawNext(idx + 1);
          else setPhase("complete");
        }, 2600);
        timeoutsRef.current.push(t);
        return;
      }

      const t = setTimeout(tick, speed);
      timeoutsRef.current.push(t);
    };

    tick();
  };

  const startDraw = () => {
    setPhase("drawing");
    setWinners([]);
    drawNext(0);
  };

  if (phase === "intro") {
    return (
      <div className="mjn-fade-in" style={{ padding: "80px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div
            style={{
              ...MONO,
              fontSize: 10,
              color: C.warn,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Mujin Monthly Raffle
          </div>
          <h1
            style={{
              ...MONO,
              fontSize: 36,
              fontWeight: 500,
              color: C.text,
              margin: "0 0 14px",
              letterSpacing: "0.02em",
            }}
          >
            Live draw
          </h1>
          <div style={{ ...MONO, fontSize: 13, color: C.muted, letterSpacing: "0.02em", lineHeight: 1.6, marginBottom: 36 }}>
            Three winners will be drawn from the global ticket pool. Prizes go to wallets, automatically.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 36,
              maxWidth: 480,
              margin: "0 auto 36px",
            }}
          >
            {RAFFLE_PRIZES.map((p, i) => (
              <div
                key={i}
                className="mjn-fade-in"
                style={{
                  animationDelay: `${0.1 * i}s`,
                  background: C.panel,
                  border: `1px solid rgba(247,224,138,0.35)`,
                  padding: "18px 14px",
                }}
              >
                <div style={{ ...MONO, fontSize: 11, color: C.text, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>
                  {["First", "Second", "Third"][i]} place
                </div>
                <div style={{ ...MONO, fontSize: 22, color: C.text, letterSpacing: "0.02em" }}>
                  {p} <span style={{ fontSize: 11, color: C.warn, letterSpacing: "0.18em" }}>SUI</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...MONO, fontSize: 11, color: C.muted, marginBottom: 24, letterSpacing: "0.04em" }}>
            Your tickets: <span style={{ color: C.warn }}>{totalTickets}</span> · Pool ticket holders: <span style={{ color: C.text }}>{MOCK_RAFFLE_WALLETS.length}</span>
          </div>

          <AmberBtn onClick={startDraw} big>◆ Begin draw</AmberBtn>
        </div>
      </div>
    );
  }

  if (phase === "drawing") {
    return (
      <div className="mjn-fade-in" style={{ padding: "60px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              ...MONO,
              fontSize: 10,
              color: C.warn,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Drawing winner {winnerIndex + 1} of 3
          </div>
          <div style={{ ...MONO, fontSize: 12, color: C.muted, letterSpacing: "0.02em", marginBottom: 32 }}>
            Prize: <span style={{ color: C.text }}>{RAFFLE_PRIZES[winnerIndex]} SUI</span>
          </div>

          <div
            style={{
              position: "relative",
              padding: "36px 24px",
              background: stopped ? "rgba(247,224,138,0.08)" : C.panel,
              border: `2px solid ${stopped ? C.warn : "rgba(247,224,138,0.25)"}`,
              boxShadow: stopped ? `0 0 60px rgba(247,224,138,0.35)` : "none",
              transition: "all .4s",
              overflow: "hidden",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${C.warn}, transparent)`,
                opacity: stopped ? 1 : 0.6,
                animation: stopped ? "none" : "mjnScanH 1.4s linear infinite",
              }}
            />
            <div
              key={currentWallet}
              style={{
                ...MONO,
                fontSize: 40,
                fontWeight: 600,
                color: stopped ? C.warn : C.text,
                letterSpacing: "0.04em",
                fontVariantNumeric: "tabular-nums",
                animation: stopped ? "mjnPop .4s cubic-bezier(.2,1.4,.4,1)" : "none",
                textShadow: stopped ? `0 0 24px rgba(247,224,138,0.6)` : "none",
                transition: "color .3s",
              }}
            >
              {currentWallet}
            </div>
            {stopped && (
              <div
                className="mjn-fade-in"
                style={{
                  ...MONO,
                  fontSize: 11,
                  color: C.warn,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  marginTop: 14,
                  fontWeight: 600,
                }}
              >
                ★ Winner ★
              </div>
            )}
          </div>

          {winners.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Label style={{ marginBottom: 12 }}>Winners so far</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {winners.map((w, i) => (
                  <div
                    key={w.wallet}
                    className="mjn-fade-in"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 18px",
                      background: C.panel,
                      border: `1px solid rgba(247,224,138,0.35)`,
                      ...MONO,
                      fontSize: 13,
                      letterSpacing: "0.02em",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          background: C.warn,
                          color: C.bg,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {w.rank}
                      </span>
                      <span style={{ color: C.text }}>{w.wallet}</span>
                    </span>
                    <span style={{ color: C.warn, fontWeight: 500 }}>{w.prize} SUI</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="mjn-fade-in" style={{ padding: "60px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div
            style={{
              ...MONO,
              fontSize: 10,
              color: C.warn,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Raffle complete
          </div>
          <h1
            style={{
              ...MONO,
              fontSize: 32,
              fontWeight: 500,
              color: C.text,
              margin: "0 0 12px",
              letterSpacing: "0.02em",
            }}
          >
            3 winners drawn
          </h1>
          <div style={{ ...MONO, fontSize: 12, color: C.muted, letterSpacing: "0.02em", marginBottom: 36 }}>
            Prizes will be sent to winning wallets within the next hour.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {winners.map((w, i) => (
              <div
                key={w.wallet}
                className="mjn-fade-in"
                style={{
                  animationDelay: `${0.15 * i}s`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: i === 0 ? "20px 22px" : "18px 22px",
                  background: i === 0 ? "rgba(247,224,138,0.12)" : "rgba(247,224,138,0.05)",
                  border: i === 0 ? `2px solid ${C.warn}` : `1px solid rgba(247,224,138,0.3)`,
                  ...MONO,
                  fontSize: 15,
                  letterSpacing: "0.02em",
                  boxShadow: i === 0 ? `0 0 36px rgba(247,224,138,0.25), inset 0 0 24px rgba(247,224,138,0.05)` : "none",
                  position: "relative",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      background: C.warn,
                      color: C.bg,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {w.rank}
                  </span>
                  <span style={{ color: C.text, fontSize: 14 }}>{w.wallet}</span>
                </span>
                <span style={{ color: C.warn, fontWeight: 500, fontSize: 17 }}>
                  {w.prize} <span style={{ fontSize: 11, letterSpacing: "0.2em" }}>SUI</span>
                </span>
              </div>
            ))}
          </div>

          <AmberBtn onClick={() => setScreen("dashboard")} big>
            Back to dashboard
          </AmberBtn>
        </div>
      </div>
    );
  }

  return null;
}

function PlayingCard({ value, hidden, label, accent, feedback, animate }) {
  return (
    <div
      style={{
        padding: 18,
        background: accent ? "rgba(247,224,138,0.06)" : C.panel,
        border: `1px solid ${accent ? "rgba(247,224,138,0.4)" : C.border}`,
        transition: "all .25s",
      }}
    >
      <div
        style={{
          ...MONO,
          fontSize: 10,
          color: C.muted,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 14,
        }}
      >
        {label}
      </div>
      <div
        key={animate}
        style={{
          width: 140,
          height: 190,
          margin: "0 auto",
          background: hidden ? "transparent" : "#f5efe2",
          border: `2px solid ${
            feedback === "correct"
              ? C.good
              : feedback === "wrong"
              ? "#ff6b6b"
              : hidden
              ? C.borderHi
              : "#2a2520"
          }`,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          ...(hidden && {
            backgroundImage: `repeating-linear-gradient(45deg, ${C.panel}, ${C.panel} 6px, ${C.panelHi} 6px, ${C.panelHi} 12px)`,
          }),
          animation: animate ? "mjnFlip .35s cubic-bezier(.2,.7,.2,1)" : "none",
          boxShadow:
            feedback === "correct"
              ? `0 0 24px rgba(127,176,105,0.4)`
              : feedback === "wrong"
              ? `0 0 24px rgba(255,107,107,0.4)`
              : "none",
          transition: "box-shadow .25s",
        }}
      >
        {hidden ? (
          <>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: C.faint, marginBottom: 12 }} />
            <div style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.28em" }}>HIDDEN</div>
          </>
        ) : (
          <>
            <div style={{ ...MONO, fontSize: 64, color: "#1a1715", fontWeight: 700, lineHeight: 1 }}>{value}</div>
            <div
              style={{
                position: "absolute",
                bottom: 16,
                ...MONO,
                fontSize: 10,
                color: C.accent,
                letterSpacing: "0.28em",
                fontWeight: 600,
              }}
            >
              SUI
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DuelPlay({ duel, setScreen, setDuelResult }) {
  const [phase, setPhase] = useState("intro");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentCard, setCurrentCard] = useState(7);
  const [nextCard, setNextCard] = useState(13);
  const [revealing, setRevealing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [flipKey, setFlipKey] = useState(0);

  const TOTAL_ROUNDS = 5;

  const draw = () => Math.floor(Math.random() * 13) + 1;
  const cardLabel = (n) => {
    if (!n) return "?";
    if (n === 1) return "A";
    if (n === 11) return "J";
    if (n === 12) return "Q";
    if (n === 13) return "K";
    return String(n);
  };

  const start = () => {
    setCurrentCard(draw());
    setNextCard(draw());
    setPhase("playing");
  };

  const guess = (direction) => {
    if (revealing) return;
    setRevealing(true);
    setFlipKey((k) => k + 1);
    const correct =
      direction === "higher" ? nextCard >= currentCard : nextCard <= currentCard;
    if (correct) setScore((s) => s + 1);
    setFeedback(correct ? "correct" : "wrong");

    setTimeout(() => {
      if (round + 1 >= TOTAL_ROUNDS) {
        setPhase("complete");
      } else {
        const newCurrent = nextCard;
        const newNext = draw();
        setRound((r) => r + 1);
        setCurrentCard(newCurrent);
        setNextCard(newNext);
        setRevealing(false);
        setFeedback(null);
      }
    }, 1900);
  };

  const finalize = () => {
    setDuelResult({ score, didWin: score >= 3 });
    setScreen("duel-result");
  };

  return (
    <div
      className="mjn-fade-in"
      style={{
        padding: "32px 32px 80px",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", width: "100%" }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 36 }}>
          <Tag>Stake: {duel.stake} SUI</Tag>
          <Tag tone="accent" style={{ borderColor: C.warn, color: C.warn }}>
            Winner pays {duel.winnerPays}
          </Tag>
          <Tag>
            Round <span style={{ color: C.warn }}>{Math.min(round + 1, TOTAL_ROUNDS)}</span>/{TOTAL_ROUNDS}
          </Tag>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <PlayingCard label="Current card" value={cardLabel(currentCard)} accent />
          <div style={{ ...MONO, fontSize: 24, color: C.warn }}>→</div>
          <PlayingCard
            label={phase === "intro" ? "Next card" : revealing ? "Next card" : "Next card"}
            value={revealing ? cardLabel(nextCard) : null}
            hidden={!revealing}
            accent={revealing}
            feedback={revealing ? feedback : null}
            animate={flipKey}
          />
        </div>

        {phase === "intro" && (
          <div className="mjn-fade-in">
            <h1
              style={{
                ...MONO,
                fontSize: 28,
                fontWeight: 500,
                color: C.text,
                margin: "0 0 10px",
                letterSpacing: "0.02em",
              }}
            >
              Higher or Lower
            </h1>
            <div style={{ ...MONO, fontSize: 12, color: C.muted, marginBottom: 28, letterSpacing: "0.02em" }}>
              Call whether the next card lands higher or lower.
            </div>
            <AmberBtn onClick={start} big>Start game</AmberBtn>
            <div
              style={{
                ...MONO,
                fontSize: 11,
                color: C.muted,
                marginTop: 22,
                letterSpacing: "0.02em",
                lineHeight: 1.6,
              }}
            >
              Winner pays {duel.winnerPays}, others pay the split, and the pool receives the full amount.
            </div>
          </div>
        )}

        {phase === "playing" && (
          <div className="mjn-fade-in">
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
              <GuessBtn dir="higher" disabled={revealing} onClick={() => guess("higher")}>
                ↑ Higher
              </GuessBtn>
              <GuessBtn dir="lower" disabled={revealing} onClick={() => guess("lower")}>
                ↓ Lower
              </GuessBtn>
            </div>
            <div
              style={{
                ...MONO,
                fontSize: 12,
                color: C.muted,
                letterSpacing: "0.04em",
              }}
            >
              Score: <span style={{ color: C.warn, fontWeight: 500 }}>{score}</span>
              {feedback && (
                <span
                  className="mjn-fade-in"
                  style={{
                    marginLeft: 16,
                    color: feedback === "correct" ? C.good : "#ff6b6b",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontSize: 10,
                  }}
                >
                  {feedback === "correct" ? "✓ Correct" : "× Wrong"}
                </span>
              )}
            </div>
          </div>
        )}

        {phase === "complete" && (
          <div className="mjn-fade-in">
            <h1
              style={{
                ...MONO,
                fontSize: 32,
                fontWeight: 500,
                color: C.text,
                margin: "0 0 8px",
                letterSpacing: "0.02em",
              }}
            >
              Score: {score}
            </h1>
            <div style={{ ...MONO, fontSize: 12, color: C.muted, letterSpacing: "0.02em", marginBottom: 24 }}>
              Your run is complete.
            </div>
            <div
              style={{
                background: "rgba(247,224,138,0.06)",
                border: `1px solid rgba(247,224,138,0.35)`,
                padding: "22px 28px",
                marginBottom: 24,
                display: "inline-block",
                minWidth: 320,
              }}
            >
              <div
                style={{
                  ...MONO,
                  fontSize: 11,
                  color: C.muted,
                  marginBottom: 8,
                  letterSpacing: "0.04em",
                }}
              >
                All players have finished.
              </div>
              <div style={{ ...MONO, fontSize: 22, fontWeight: 500, color: C.text, marginBottom: 18, letterSpacing: "0.02em" }}>
                Score: {score}/{TOTAL_ROUNDS}
              </div>
              <AmberBtn onClick={finalize} full>View results</AmberBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GuessBtn({ children, onClick, disabled }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        ...MONO,
        padding: "14px 32px",
        background: h && !disabled ? C.warn : "transparent",
        color: h && !disabled ? C.bg : disabled ? C.dim : C.text,
        border: `1px solid ${h && !disabled ? C.warn : disabled ? C.border : C.borderHi}`,
        fontSize: 13,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all .15s",
        fontWeight: 500,
        minWidth: 140,
      }}
    >
      {children}
    </button>
  );
}

function PaymentRow({ name, wallet, isWinner, paid, isYou, delay = 0 }) {
  return (
    <div
      className="mjn-fade-in"
      style={{
        animationDelay: `${delay}s`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        border: `1px solid ${isWinner ? "rgba(247,224,138,0.4)" : C.border}`,
        background: isWinner ? "rgba(247,224,138,0.04)" : C.panel,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          background: isWinner ? C.warn : C.faint,
          color: isWinner ? C.bg : C.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...MONO,
          fontSize: 13,
          textTransform: "uppercase",
          flexShrink: 0,
          fontWeight: 600,
        }}
      >
        {name[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em" }}>{name}</span>
          {isWinner && (
            <span
              style={{
                ...MONO,
                fontSize: 9,
                color: C.bg,
                background: C.warn,
                padding: "2px 8px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Winner
            </span>
          )}
        </div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, marginTop: 3, letterSpacing: "0.06em" }}>{wallet}</div>
      </div>
      <div style={{ ...MONO, fontSize: 14, color: C.text, letterSpacing: "0.02em" }}>
        {paid} <span style={{ fontSize: 10, color: C.warn, letterSpacing: "0.18em" }}>SUI</span>
      </div>
    </div>
  );
}

function DuelResult({ duel, duelResult, setScreen, finishDuel, badges, awardBadge, poolTotal = 450 }) {
  const [showBadge, setShowBadge] = useState(false);
  const [revealedPlayers, setRevealedPlayers] = useState(1);
  const [showPoolBoost, setShowPoolBoost] = useState(false);

  const youWon = duelResult?.didWin ?? true;
  const others = duel.players.filter((p) => p.id !== "you");
  const winnerOpponent = others[0];

  // Stagger the payment row reveals
  useEffect(() => {
    const timers = [];
    duel.players.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealedPlayers(i + 1), 400 * (i + 1)));
    });
    timers.push(setTimeout(() => setShowPoolBoost(true), 400 * duel.players.length + 200));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Check for first-win badge unlock
  useEffect(() => {
    if (youWon) {
      const firstWin = badges.find((b) => b.id === "first_win");
      if (firstWin && !firstWin.earned) {
        const t = setTimeout(() => setShowBadge(true), 400 * duel.players.length + 1400);
        return () => clearTimeout(t);
      }
    }
  }, []);

  const back = () => {
    if (youWon) awardBadge("first_win");
    finishDuel(duel.poolReceives);
    setScreen("pool");
  };

  return (
    <>
      <div style={{ padding: "40px 32px 80px" }} className="mjn-fade-in">
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div
            style={{
              background: "rgba(247,224,138,0.04)",
              border: `1px solid rgba(247,224,138,0.35)`,
              padding: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${C.warn}, transparent)`,
                opacity: 0.7,
              }}
            />

            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div
                style={{
                  ...MONO,
                  fontSize: 11,
                  color: C.warn,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Duel complete
              </div>
              <h1
                style={{
                  ...MONO,
                  fontSize: 30,
                  fontWeight: 500,
                  color: C.text,
                  margin: "0 0 10px",
                  letterSpacing: "0.02em",
                }}
              >
                Pool received <Ticker value={duel.poolReceives} /> SUI.
              </h1>
              <div style={{ ...MONO, fontSize: 13, color: C.muted, letterSpacing: "0.02em" }}>
                {youWon ? `You won ${duel.game}.` : `${winnerOpponent?.name || "Alex"} won ${duel.game}.`}
              </div>
            </div>

            <Label style={{ marginBottom: 12 }}>Member payments</Label>
            <div style={{ marginBottom: 18 }}>
              {duel.players.slice(0, revealedPlayers).map((p, i) => {
                const isYouPlayer = p.id === "you";
                const winnerHere = (youWon && isYouPlayer) || (!youWon && p.id === winnerOpponent?.id);
                const paid = winnerHere ? 0 : Math.round(duel.othersPay);
                return (
                  <PaymentRow
                    key={p.id}
                    name={isYouPlayer ? "You" : p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                    wallet={isYouPlayer ? "0x89A...4fE1" : p.id === 1 ? "0x12B...7cC2" : p.id === 2 ? "0x88C...9dA3" : "0x4A1...0eF8"}
                    isWinner={winnerHere}
                    paid={paid}
                    isYou={isYouPlayer}
                    delay={i * 0.1}
                  />
                );
              })}
            </div>

            {showPoolBoost && (
              <div
                className="mjn-fade-in"
                style={{
                  background: "rgba(247,224,138,0.1)",
                  border: `1px solid ${C.warn}`,
                  padding: "14px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  boxShadow: `0 0 24px rgba(247,224,138,0.15)`,
                }}
              >
                <span style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.04em" }}>Pool boosted</span>
                <span
                  style={{
                    ...MONO,
                    fontSize: 18,
                    color: C.warn,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  +<Ticker value={duel.poolReceives} /> SUI
                </span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
              <StatTile label="Winner pays" value={`${duel.winnerPays} SUI`} />
              <StatTile label="Others pay" value={`${Math.round(duel.othersPay)} SUI each`} />
              <StatTile label="Pool receives" value={`${duel.poolReceives} SUI`} highlight />
            </div>

            <div style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "16px 18px", marginBottom: 24 }}>
              <Label style={{ marginBottom: 8 }}>Updated pool</Label>
              <div style={{ ...MONO, fontSize: 15, color: C.text, marginBottom: 10, letterSpacing: "0.02em" }}>
                <span style={{ color: C.warn }}>
                  <Ticker value={Math.round(poolTotal + duel.poolReceives)} />
                </span>{" "}
                of 1,200 SUI
              </div>
              <Bar value={poolTotal + duel.poolReceives} total={1200} color={C.warn} height={4} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <AmberBtn onClick={back} style={{ flex: 1 }}>Back to pool</AmberBtn>
              <Btn>↗ Share result</Btn>
            </div>
          </div>
        </div>
      </div>

      {showBadge && (
        <BadgeUnlock
          badge={badges.find((b) => b.id === "first_win")}
          onClose={() => setShowBadge(false)}
        />
      )}
    </>
  );
}

function BadgeUnlock({ badge, onClose }) {
  if (!badge) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5,4,3,0.78)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      className="mjn-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.bg,
          border: `1px solid ${C.warn}`,
          padding: 44,
          textAlign: "center",
          maxWidth: 380,
          width: "100%",
          boxShadow: `0 0 80px rgba(247,224,138,0.3)`,
          animation: "mjnPop .55s cubic-bezier(.2,1.4,.4,1) both",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.warn}, transparent)`,
          }}
        />
        <div
          style={{
            ...MONO,
            fontSize: 10,
            color: C.warn,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginBottom: 22,
          }}
        >
          Badge unlocked
        </div>
        <div
          style={{
            width: 88,
            height: 88,
            background: "rgba(247,224,138,0.15)",
            border: `2px solid ${C.warn}`,
            color: C.warn,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ...MONO,
            fontSize: 36,
            marginBottom: 22,
            boxShadow: `0 0 30px rgba(247,224,138,0.45)`,
            animation: "mjnSpin 6s linear infinite",
          }}
        >
          {badge.icon}
        </div>
        <h2
          style={{
            ...MONO,
            fontSize: 22,
            fontWeight: 500,
            color: C.text,
            margin: "0 0 8px",
            letterSpacing: "0.02em",
          }}
        >
          {badge.name}
        </h2>
        <div style={{ ...MONO, fontSize: 12, color: C.muted, marginBottom: 22, letterSpacing: "0.02em", lineHeight: 1.55 }}>
          {badge.desc}
        </div>
        <div
          style={{
            ...MONO,
            fontSize: 14,
            color: C.warn,
            letterSpacing: "0.06em",
            marginBottom: 30,
            padding: "10px 16px",
            border: `1px solid rgba(247,224,138,0.35)`,
            background: "rgba(247,224,138,0.06)",
            display: "inline-block",
          }}
        >
          + {badge.tokens} Mujin tokens
        </div>
        <AmberBtn onClick={onClose} full>Continue</AmberBtn>
      </div>
    </div>
  );
}

function DuelPendingCard({ duel, onClear, onPlay }) {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);
  const accepted = duel.players.filter((p) => p.accepted).length;
  const total = duel.players.length;
  const ready = accepted === total;
  const accent = ready ? C.good : C.warn;
  const accentSoftCol = ready ? C.goodSoft : WARN_SOFT;
  const accentFaintCol = ready ? "rgba(127,176,105,0.06)" : WARN_FAINT;
  const accentFaintHover = ready ? "rgba(127,176,105,0.1)" : "rgba(247,224,138,0.1)";

  return (
    <div
      className="mjn-fade-in"
      style={{
        border: `1px solid ${hover ? accent : accentSoftCol}`,
        background: accentFaintCol,
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
        transition: "border-color .15s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0.6,
        }}
      />
      <div
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          padding: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          cursor: "pointer",
          background: hover ? accentFaintHover : "transparent",
          transition: "background .15s",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...MONO, fontSize: 10, letterSpacing: "0.22em", color: accent, textTransform: "uppercase", marginBottom: 8 }}>
            {ready ? "Duel ready" : "Duel invite pending"}
          </div>
          <div style={{ ...MONO, fontSize: 18, fontWeight: 500, color: C.text, letterSpacing: "0.02em", marginBottom: 6 }}>
            {duel.game} duel
          </div>
          <div style={{ ...MONO, fontSize: 11, color: C.muted, letterSpacing: "0.02em", marginBottom: 10 }}>
            {duel.stake} SUI stake · Winner pays {duel.winnerPays} · Others pay the split
          </div>
          <div style={{ ...MONO, fontSize: 12, color: ready ? C.good : C.text, letterSpacing: "0.02em" }}>
            {ready
              ? "Everyone has accepted. Ready to play."
              : `${accepted} of ${total} accepted. Waiting on ${duel.players
                  .filter((p) => !p.accepted)
                  .map((p) => p.name)
                  .join(", ")}.`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
          <span
            style={{
              ...MONO,
              fontSize: 10,
              letterSpacing: "0.18em",
              padding: "5px 10px",
              border: `1px solid ${accent}`,
              color: accent,
              background: accentFaintCol,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {accepted} of {total} accepted{ready ? " · ready" : ""}
          </span>
          <div
            style={{
              ...MONO,
              color: hover ? C.text : C.muted,
              fontSize: 11,
              letterSpacing: "0.1em",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "color .15s",
            }}
          >
            <span style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s", display: "inline-block" }}>▾</span>
            {expanded ? "Hide details" : "Details"}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mjn-fade-in" style={{ padding: "0 22px 20px", borderTop: `1px solid ${accentSoftCol}`, paddingTop: 16, marginTop: 4 }}>
          <Label style={{ marginBottom: 10 }}>Players</Label>
          <div>
            {duel.players.map((p, i) => (
              <div
                key={p.id}
                className="mjn-fade-in"
                style={{
                  animationDelay: `${0.04 * i}s`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: i === duel.players.length - 1 ? "none" : `1px solid ${C.border}`,
                  ...MONO,
                  fontSize: 12,
                  color: C.text,
                  letterSpacing: "0.02em",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      background: C.faint,
                      color: C.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...MONO,
                      fontSize: 10,
                      textTransform: "uppercase",
                    }}
                  >
                    {p.name[0]}
                  </span>
                  {p.name}
                </span>
                <span
                  style={{
                    color: p.accepted ? C.good : C.muted,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {p.accepted ? "✓ Accepted" : "Pending"}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn onClick={onClear}>Cancel duel</Btn>
            {ready && <Btn primary accent={C.warn} onClick={onPlay}>Play now →</Btn>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Create Pool wizard

const CREATE_STEPS = [
  { key: "details", title: "Pool details", subtitle: "Give the pool a name and explain what it's for." },
  { key: "visibility", title: "Who can join?", subtitle: "Choose whether this pool is invite-only or open to SUI wallets." },
  { key: "target", title: "Do you want to set a target?", subtitle: "Set a clear SUI goal, or keep the pool open-ended." },
  { key: "invite", title: "Invite wallets", subtitle: "Add the wallets that can see and contribute to this pool." },
  { key: "contributions", title: "How can people add SUI?", subtitle: "Choose how contributions work." },
  { key: "payout", title: "Where should the SUI go?", subtitle: "Choose the wallet that receives funds when the pool pays out." },
  { key: "review", title: "Check your pool", subtitle: "Review everything before creating it." },
];

const RECENT_WALLETS = [
  { name: "maya", wallet: "0x44D...2bB4" },
  { name: "alice", wallet: "0x3d4...8c5e" },
];

function FieldGroup({ label, optional, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Label style={{ marginBottom: 8, display: "flex", gap: 6, alignItems: "baseline" }}>
        <span>{label}</span>
        {optional && <span style={{ color: C.dim, letterSpacing: "0.18em", fontSize: 9 }}>OPTIONAL</span>}
      </Label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, suffix, large, autoFocus, type = "text" }) {
  const [f, setF] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: C.panel,
        border: `1px solid ${f ? C.borderHi : C.border}`,
        padding: large ? "14px 16px" : "10px 14px",
        transition: "border-color .15s",
      }}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          ...MONO,
          flex: 1,
          minWidth: 0,
          background: "transparent",
          border: "none",
          outline: "none",
          color: C.text,
          fontSize: large ? 15 : 13,
          letterSpacing: "0.02em",
          colorScheme: "dark",
        }}
      />
      {suffix && (
        <span style={{ ...MONO, fontSize: 11, color: C.accent, letterSpacing: "0.2em", marginLeft: 12 }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

function TextArea({ value, onChange, placeholder }) {
  const [f, setF] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      placeholder={placeholder}
      rows={4}
      style={{
        ...MONO,
        width: "100%",
        background: C.panel,
        border: `1px solid ${f ? C.borderHi : C.border}`,
        outline: "none",
        color: C.text,
        padding: "12px 14px",
        fontSize: 13,
        letterSpacing: "0.02em",
        resize: "vertical",
        boxSizing: "border-box",
        transition: "border-color .15s",
      }}
    />
  );
}

function RadioCard({ selected, title, description, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "16px 18px",
        border: `1px solid ${selected ? C.accentSoft : h ? C.borderHi : C.border}`,
        background: selected ? C.accentFaint : h ? C.panelHi : C.panel,
        cursor: "pointer",
        transition: "all .15s",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        marginBottom: 8,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          border: `1px solid ${selected ? C.accent : C.borderHi}`,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
          transition: "all .15s",
        }}
      >
        {selected && (
          <span
            style={{
              width: 8,
              height: 8,
              background: C.accent,
              borderRadius: 999,
              boxShadow: `0 0 6px ${C.accent}`,
            }}
          />
        )}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ ...MONO, fontSize: 13, fontWeight: 500, color: C.text, letterSpacing: "0.02em", marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, lineHeight: 1.55, letterSpacing: "0.02em" }}>
          {description}
        </div>
      </div>
    </div>
  );
}

function SegBtn({ active, onClick, children }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        ...MONO,
        flex: 1,
        padding: "12px 16px",
        background: active ? C.accent : "transparent",
        color: active ? C.bg : h ? C.text : C.muted,
        border: `1px solid ${active ? C.accent : h ? C.borderHi : C.border}`,
        fontSize: 12,
        letterSpacing: "0.1em",
        cursor: "pointer",
        transition: "all .15s",
        fontWeight: active ? 500 : 400,
      }}
    >
      {children}
    </button>
  );
}

function PresetBtn({ active, onClick, children }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        ...MONO,
        flex: 1,
        padding: "10px 0",
        background: active ? C.panelHi : "transparent",
        color: active || h ? C.text : C.muted,
        border: `1px solid ${active || h ? C.borderHi : C.border}`,
        fontSize: 13,
        cursor: "pointer",
        transition: "all .12s",
      }}
    >
      {children}
    </button>
  );
}

function Chip({ children, onRemove }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 8px 6px 10px",
        border: `1px solid ${C.accentSoft}`,
        background: C.accentFaint,
        color: C.text,
        ...MONO,
        fontSize: 11,
        letterSpacing: "0.04em",
      }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            ...MONO,
            background: "transparent",
            border: "none",
            color: C.muted,
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            fontSize: 14,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}

function WalletChip({ wallet, onRemove }) {
  return (
    <div
      className="mjn-fade-in"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 8px 8px 8px",
        border: `1px solid ${C.accentSoft}`,
        background: C.accentFaint,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          background: C.bg,
          color: C.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...MONO,
          fontSize: 11,
          textTransform: "uppercase",
        }}
      >
        {wallet.name[0]}
      </div>
      <div>
        <div style={{ ...MONO, fontSize: 12, color: C.text, letterSpacing: "0.02em" }}>{wallet.name}</div>
        <div style={{ ...MONO, fontSize: 9, color: C.muted, letterSpacing: "0.04em", marginTop: 1 }}>{wallet.wallet}</div>
      </div>
      <button
        onClick={onRemove}
        style={{
          ...MONO,
          background: "transparent",
          border: "none",
          color: C.muted,
          cursor: "pointer",
          marginLeft: 6,
          fontSize: 14,
        }}
      >
        ×
      </button>
    </div>
  );
}

function RecentWalletRow({ w, onAdd, last }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        background: h ? C.panelHi : "transparent",
        transition: "background .12s",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          background: C.faint,
          color: C.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...MONO,
          fontSize: 12,
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        {w.name[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em" }}>{w.name}</div>
        <div style={{ ...MONO, fontSize: 10, color: C.muted, letterSpacing: "0.06em", marginTop: 2 }}>{w.wallet}</div>
      </div>
      <button
        onClick={onAdd}
        style={{
          ...MONO,
          background: "transparent",
          border: `1px solid ${h ? C.accent : C.border}`,
          color: h ? C.accent : C.muted,
          width: 30,
          height: 30,
          cursor: "pointer",
          transition: "all .15s",
          fontSize: 14,
        }}
      >
        +
      </button>
    </div>
  );
}

function ReviewRow({ label, value, onEdit, last }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "16px 22px",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: h ? C.panelHi : "transparent",
        transition: "background .12s",
      }}
    >
      <div>
        <Label style={{ marginBottom: 4 }}>{label}</Label>
        <div style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em" }}>{value}</div>
      </div>
      <button
        onClick={onEdit}
        style={{
          ...MONO,
          background: "transparent",
          border: "none",
          color: h ? C.accent : C.muted,
          fontSize: 10,
          letterSpacing: "0.22em",
          cursor: "pointer",
          transition: "color .12s",
        }}
      >
        EDIT
      </button>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "";
  try {
    const [y, m, day] = d.split("-");
    return `${day} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][parseInt(m) - 1]} ${y}`;
  } catch {
    return d;
  }
}

// Step bodies

function StepDetails({ data, update }) {
  return (
    <>
      <FieldGroup label="Pool name">
        <TextInput value={data.name} onChange={(v) => update("name", v)} placeholder="My SUI Pool" large autoFocus />
      </FieldGroup>
      <FieldGroup label="Description" optional>
        <TextArea value={data.description} onChange={(v) => update("description", v)} placeholder="What's this pool for?" />
      </FieldGroup>
    </>
  );
}

function StepVisibility({ data, update }) {
  const isPrivate = data.visibility === "private";
  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <SegBtn active={isPrivate} onClick={() => update("visibility", "private")}>Private</SegBtn>
        <SegBtn active={!isPrivate} onClick={() => update("visibility", "public")}>Public</SegBtn>
      </div>
      <div style={{ ...MONO, fontSize: 11, color: C.muted, marginBottom: 24, letterSpacing: "0.02em" }}>
        {isPrivate ? "Only invited wallets can see and contribute." : "Anyone with a SUI wallet can find and contribute."}
      </div>
      {!isPrivate && (
        <div className="mjn-fade-in" style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 18 }}>
          <h3 style={{ ...MONO, fontSize: 13, fontWeight: 500, margin: 0, color: C.text, letterSpacing: "0.04em" }}>
            Discoverable hashtags
          </h3>
          <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 4, marginBottom: 12, letterSpacing: "0.02em" }}>
            Add optional hashtags so SUI communities can discover this public pool.
          </div>
          {data.hashtags.length > 0 && (
            <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
              {data.hashtags.map((h) => (
                <Chip key={h} onRemove={() => update("hashtags", data.hashtags.filter((x) => x !== h))}>
                  #{h}
                </Chip>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <TextInput value={data.hashtagInput} onChange={(v) => update("hashtagInput", v)} placeholder="community-name" />
            </div>
            <Btn
              primary
              onClick={() => {
                if (data.hashtagInput && data.hashtags.length < 5 && !data.hashtags.includes(data.hashtagInput)) {
                  update("hashtags", [...data.hashtags, data.hashtagInput.replace(/^#/, "")]);
                  update("hashtagInput", "");
                }
              }}
            >
              Add
            </Btn>
          </div>
          <div style={{ ...MONO, fontSize: 10, color: C.dim, marginTop: 10, letterSpacing: "0.04em" }}>
            Use up to 5 tags to help people find the pool.
          </div>
        </div>
      )}
    </>
  );
}

function StepTarget({ data, update }) {
  return (
    <>
      <RadioCard
        selected={data.targetEnabled}
        title="Set a target"
        description="Choose how much SUI this pool should collect."
        onClick={() => update("targetEnabled", true)}
      />
      <RadioCard
        selected={!data.targetEnabled}
        title="No target"
        description="Let people add SUI without setting a final amount."
        onClick={() => update("targetEnabled", false)}
      />
      {data.targetEnabled && (
        <div className="mjn-fade-in" style={{ marginTop: 20 }}>
          <FieldGroup label="Target amount">
            <div style={{ ...MONO, fontSize: 11, color: C.muted, marginBottom: 10, letterSpacing: "0.02em" }}>
              How much SUI should this pool collect?
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {["0.1", "0.2", "0.3", "0.5", "1.0"].map((v) => (
                <PresetBtn key={v} active={data.targetAmount === v} onClick={() => update("targetAmount", v)}>
                  {v}
                </PresetBtn>
              ))}
            </div>
            <TextInput value={data.targetAmount} onChange={(v) => update("targetAmount", v)} suffix="SUI" />
            <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 8, letterSpacing: "0.02em" }}>
              Mock value today:{" "}
              <span style={{ color: C.text }}>£{(parseFloat(data.targetAmount || 0) * 1.4).toFixed(2)}</span>
            </div>
          </FieldGroup>
          <FieldGroup label="End date" optional>
            <TextInput value={data.endDate} onChange={(v) => update("endDate", v)} type="date" />
            <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 8, letterSpacing: "0.02em" }}>
              Useful for challenges, events or contribution windows.
            </div>
          </FieldGroup>
        </div>
      )}
    </>
  );
}

function StepInvite({ data, update }) {
  const addWallet = (w) => {
    if (!data.invitedWallets.find((x) => x.wallet === w.wallet)) {
      update("invitedWallets", [...data.invitedWallets, w]);
    }
  };
  const removeWallet = (w) => {
    update("invitedWallets", data.invitedWallets.filter((x) => x.wallet !== w.wallet));
  };
  const recentNotAdded = RECENT_WALLETS.filter(
    (r) => !data.invitedWallets.find((x) => x.wallet === r.wallet)
  );

  return (
    <>
      {data.invitedWallets.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {data.invitedWallets.map((w) => (
            <WalletChip key={w.wallet} wallet={w} onRemove={() => removeWallet(w)} />
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <TextInput
            value={data.walletInput}
            onChange={(v) => update("walletInput", v)}
            placeholder="Paste wallet address (0x...)"
          />
        </div>
        <Btn
          primary
          onClick={() => {
            if (data.walletInput) {
              addWallet({ name: "new", wallet: data.walletInput });
              update("walletInput", "");
            }
          }}
        >
          Add
        </Btn>
      </div>
      {recentNotAdded.length > 0 && (
        <div>
          <Label style={{ marginBottom: 10 }}>Recent</Label>
          <div style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            {recentNotAdded.map((w, i) => (
              <RecentWalletRow key={w.wallet} w={w} onAdd={() => addWallet(w)} last={i === recentNotAdded.length - 1} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function StepContributions({ data, update }) {
  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ ...MONO, fontSize: 14, fontWeight: 500, color: C.text, margin: 0, letterSpacing: "0.04em" }}>
          Add duels?
        </h3>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 6, marginBottom: 12, letterSpacing: "0.02em" }}>
          Let members compete over who contributes more.
        </div>
        <RadioCard
          selected={!data.duelsEnabled}
          title="No duels"
          description="Keep contributions simple."
          onClick={() => update("duelsEnabled", false)}
        />
        <RadioCard
          selected={data.duelsEnabled}
          title="Enable duels"
          description="Members can challenge each other and the result affects who adds more SUI."
          onClick={() => update("duelsEnabled", true)}
        />
        {data.duelsEnabled && (
          <div
            className="mjn-fade-in"
            style={{
              padding: "12px 14px",
              background: "rgba(247,224,138,0.06)",
              border: `1px solid rgba(247,224,138,0.3)`,
              ...MONO,
              fontSize: 11,
              color: C.text,
              letterSpacing: "0.02em",
              marginTop: 4,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              lineHeight: 1.55,
            }}
          >
            <span style={{ color: "#f7e08a", flexShrink: 0, fontSize: 13 }}>⚠</span>
            <span>Duels change who contributes more, but all SUI still goes into the pool.</span>
          </div>
        )}
      </div>
      <div>
        <h3 style={{ ...MONO, fontSize: 14, fontWeight: 500, color: C.text, margin: 0, letterSpacing: "0.04em" }}>
          Contribution amount
        </h3>
        <div style={{ marginTop: 12 }}>
          <RadioCard
            selected={data.contributionAmount === "any"}
            title="Any amount"
            description="People can add as much or as little as they want."
            onClick={() => update("contributionAmount", "any")}
          />
          <RadioCard
            selected={data.contributionAmount === "fixed"}
            title="Fixed amount"
            description="Everyone contributes the same amount per round."
            onClick={() => update("contributionAmount", "fixed")}
          />
        </div>
      </div>
    </>
  );
}

function StepPayout({ data, update }) {
  return (
    <>
      <RadioCard
        selected={data.payout === "my"}
        title="My wallet"
        description="Use your connected wallet."
        onClick={() => update("payout", "my")}
      />
      <RadioCard
        selected={data.payout === "other"}
        title="Another wallet"
        description="Enter a different wallet address."
        onClick={() => update("payout", "other")}
      />
      {data.payout === "other" && (
        <div className="mjn-fade-in" style={{ marginTop: 20 }}>
          <FieldGroup label="Wallet name" optional>
            <TextInput
              value={data.payoutName}
              onChange={(v) => update("payoutName", v)}
              placeholder="Business wallet or person name"
            />
          </FieldGroup>
          <FieldGroup label="Payout wallet address">
            <TextInput
              value={data.payoutAddress}
              onChange={(v) => update("payoutAddress", v)}
              placeholder="Paste wallet address (0x...)"
            />
          </FieldGroup>
        </div>
      )}
    </>
  );
}

function StepReview({ data, setStep, visibilityStepIndex, targetStepIndex, inviteStepIndex, contribStepIndex, payoutStepIndex }) {
  const targetText = data.targetEnabled
    ? `${data.targetAmount} SUI${data.endDate ? ` by ${formatDate(data.endDate)}` : ""}`
    : "Open-ended";
  const peopleText =
    data.visibility === "public"
      ? `Public${data.hashtags.length ? ` · #${data.hashtags.join(", #")}` : ""}`
      : data.invitedWallets.length
      ? data.invitedWallets.map((w) => w.name).join(", ")
      : "Just you";

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div style={{ padding: "22px 22px 18px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...MONO, fontSize: 20, fontWeight: 500, color: C.text, letterSpacing: "0.02em" }}>
          {data.name || "Untitled pool"}
        </div>
        <div style={{ ...MONO, fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 6 }}>
          {data.visibility} pool
        </div>
      </div>
      <ReviewRow label="Visibility" value={data.visibility === "private" ? "Private" : "Public"} onEdit={() => setStep(visibilityStepIndex)} />
      <ReviewRow label="Target" value={targetText} onEdit={() => setStep(targetStepIndex)} />
      <ReviewRow
        label="People"
        value={peopleText}
        onEdit={() => setStep(inviteStepIndex !== -1 ? inviteStepIndex : visibilityStepIndex)}
      />
      <ReviewRow
        label="Adding SUI"
        value={data.contributionAmount === "any" ? "Any amount" : "Fixed amount"}
        onEdit={() => setStep(contribStepIndex)}
      />
      <ReviewRow label="Duels" value={data.duelsEnabled ? "On" : "Off"} onEdit={() => setStep(contribStepIndex)} />
      <ReviewRow
        label="Payout wallet"
        value={
          data.payout === "my"
            ? "Funds go to your wallet"
            : data.payoutName || data.payoutAddress || "Another wallet"
        }
        onEdit={() => setStep(payoutStepIndex)}
      />
      <div style={{ padding: "18px 22px" }}>
        <Label style={{ marginBottom: 6 }}>Fees</Label>
        <div style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em" }}>
          Mujin fee: 1% on contributions
        </div>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 4, letterSpacing: "0.02em" }}>
          No fee to create a pool
        </div>
      </div>
    </div>
  );
}

function CreatePool({ setScreen }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "",
    description: "",
    visibility: "private",
    hashtags: [],
    hashtagInput: "",
    targetEnabled: true,
    targetAmount: "0.1",
    endDate: "",
    invitedWallets: [
      { name: "alex", wallet: "0x12B...7cC2" },
      { name: "jordan", wallet: "0x88C...9dA3" },
    ],
    walletInput: "",
    duelsEnabled: true,
    contributionAmount: "any",
    payout: "my",
    payoutName: "",
    payoutAddress: "",
  });

  const visibleSteps = useMemo(
    () => CREATE_STEPS.filter((s) => s.key !== "invite" || data.visibility === "private"),
    [data.visibility]
  );

  // Keep step in bounds when steps list shrinks
  useEffect(() => {
    if (step >= visibleSteps.length) setStep(visibleSteps.length - 1);
  }, [visibleSteps.length, step]);

  const currentStep = visibleSteps[step] || visibleSteps[0];
  const isLast = step === visibleSteps.length - 1;
  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const next = () => {
    if (isLast) setScreen("pool");
    else setStep((s) => s + 1);
  };
  const back = () => {
    if (step === 0) setScreen("dashboard");
    else setStep((s) => s - 1);
  };

  const progress = ((step + 1) / visibleSteps.length) * 100;
  const indexOf = (key) => visibleSteps.findIndex((s) => s.key === key);

  return (
    <>
      <div style={{ height: 2, background: C.faint, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: C.accent,
            transition: "width .45s cubic-bezier(.2,.7,.2,1)",
            boxShadow: `0 0 10px ${C.accent}`,
          }}
        />
      </div>

      <div style={{ padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <button
            onClick={back}
            style={{
              ...MONO,
              background: "transparent",
              border: "none",
              color: C.muted,
              fontSize: 12,
              letterSpacing: "0.1em",
              cursor: "pointer",
              padding: "6px 0",
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "color .12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
          >
            ‹ Back
          </button>

          <div style={{ marginBottom: 32 }}>
            <Label style={{ marginBottom: 10 }}>
              Step {step + 1} of {visibleSteps.length}
            </Label>
            <h1
              style={{
                ...MONO,
                fontSize: 24,
                fontWeight: 500,
                margin: "0 0 8px",
                color: C.text,
                letterSpacing: "0.02em",
              }}
            >
              {currentStep.title}
            </h1>
            <div style={{ ...MONO, fontSize: 12, color: C.muted, lineHeight: 1.6, letterSpacing: "0.02em" }}>
              {currentStep.subtitle}
            </div>
          </div>

          <div key={step} className="mjn-fade-in">
            {currentStep.key === "details" && <StepDetails data={data} update={update} />}
            {currentStep.key === "visibility" && <StepVisibility data={data} update={update} />}
            {currentStep.key === "target" && <StepTarget data={data} update={update} />}
            {currentStep.key === "invite" && <StepInvite data={data} update={update} />}
            {currentStep.key === "contributions" && <StepContributions data={data} update={update} />}
            {currentStep.key === "payout" && <StepPayout data={data} update={update} />}
            {currentStep.key === "review" && (
              <StepReview
                data={data}
                setStep={setStep}
                visibilityStepIndex={indexOf("visibility")}
                targetStepIndex={indexOf("target")}
                inviteStepIndex={indexOf("invite")}
                contribStepIndex={indexOf("contributions")}
                payoutStepIndex={indexOf("payout")}
              />
            )}
          </div>

          <button
            onClick={next}
            style={{
              ...MONO,
              width: "100%",
              padding: "14px",
              background: C.accent,
              color: C.bg,
              border: `1px solid ${C.accent}`,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              marginTop: 32,
              transition: "all .15s",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.92)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
          >
            {isLast ? "Create pool" : "Continue"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Settings

const SETTINGS_SECTIONS = [
  { id: "wallet", title: "Wallet", desc: "Connected wallet, network and balance" },
  { id: "profile", title: "Profile", desc: "Name, avatar and public identity" },
  { id: "notifications", title: "Notifications", desc: "Duel invites, pool updates and payouts" },
  { id: "privacy", title: "Privacy", desc: "Control what others can see" },
  { id: "preferences", title: "Preferences", desc: "Theme, currency and app display" },
  { id: "help", title: "Help", desc: "How Mujin works, fees and support" },
];

function SettingsRow({ section, last, index, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="mjn-fade-in"
      style={{
        animationDelay: `${0.04 * index}s`,
        padding: "18px 22px",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: h ? C.panelHi : "transparent",
        cursor: "pointer",
        transition: "all .12s",
        borderLeft: h ? `2px solid ${C.accent}` : "2px solid transparent",
      }}
    >
      <div>
        <div style={{ ...MONO, fontSize: 14, fontWeight: 500, color: C.text, letterSpacing: "0.02em" }}>
          {section.title}
        </div>
        <div style={{ ...MONO, fontSize: 11, color: C.muted, marginTop: 4, letterSpacing: "0.02em" }}>
          {section.desc}
        </div>
      </div>
      <span
        style={{
          ...MONO,
          color: h ? C.accent : C.muted,
          fontSize: 16,
          transition: "all .12s",
          transform: h ? "translateX(2px)" : "translateX(0)",
        }}
      >
        ›
      </span>
    </div>
  );
}

function Settings({ setScreen }) {
  return (
    <>
      <PageHeader title="Settings" breadcrumbs="Account / Settings">
        <Btn onClick={() => setScreen("dashboard")}>← Back</Btn>
      </PageHeader>

      <div style={{ padding: 32, maxWidth: 760, margin: "0 auto" }} className="mjn-fade-in">
        <Label style={{ marginBottom: 12 }}>Connected wallet</Label>
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: 22,
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ ...MONO, fontSize: 15, color: C.text, letterSpacing: "0.02em", marginBottom: 10 }}>
              0x89A...4fE1
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Tag>Sui Mainnet</Tag>
              <Tag tone="accent">450 SUI</Tag>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn
              onClick={() => {
                try { navigator.clipboard?.writeText("0x89A...4fE1"); } catch {}
              }}
            >
              Copy address
            </Btn>
            <Btn primary>View on explorer</Btn>
          </div>
        </div>

        <Label style={{ marginBottom: 12 }}>Settings sections</Label>
        <div style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          {SETTINGS_SECTIONS.map((s, i) => (
            <SettingsRow
              key={s.id}
              section={s}
              index={i}
              last={i === SETTINGS_SECTIONS.length - 1}
              onClick={() => {}}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 32,
            padding: 18,
            border: `1px solid ${C.border}`,
            background: C.panel,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ ...MONO, fontSize: 13, color: C.text, letterSpacing: "0.02em", marginBottom: 4 }}>
              Disconnect wallet
            </div>
            <div style={{ ...MONO, fontSize: 11, color: C.muted, letterSpacing: "0.02em" }}>
              End your session and return to the connect screen.
            </div>
          </div>
          <button
            onClick={() => setScreen("disconnect")}
            style={{
              ...MONO,
              padding: "9px 16px",
              background: "transparent",
              color: "#ff6b6b",
              border: `1px solid rgba(255,107,107,0.4)`,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,107,107,0.08)";
              e.currentTarget.style.borderColor = "#ff6b6b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,107,107,0.4)";
            }}
          >
            Disconnect
          </button>
        </div>

        <div
          style={{
            ...MONO,
            fontSize: 10,
            color: C.dim,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textAlign: "center",
            marginTop: 32,
          }}
        >
          Mujin v0.3.1 · Sui Mainnet
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Root

function ConnectScreen({ onConnect }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at center, rgba(255,120,73,0.1) 0%, transparent 65%), radial-gradient(ellipse 50% 30% at 50% 80%, rgba(247,224,138,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(236,235,231,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(236,235,231,0.018) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      <div
        className="mjn-fade-in"
        style={{
          position: "relative",
          textAlign: "center",
          maxWidth: 460,
          width: "100%",
        }}
      >
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}>
          <div style={{ filter: "drop-shadow(0 0 30px rgba(255,120,73,0.4))" }}>
            <MujinLogo size={88} />
          </div>
        </div>

        <h1
          style={{
            ...MONO,
            fontSize: 42,
            fontWeight: 500,
            color: C.text,
            margin: "0 0 14px",
            letterSpacing: "0.05em",
          }}
        >
          Mujin
        </h1>

        <div
          style={{
            ...MONO,
            fontSize: 13,
            color: C.muted,
            margin: "0 auto 40px",
            letterSpacing: "0.02em",
            lineHeight: 1.65,
            maxWidth: 380,
          }}
        >
          Save together on Sui. Pool with friends, win the monthly raffle, duel for the pot.
        </div>

        <AmberBtn onClick={onConnect} big>
          ◆ Connect Sui wallet
        </AmberBtn>

        <div
          style={{
            ...MONO,
            fontSize: 11,
            color: C.dim,
            marginTop: 24,
            letterSpacing: "0.04em",
          }}
        >
          New here?{" "}
          <span
            style={{
              color: C.muted,
              cursor: "pointer",
              borderBottom: `1px solid ${C.border}`,
              paddingBottom: 1,
            }}
          >
            What is Mujin?
          </span>
        </div>

        <div
          style={{
            marginTop: 64,
            paddingTop: 28,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 28,
            justifyContent: "center",
            flexWrap: "wrap",
            ...MONO,
            fontSize: 10,
            color: C.muted,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span><span style={{ color: C.accent, marginRight: 6 }}>◆</span>Pool savings</span>
          <span><span style={{ color: C.warn, marginRight: 6 }}>♠</span>Friendly duels</span>
          <span><span style={{ color: C.warn, marginRight: 6 }}>★</span>Monthly raffle</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: 0,
          right: 0,
          textAlign: "center",
          ...MONO,
          fontSize: 9,
          color: C.dim,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        Mujin v0.3.1 · Sui Mainnet
      </div>
    </div>
  );
}

export default function MujinApp() {
  const [screen, setScreen] = useState("dashboard");
  const [connected, setConnected] = useState(false);
  const [activeDuel, setActiveDuel] = useState(null);
  const [duelResult, setDuelResult] = useState(null);
  const [badges, setBadges] = useState(INITIAL_BADGES);
  const [poolTotal, setPoolTotal] = useState(450);
  const [raffleTickets, setRaffleTickets] = useState(INITIAL_RAFFLE_TICKETS);
  const [raffleSeconds, setRaffleSeconds] = useState(15);
  const [raffleDrawn, setRaffleDrawn] = useState(false);

  const mujinTokens = badges.filter((b) => b.earned).reduce((s, b) => s + b.tokens, 0);
  const totalRaffleTickets = raffleTickets.reduce((s, t) => s + t.count, 0);

  const awardBadge = (id) => {
    setBadges((bs) => bs.map((b) => (b.id === id && !b.earned ? { ...b, earned: true } : b)));
  };

  const finishDuel = (poolReceives) => {
    setPoolTotal((t) => +(t + poolReceives).toFixed(2));
    setActiveDuel(null);
    setDuelResult(null);
  };

  const addRaffleTickets = (sui, source) => {
    // ~7 SUI ≈ £10 ≈ 1 ticket
    const earned = Math.floor(sui / 7);
    if (earned <= 0) return;
    setRaffleTickets((tickets) => [
      { id: Date.now(), count: earned, amount: Math.round(sui), source, date: "Just now" },
      ...tickets,
    ]);
  };

  // Raffle countdown
  useEffect(() => {
    if (raffleSeconds <= 0) return;
    const t = setInterval(() => {
      setRaffleSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [raffleSeconds]);

  const finishRaffle = () => {
    setRaffleTickets([]);
    setRaffleSeconds(MONTHLY_SECONDS);
    setRaffleDrawn(false);
  };

  // Simulate other players accepting the duel one at a time
  useEffect(() => {
    if (!activeDuel) return;
    const nextPending = activeDuel.players.find((p) => !p.accepted);
    if (!nextPending) return;
    const t = setTimeout(() => {
      setActiveDuel((d) => {
        if (!d) return d;
        return {
          ...d,
          players: d.players.map((p) => (p.id === nextPending.id ? { ...p, accepted: true } : p)),
        };
      });
    }, 2400);
    return () => clearTimeout(t);
  }, [activeDuel]);

  return (
    <div
      style={{
        backgroundColor: C.bg,
        color: C.text,
        minHeight: "100vh",
        ...MONO,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap');
        @keyframes mjnFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes mjnBar { from { width: 0; } }
        @keyframes mjnPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes mjnDraw { to { stroke-dashoffset: 0; } }
        @keyframes mjnPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes mjnTick { to { stroke-dashoffset: 0; } }
        @keyframes mjnFlip { 0% { transform: rotateY(90deg) scale(0.92); opacity: 0; } 100% { transform: rotateY(0) scale(1); opacity: 1; } }
        @keyframes mjnSpin { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
        @keyframes mjnTickPop { 0% { transform: scale(0); } 60% { transform: scale(1.18); } 100% { transform: scale(1); } }
        @keyframes mjnScanH { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes mjnRaffleReady {
          0%, 100% { box-shadow: 0 0 0 0 rgba(247,224,138,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(247,224,138,0); }
        }
        .mjn-raffle-ready { animation: mjnRaffleReady 1.6s ease-in-out infinite; }
        .mjn-fade-in { animation: mjnFade .4s cubic-bezier(.2,.7,.2,1) both; }
        .mjn-bar { animation: mjnBar 1s cubic-bezier(.2,.7,.2,1); }
        .mjn-pulse { animation: mjnPulse 2.4s ease-in-out infinite; }
        ::selection { background: ${C.accent}; color: ${C.bg}; }
        input::placeholder { color: ${C.dim}; letter-spacing: 0.02em; }
        * { box-sizing: border-box; }
        button {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          font-family: inherit;
          border-radius: 0;
          color-scheme: light;
        }
        input[type="range"] {
          appearance: none;
          -webkit-appearance: none;
          height: 6px;
          outline: none;
          border-radius: 999px;
          padding: 0;
          margin: 0;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: transparent;
        }
        input[type="range"]::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: transparent;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ff7849;
          border: 2px solid #131211;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255,120,73,0.5);
          margin-top: -5px;
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ff7849;
          border: 2px solid #131211;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255,120,73,0.5);
        }
        input[type="number"] {
          color-scheme: dark;
        }
        .mjn-fill-amber {
          background: #f7e08a !important;
          background-color: #f7e08a !important;
          color: #131211 !important;
          border-color: #f7e08a !important;
        }
        .mjn-fill-amber:hover { opacity: 0.92; }
        .mjn-fill-coral {
          background: #ff7849 !important;
          background-color: #ff7849 !important;
          color: #131211 !important;
          border-color: #ff7849 !important;
        }
        .mjn-fill-coral:hover { opacity: 0.92; }
        .mjn-circle-amber {
          width: 88px;
          height: 88px;
          background: #f7e08a !important;
          background-color: #f7e08a !important;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 40px rgba(247,224,138,0.5);
          color: #131211;
        }
        .mjn-tick {
          color: #131211;
          font-size: 44px;
          line-height: 1;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        }
      `}</style>

      {!connected ? (
        <ConnectScreen
          onConnect={() => {
            setConnected(true);
            setScreen("dashboard");
          }}
        />
      ) : (
        <>
          <TopNav
            screen={screen}
            setScreen={(s) => {
              if (s === "disconnect") {
                setConnected(false);
                setScreen("dashboard");
              } else {
                setScreen(s);
              }
            }}
            badges={badges}
            mujinTokens={mujinTokens}
            raffleTickets={raffleTickets}
            totalRaffleTickets={totalRaffleTickets}
            raffleSeconds={raffleSeconds}
            raffleDrawn={raffleDrawn}
          />

          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              minHeight: "calc(100vh - 64px)",
              borderLeft: `1px solid ${C.border}`,
              borderRight: `1px solid ${C.border}`,
              position: "relative",
            }}
          >
            {screen === "dashboard" && <Dashboard setScreen={setScreen} />}
            {screen === "pool" && (
              <PoolDetail
                setScreen={setScreen}
                activeDuel={activeDuel}
                setActiveDuel={setActiveDuel}
                poolTotal={poolTotal}
                setPoolTotal={setPoolTotal}
                addRaffleTickets={addRaffleTickets}
              />
            )}
            {screen === "duel" && <DuelSetup setScreen={setScreen} setActiveDuel={setActiveDuel} />}
            {screen === "duel-sent" && <DuelSent setScreen={setScreen} />}
            {screen === "duel-play" && activeDuel && (
              <DuelPlay duel={activeDuel} setScreen={setScreen} setDuelResult={setDuelResult} />
            )}
            {screen === "duel-result" && activeDuel && (
              <DuelResult
                duel={activeDuel}
                duelResult={duelResult}
                setScreen={setScreen}
                finishDuel={finishDuel}
                badges={badges}
                awardBadge={awardBadge}
                poolTotal={poolTotal}
              />
            )}
            {screen === "create" && <CreatePool setScreen={setScreen} />}
            {screen === "settings" && (
              <Settings
                setScreen={(s) => {
                  if (s === "disconnect") {
                    setConnected(false);
                    setScreen("dashboard");
                  } else {
                    setScreen(s);
                  }
                }}
              />
            )}
            {screen === "raffle-draw" && (
              <RaffleDraw
                setScreen={(s) => {
                  finishRaffle();
                  setScreen(s);
                }}
                totalTickets={totalRaffleTickets}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
