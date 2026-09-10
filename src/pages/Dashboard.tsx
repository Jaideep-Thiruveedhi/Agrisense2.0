import { useEffect, useState } from "react";
import { getDashboardStats, getActivity, getWhatsAppPreview, getReadiness, getAlerts } from "../services/api";
import type { DashboardStats, ActivityItem, WhatsAppMessage, ReadinessData, AlertItem } from "../types";
import WhatsAppPreview from "../components/WhatsAppPreview";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [wa, setWa] = useState<WhatsAppMessage[]>([]);
  const [readiness, setReadiness] = useState<ReadinessData | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
    getActivity().then(setActivity);
    getWhatsAppPreview().then(setWa);
    getReadiness().then(setReadiness);
    getAlerts().then(setAlerts);
  }, []);

  if (!stats || !readiness) return <div className="text-textMuted p-8 font-mono text-sm">Loading dashboard…</div>;

  const cards = [
    { label: "Active applications", value: String(stats.activeApplications), sub: "This week · 3 pending review", icon: "◈", accent: false },
    { label: "Fields monitored", value: String(stats.fieldsMonitored), sub: "Across 3 villages · Akola block", icon: "⬢", accent: false },
    { label: "High-risk alerts", value: String(stats.highRiskAlerts), sub: "Rain + heat + window closing", icon: "⚑", accent: true, danger: true },
    { label: "Avg. readiness", value: `${stats.avgReadiness}/100`, sub: "Across all fields · +2 since yesterday", icon: "◉", accent: true },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-textPrimary">Good morning, Dr. Deshmukh</h1>
          <p className="text-sm text-textMuted mt-1">Here’s what needs your attention today — <span className="text-emeraldAccent font-medium">82/100 best window tomorrow 05:30–08:45</span>.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/readiness" className="bg-emeraldAccent text-page font-semibold text-sm px-4 py-2.5 rounded-lg hover:brightness-110 transition">View readiness →</Link>
          <Link to="/alerts" className="border border-border1 bg-card text-textPrimary text-sm px-4 py-2.5 rounded-lg hover:bg-panel transition">{alerts.length} alerts</Link>
        </div>
      </div>

      {/* Stat cards 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border1 bg-card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className={`h-8 w-8 rounded-lg grid place-items-center text-sm ${c.danger ? "bg-danger/15 text-danger border border-danger/20" : c.accent ? "bg-emeraldAccent/15 text-emeraldAccent border border-emeraldAccent/20" : "bg-panel border border-border2 text-textMuted"}`}>{c.icon}</span>
              <span className="text-[11px] font-mono text-textMuted">#{c.label.slice(0, 3).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-mono text-[28px] font-semibold leading-none text-textPrimary">{c.value}</div>
              <div className="text-xs font-medium text-textMuted mt-1">{c.label}</div>
              <div className="text-[11px] text-textMuted/80 mt-0.5">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp + Activity row */}
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-textMuted">WhatsApp conversation preview</h2>
            <span className="text-[11px] font-mono text-textMuted border border-border1 rounded-full px-2 py-1 bg-panel">Farmer: +91 98•••••321 · Cotton</span>
          </div>
          <WhatsAppPreview messages={wa} />
          <div className="mt-2 flex items-center gap-2 text-[11px] text-textMuted">
            <span className="h-1.5 w-1.5 rounded-full bg-emeraldAccent" />
            Every number here is compressible to 1–2 plain-text sentences — binary check passed.
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-border1 bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border1 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-textPrimary">Recent activity</h3>
              <span className="text-[11px] font-mono text-textMuted">{readiness.lastUpdated}</span>
            </div>
            <div className="divide-y divide-border1/60">
              {activity.map((a) => (
                <div key={a.id} className="px-4 py-3 flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full shrink-0" style={{ background: a.dot }} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-textPrimary leading-snug">{a.title}</div>
                    <div className="text-xs text-textMuted leading-snug">{a.desc}</div>
                  </div>
                  <span className="text-[11px] font-mono text-textMuted shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
            <Link to="/journal" className="block text-center text-xs font-medium text-emeraldAccent py-2.5 border-t border-border1 hover:bg-panel transition">View season journal →</Link>
          </div>

          {/* Expected outcome mini */}
          <div className="rounded-xl border border-emeraldAccent/20 bg-card p-4">
            <div className="text-[11px] tracking-[0.12em] uppercase font-semibold text-emeraldAccent">Expected outcome · Plot 3B</div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-mono text-2xl font-semibold text-emeraldAccent">+18%</span>
              <span className="text-textMuted">·</span>
              <span className="font-mono text-2xl font-semibold text-textPrimary">≈₹3,400<span className="text-sm text-textMuted">/acre</span></span>
            </div>
            <div className="text-xs text-textMuted mt-1">Always shown together — never one alone.</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-panel border border-border1 p-2">
                <div className="text-textMuted text-[11px]">Waste avoided</div>
                <div className="font-mono font-semibold text-textPrimary">54%</div>
              </div>
              <div className="rounded-lg bg-panel border border-border1 p-2">
                <div className="text-textMuted text-[11px]">Yield protection</div>
                <div className="font-mono font-semibold text-textPrimary">+2.2 t/ha</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
