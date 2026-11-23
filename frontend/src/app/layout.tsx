import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedAuth AI — Prior Authorization & Clinical Appeals Copilot",
  description: "AI-powered prior authorization and clinical denial appeals copilot built for Homingo Hackathon (Track C1)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
