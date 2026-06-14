import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "TrendForge AI — Real-Time Career & Tech Intelligence",
  description:
    "TrendForge AI analyzes live technology trends, industry shifts, and AI innovations to generate personalized future-ready learning roadmaps powered by advanced LLM reasoning.",
  keywords: ["AI career", "tech trends", "learning roadmap", "AI agents", "career intelligence", "LLM reasoning"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body style={{ background: "#0B1020", color: "#f1f5f9", minHeight: "100vh" }}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
