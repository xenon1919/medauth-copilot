import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedAuth AI — Prior Authorization & Clinical Appeals Copilot",
  description: "AI-powered prior authorization and clinical denial appeals copilot built for Homingo Hackathon (Track C1: The $15-an-Hour Expert)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080C14] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
