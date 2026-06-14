"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Zap, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/trends", label: "Trends" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/insights", label: "AI Insights" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(11,16,32,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,179,237,0.1)",
        boxShadow: "0 1px 0 rgba(6,182,212,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(6,182,212,0.4)",
            }}
          >
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: "#f1f5f9",
              letterSpacing: "-0.02em",
            }}
          >
            TrendForge{" "}
            <span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="desktop-nav">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#06b6d4" : "#94a3b8",
                  background: active ? "rgba(6,182,212,0.1)" : "transparent",
                  border: active ? "1px solid rgba(6,182,212,0.2)" : "1px solid transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="desktop-nav">
          <span
            style={{
              fontSize: 11, fontWeight: 600, color: "#94a3b8",
              padding: "4px 12px", borderRadius: 999,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            Powered by LLM Orchestration
          </span>
          <Link href="/roadmap" className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>
            Get Roadmap
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
          className="mobile-menu-btn"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          style={{
            background: "rgba(11,16,32,0.98)",
            borderTop: "1px solid rgba(99,179,237,0.1)",
            padding: "12px 24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                color: pathname === l.href ? "#06b6d4" : "#94a3b8",
                background: pathname === l.href ? "rgba(6,182,212,0.08)" : "transparent",
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
