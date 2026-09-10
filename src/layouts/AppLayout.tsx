import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import GuidedTour from "../components/GuidedTour";
import type { TourHook } from "../hooks/useTour";

const NAV = [
  { to: "/", label: "Dashboard", icon: "◧", end: true },
  { to: "/readiness", label: "Readiness", icon: "◉" },
  { to: "/fit-check", label: "Biological fit check", icon: "⬢" },
  { to: "/alerts", label: "Alerts", icon: "⚑" },
  { to: "/journal", label: "Season journal", icon: "≡" },
  { to: "/learning", label: "Learning", icon: "∼" },
  { to: "/settings", label: "Settings", icon: "⚙" },
];

export default function AppLayout({ tour, demoWatermark, setDemoWatermark }: { tour: TourHook; demoWatermark: boolean; setDemoWatermark: (v:boolean)=>void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();

  return (
    <div className="min-h-screen bg-page flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-[248px] shrink-0 border-r border-border1 bg-page flex-col sticky top-0 h-screen">
        <div className="h-[64px] flex items-center gap-3 px-5 border-b border-border1">
          <div className="h-8 w-8 rounded-lg bg-emeraldAccent grid place-items-center text-page font-bold text-sm">A</div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight leading-none text-textPrimary">AgriSense</div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-textMuted font-medium">Biological Timing</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition border ${
                  isActive
                    ? "bg-emeraldAccent/10 text-emeraldAccent border-emeraldAccent/20"
                    : "text-textMuted hover:text-textPrimary hover:bg-card border-transparent"
                }`
              }
            >
              <span className="text-[13px] w-5 text-center">{n.icon}</span>
              {n.label}
              {n.to === "/alerts" && <span className="ml-auto bg-danger text-white text-[11px] font-mono px-1.5 py-0.5 rounded-full leading-none">3</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border1 space-y-3">
          <button
            onClick={tour.start}
            className="w-full flex items-center justify-center gap-2 bg-emeraldAccent text-page font-semibold text-[13px] py-2.5 rounded-lg hover:brightness-110 transition"
          >
            ▶ Judge mode — guided tour
          </button>
          <div className="rounded-lg bg-card border border-border1 p-3">
            <div className="text-[11px] tracking-wide text-textMuted">Demo data · Rabi 2025 · Plot 3B</div>
            <div className="font-mono text-xs text-textPrimary mt-1">82/100 · 05:30–08:45 AM</div>
            <div className="text-[11px] text-textMuted mt-1">+18% · ≈₹3,400/acre</div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-textMuted">
            <span>HACK CORE 2026</span>
            <span className="h-2 w-2 rounded-full bg-emeraldAccent animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-[64px] border-b border-border1 bg-page/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden h-9 w-9 grid place-items-center rounded-lg border border-border1 text-textMuted">☰</button>
            <div className="hidden lg:block">
              <div className="text-[12px] tracking-[0.14em] uppercase text-textMuted font-semibold">Advisor / Judge view</div>
              <div className="text-[13px] text-textMuted -mt-1">Farmer interacts only via WhatsApp — this dashboard visualizes the backend</div>
            </div>
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-emeraldAccent grid place-items-center text-page font-bold text-xs">A</div>
              <span className="font-semibold text-textPrimary">AgriSense</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-textMuted border border-border1 rounded-full px-3 py-1.5 bg-card">
              <span className="h-2 w-2 rounded-full bg-emeraldAccent" /> ● Live mock
            </div>
            <button
              onClick={tour.start}
              className="hidden sm:inline-flex items-center gap-2 bg-emeraldAccent text-page text-xs font-semibold px-3 py-2 rounded-full"
            >
              ▶ Judge mode
            </button>
            <button onClick={tour.start} className="sm:hidden h-9 px-3 rounded-full bg-emeraldAccent text-page text-xs font-bold">▶ Tour</button>
            <div className="hidden md:flex items-center gap-2 border border-border1 rounded-full px-2 py-1 bg-card">
              <img src="https://i.pravatar.cc/100?img=12" alt="advisor" className="h-7 w-7 rounded-full object-cover" />
              <div className="pr-2 hidden lg:block">
                <div className="text-xs font-medium leading-none text-textPrimary">Dr. Deshmukh</div>
                <div className="text-[11px] text-textMuted leading-none">Advisor · Akola</div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-page border-r border-border1 flex flex-col">
              <div className="h-[64px] flex items-center justify-between px-4 border-b border-border1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emeraldAccent grid place-items-center text-page font-bold">A</div>
                  <span className="font-semibold">AgriSense</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="h-8 w-8 grid place-items-center rounded-full border border-border1">✕</button>
              </div>
              <nav className="p-3 space-y-1 flex-1 overflow-auto">
                {NAV.map((n) => (
                  <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium border ${isActive ? "bg-emeraldAccent/10 text-emeraldAccent border-emeraldAccent/20" : "text-textMuted border-transparent"}`}>
                    <span>{n.icon}</span> {n.label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-border1">
                <button onClick={() => { setMobileOpen(false); tour.start(); }} className="w-full bg-emeraldAccent text-page font-semibold py-3 rounded-lg">▶ Judge mode</button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 px-4 lg:px-6 py-5 lg:py-6 max-w-[1280px] w-full mx-auto">
          {/* location breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-textMuted mb-4">
            <span>Akola · MH</span>
            <span className="opacity-40">/</span>
            <span className="text-textPrimary capitalize">{loc.pathname === "/" ? "Dashboard" : loc.pathname.replace("/", "").replace("-", " ")}</span>
            <span className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={demoWatermark} onChange={e=>setDemoWatermark(e.target.checked)} className="accent-emeraldAccent" />
                Demo watermark
              </label>
            </span>
          </div>
          <Outlet />
        </main>

        <footer className="border-t border-border1 px-4 lg:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-textMuted">
          <span>© 2026 AgriSense · HACK CORE — Advisor view only. Farmer interacts via WhatsApp plain text.</span>
          <span className="font-mono">Build: mock-api · 82/100 · +18% · ₹3,400/acre</span>
        </footer>
      </div>

      <GuidedTour tour={tour} />

      {demoWatermark && (
        <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
          <div className="rotate-[-18deg] border-2 border-emeraldAccent/20 text-emeraldAccent/20 px-10 py-4 rounded-xl text-3xl font-bold tracking-[0.2em] uppercase">Demo · Mock Data</div>
        </div>
      )}
    </div>
  );
}
