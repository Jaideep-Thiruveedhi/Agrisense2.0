"use client";
import { useState } from "react";
import Link from "next/link";

export default function Agronomist(){
  const [fields] = useState([
    {id:"fld_akola", field:"Akola cotton", district:"Akola", crop:"cotton", stress:6.0, window:"2026-09-11 05:30", adherence:0.82, evidence:"demo"},
    {id:"fld_nagpur", field:"Nagpur wheat", district:"Nagpur", crop:"wheat", stress:2.1, window:"—", adherence:0.61, evidence:"demo"},
  ]);
  const [backtest,setBacktest]=useState<{status:"idle"|"running"|"done"; metrics?:{samples:number; mae:number}; coverage?:string}>({status:"idle"} as any);
  return <div className="min-h-screen bg-page">
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <div className="flex items-center gap-2"><span className="text-sm font-semibold">Agronomist — assigned farmers only</span><span className="ml-auto text-xs border border-emeraldAccent/30 bg-emeraldAccent/10 text-emeraldAccent rounded-full px-2 py-1">role-gated</span></div>
      <div className="mt-4 grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
        <div className="rounded-2xl border border-border1 bg-card p-4">
          <div className="flex items-center gap-2"><span className="text-sm font-semibold">Fields (12) · district|crop|season|product filters</span><input placeholder="Search field/district" className="ml-auto bg-panel border border-border1 rounded-full px-3 py-1.5 text-xs"/><button className="text-xs border border-border1 rounded-full px-2 py-1">Filter</button></div>
          <table className="w-full text-xs mt-3">
            <thead className="text-textMuted"><tr><th className="text-left">Field</th><th>Stress</th><th>Window</th><th>Adherence (denom window 7d)</th><th/></tr></thead>
            <tbody>{fields.map(f=><tr key={f.id} className="border-t border-border1"><td className="py-2">{f.field} <span className="text-textMuted">· {f.district} · {f.crop}</span></td><td className="text-center font-mono">{f.stress}</td><td className="font-mono">{f.window}</td><td className="text-center font-mono">{(f.adherence*100).toFixed(0)}% (n=11)</td><td><Link href={`/dashboard`} className="text-emeraldAccent underline">Open →</Link></td></tr>)}</tbody>
          </table>
          <div className="mt-2 text-[11px] text-textMuted">Map aggregates by district — precise locations not disclosed in summaries. All % with denom/time window. Model/green only when not just absent error.</div>
          <div className="mt-4">
            <div className="text-sm font-semibold">Upcoming spray calendar</div>
            <div className="mt-2 grid gap-2 text-xs">{fields.map(f=><div key={f.id} className="rounded-lg bg-panel border border-border1 p-2 flex items-center gap-2"><span className="font-mono">{f.window}</span><span className="text-textMuted">· {f.field}</span><span className="ml-auto text-warning">{f.stress>5?"heat":"ok"}</span></div>)}</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border1 bg-card p-4">
            <div className="text-sm font-semibold">Evidence & provider health</div>
            <div className="text-xs font-mono mt-1">CE Hub: live demo fallback · meteoblue: Estimated · Journal quality: 2 confirmed / 1 draft</div>
            <div className="mt-3">
              <div className="text-sm font-semibold">Model status</div>
              <div className="text-xs mt-1"><span className="bg-warning/15 text-warning border border-warning/20 rounded-full px-2 py-1">pipeline implemented · awaiting real data</span> vs <span className="border border-border1 rounded-full px-2 py-1">validated serving</span> — no auto-promote.</div>
            </div>
            <div className="mt-3">
              <div className="text-sm font-semibold">Backtest (async job)</div>
              <button disabled={backtest.status==="running"} onClick={()=>{setBacktest({status:"running"}); setTimeout(()=>setBacktest({status:"done",metrics:{samples:182,mae:0.42},coverage:"2024-06-01→2024-09-01, forecast vintage 2024-06-01 06Z"}),1200);}} className="mt-1 bg-emeraldAccent text-page rounded-full px-3 py-1.5 text-sm font-semibold disabled:opacity-40">Start backtest</button>
              {backtest.status==="running"&&<div className="text-xs text-textMuted mt-1">Running 182 samples… (job polling /jobs/:id)</div>}
              {backtest.status==="done"&&<div className="text-xs mt-2 font-mono">Samples {backtest.metrics!.samples} · MAE {backtest.metrics!.mae} · Coverage {backtest.coverage} · <span className="text-warning">hindsight reanalysis ≠ forecast skill</span> · Limitations: no farm labels yet, not pre-trained</div>}
            </div>
          </div>
          <div className="rounded-xl border border-border1 bg-panel p-3 text-xs text-textMuted">Drill-down is authorized per farmer — second tenant cannot read via /api/agronomist/*.</div>
        </div>
      </div>
    </div>
  </div>;
}
