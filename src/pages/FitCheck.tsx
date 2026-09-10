import { useEffect, useState } from "react";
import { getFitCheck } from "../services/api";
import type { FitCheckData } from "../types";

export default function FitCheck() {
  const [data, setData] = useState<FitCheckData | null>(null);
  useEffect(() => { getFitCheck().then(setData); }, []);
  if (!data) return <div className="p-8 font-mono text-sm text-textMuted">Loading fit check…</div>;

  const isFit = data.verdict === "fit";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[11px] font-mono text-textMuted">
        <span>Biological fit check</span>
        <span className="opacity-40">·</span>
        <span className="text-textPrimary">{data.product}</span>
        <span className="ml-auto hidden sm:inline border border-border1 rounded-full px-2 py-1 bg-card">{data.crop}</span>
      </div>

      {/* Verdict card */}
      <div className={`rounded-xl border p-5 flex flex-col lg:flex-row gap-5 items-start lg:items-center ${isFit ? "bg-card border-emeraldAccent/30" : "bg-card border-warning/30"}`}>
        <div className={`h-14 w-14 rounded-2xl grid place-items-center text-2xl shrink-0 border ${isFit ? "bg-emeraldAccent text-page border-emeraldAccent" : "bg-warning text-page border-warning"}`}>
          {isFit ? "✓" : "⚠"}
        </div>
        <div className="flex-1">
          <div className={`inline-flex text-xs font-bold tracking-wide px-2.5 py-1 rounded-full border ${isFit ? "bg-emeraldAccent text-page border-emeraldAccent" : "bg-warning text-page border-warning"}`}>
            {data.verdictLabel.toUpperCase()}
          </div>
          <h1 className="text-[18px] font-semibold text-textPrimary mt-2">{data.summary}</h1>
          <p className="text-sm text-textMuted mt-1">{data.recommendation}</p>
        </div>
        <div className="hidden lg:block text-right">
          <div className="text-[11px] tracking-wide uppercase text-textMuted">Verdict confidence</div>
          <div className="font-mono text-2xl font-semibold text-emeraldAccent">92<span className="text-base text-textMuted">/100</span></div>
          <div className="text-[11px] text-textMuted">3/3 tolerances pass</div>
        </div>
      </div>

      {/* 3 metrics */}
      <div className="grid md:grid-cols-3 gap-3">
        {data.metrics.map((m) => (
          <div key={m.id} className="rounded-xl border border-border1 bg-card p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide uppercase text-textMuted">{m.label}</span>
              <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${m.status === "pass" ? "bg-emeraldAccent/15 text-emeraldAccent border-emeraldAccent/20" : m.status === "concern" ? "bg-warning/15 text-warning border-warning/20" : "bg-danger/15 text-danger border-danger/20"}`}>
                {m.status === "pass" ? "PASS" : m.status.toUpperCase()}
              </span>
            </div>
            <div className="mt-3 font-mono text-[28px] font-semibold leading-none text-textPrimary">{m.value}</div>
            <div className="text-xs font-mono text-textMuted mt-1">{m.range}</div>
            {/* mini bar */}
            <div className="mt-4 h-2 rounded-full bg-page border border-border1 overflow-hidden relative">
              <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[60%] rounded-full ${m.status === "pass" ? "bg-emeraldAccent/30" : "bg-warning/30"}`} />
              <div className="absolute top-1/2 -translate-y-1/2 h-3 w-1 rounded-full bg-emeraldAccent" style={{ left: m.id === "ph" ? "48%" : m.id === "humidity" ? "58%" : "35%" }} />
            </div>
            <div className="mt-3 text-xs leading-snug text-textMuted flex-1">{m.note}</div>
            <div className="mt-3 text-[11px] font-mono text-textMuted border-t border-border1 pt-3 flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${m.status === "pass" ? "bg-emeraldAccent" : "bg-warning"}`} />
              Against product tolerance range
            </div>
          </div>
        ))}
      </div>

      {/* Detail table */}
      <div className="rounded-xl border border-border1 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border1 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-textPrimary">Product tolerance sheet — Beauveria bassiana WP</h3>
          <span className="text-[11px] font-mono text-textMuted hidden sm:inline">Source: label + field validation</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] tracking-wide uppercase text-textMuted bg-panel">
              <tr>
                <th className="text-left font-medium px-4 py-2">Parameter</th>
                <th className="text-left font-medium px-4 py-2">Optimal</th>
                <th className="text-left font-medium px-4 py-2">Field now</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border1/60">
              <tr>
                <td className="px-4 py-3 text-textPrimary">Soil pH</td>
                <td className="px-4 py-3 font-mono text-textMuted">5.5 – 7.5</td>
                <td className="px-4 py-3 font-mono text-emeraldAccent font-medium">6.4</td>
                <td className="px-4 py-3"><span className="text-xs bg-emeraldAccent/15 text-emeraldAccent border border-emeraldAccent/20 px-2 py-1 rounded-full">Pass</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-textPrimary">Relative humidity</td>
                <td className="px-4 py-3 font-mono text-textMuted">&ge; 55% for 6h</td>
                <td className="px-4 py-3 font-mono text-emeraldAccent font-medium">62% · 6h hold</td>
                <td className="px-4 py-3"><span className="text-xs bg-emeraldAccent/15 text-emeraldAccent border border-emeraldAccent/20 px-2 py-1 rounded-full">Pass</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-textPrimary">UV index at spray</td>
                <td className="px-4 py-3 font-mono text-textMuted">&lt; 4.0</td>
                <td className="px-4 py-3 font-mono text-emeraldAccent font-medium">2.8 · low</td>
                <td className="px-4 py-3"><span className="text-xs bg-emeraldAccent/15 text-emeraldAccent border border-emeraldAccent/20 px-2 py-1 rounded-full">Pass</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-textPrimary">Incompatibility</td>
                <td className="px-4 py-3 font-mono text-textMuted">No copper 48h</td>
                <td className="px-4 py-3 font-mono text-textMuted">None applied</td>
                <td className="px-4 py-3"><span className="text-xs bg-emeraldAccent/15 text-emeraldAccent border border-emeraldAccent/20 px-2 py-1 rounded-full">Clear</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
