import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Solution Builder",
  description: "Business-first solution workspace for turning ideas into editable solution drafts."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><div style={{padding: "12px 24px", background: "#fff4d4", color: "#574016", textAlign: "center"}}>Local MVP demo · Synthetic data only · No auth or billing · Template mode, no AI model</div>{children}</body>
    </html>
  );
}
