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
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#F5F2EA", color: "#0F0F0F" }}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: "5px 12px",
            background: "#FF4D6D",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            color: "#0F0F0F",
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          ◆ v2 design preview · experimental branch
        </div>
        <div style={{ paddingTop: 26 }}>{children}</div>
      </body>
    </html>
  );
}
