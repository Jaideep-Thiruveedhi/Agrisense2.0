import { useEffect, useState } from "react";
import { getAlerts } from "../services/api";
import type { AlertItem } from "../types";

function severityStyle(s: AlertItem["severity"]) {
  if (s === "high") return { border: "border-danger/30", dot: "bg-danger", badge: "bg-danger text-white", label: "HIGH" };
  if (s === "medium") return { border: "border-warning/30", dot: "bg-warning", badge: "bg-warning text-page", label: "MEDIUM" };
  return { border: "border-border1", dot: "bg-textMuted", badge: "bg-panel text-textMuted border border-border1", label: "LOW" };
}
function typeIcon(t: AlertItem["type"]) {
  if (t === "rain") return "☂";
  if (t === "heat") return "☀";
  if (t === "window") return "◷";
  if (t === "wind") return "≋";
  return "⚑";
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  useEffect(() => { getAlerts().then(setAlerts); }, []);
  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-textPrimary">Early risk warnings</h1>
          <p className="text-sm text-textMuted">Color-coded by severity, never decorative — each maps to a WhatsApp line.</p>
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-card border border-border1 self-start">
          {(["all", "high", "medium", "low"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${filter === f ? "bg-textPrimary text-page" : "text-textMuted hover:text-textPrimary"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((a) => {
          const s = severityStyle(a.severity);
          return (
            <div key={a.id} className={`rounded-xl border bg-card p-4 flex gap-4 ${s.border}`}>
              <div className={`h-10 w-10 rounded-xl grid place-items-center text-sm shrink-0 border ${a.severity === "high" ? "bg-danger/15 border-danger/20 text-danger" : a.severity === "medium" ? "bg-warning/15 border-warning/20 text-warning" : "bg-panel border-border1 text-textMuted"}`}>
                {typeIcon(a.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-bold tracking-wide px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                  <span className="text-[11px] font-mono text-textMuted">{a.field} · {a.time}</span>
                  <span className={`ml-auto hidden sm:inline h-2 w-2 rounded-full ${s.dot}`} />
                </div>
                <div className="text-[15px] font-semibold text-textPrimary mt-1">{a.title}</div>
                <div className="text-sm text-textMuted leading-snug mt-1">{a.description}</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs bg-panel border border-border1 rounded-full px-3 py-1.5 text-textPrimary font-medium">→ {a.action}</span>
                  <span className="text-[11px] font-mono text-textMuted">WhatsApp: “{a.action}” — one line</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border1 bg-panel p-4 flex items-start gap-3">
        <span className="text-emeraldAccent mt-0.5">ℹ</span>
        <div className="text-xs leading-relaxed text-textMuted">
          <span className="font-semibold text-textPrimary">Honest WhatsApp limit:</span> alerts are plain text only — no cards, gauges or charts. The advisor dashboard visualizes; WhatsApp delivers <span className="font-mono text-textPrimary">*Bold via asterisks* + line breaks</span> only.
        </div>
      </div>
    </div>
  );
}
