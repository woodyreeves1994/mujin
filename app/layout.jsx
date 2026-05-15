export const metadata = {
  title: "Mujin — Save together on Sui",
  description: "Group savings pools with duels and a monthly raffle, built on Sui.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#131211", color: "#ecebe7" }}>
        {children}
      </body>
    </html>
  );
}
