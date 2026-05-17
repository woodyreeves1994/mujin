export const metadata = {
  title: "Mujin v2 — design preview",
  description: "Experimental design playground for Mujin (v2-design branch).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Poppins:wght@600;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#131211", color: "#ecebe7" }}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: "6px 12px",
            background: "rgba(255,120,73,0.15)",
            borderBottom: "1px solid rgba(255,120,73,0.4)",
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "#ff7849",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          ◆ v2 design preview · this is the experimental branch
        </div>
        <div style={{ paddingTop: 28 }}>{children}</div>
      </body>
    </html>
  );
}
