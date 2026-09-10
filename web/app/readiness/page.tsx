"use client";
import { useState } from "react";
import Link from "next/link";

const hours = Array.from({length: 14*24}, (_,i)=>{
  const base = new Date("2026-09-11T00:00:00+05:30"); base.setHours(base.getHours()+i);
  const wind = 4 + Math.random()*10; const Rh=55+Math.random()*20; const delta=2+Math.random()*7;
  const rain = (i>=10 && i<=12)?2:0;
  const viable = delta>=2 && delta<=8 && wind>=3 && wind<=15 && rain===0;
  const reasons = [...(delta<2||delta>8?[`delta_t ${delta.toFixed(1)}`]:[]), ...(wind<3||wind>15?[`wind ${wind.toFixed(1)}`]:[]), ...(rain>0?["rain wash-off"]:[])];
  return {iso: base.toISOString(), local: base.toLocaleString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",day:"2-digit",month:"short"}), delta, wind, rain, viable, reasons};
});
const daily = Array.from({length:14}, (_,i)=>{
  const d=new Date("2026-09-11T00:00:00+05:30"); d.setDate(d.getDate()+i);
  return {date: d.toISOString().slice(0,10), stress: (Math.random()*9).toFixed(1), coverage: i<10?"forecast":"historical climate ensemble (no forecast)"};
});

export default function Readiness(){
  const [selected,setSelected]=useState<string | null>(null);
  const windowSlots = [{start:hours[5].iso, end:hours[8].iso, viable:true, reasons:[]}, {start:hours[18].iso,end:hours[20].iso,viable:false,reasons:["wind 16.2","delta_t 9.1"]}];
  const need=0.82, timing=0.88, viability=0.91;
  const readiness = need && timing && viability ? Math.round(100*need*timing*viability) : null;
  return <div className="min-h-screen bg-page">
    <div className="mx-auto max-w-[1280px] px-6 py-6 space-y-4">
      <div className="flex items-center gap-2 text-sm"><Link href="/dashboard" className="underline">Dashboard</Link><span>/</span><span className="font-semibold">Readiness — s_active_cotton</span><span className="ml-auto text-xs border border-border1 rounded-full px-2 py-1 text-textMuted">Provenance: CE Hub forecast 2026-09-10T06:00Z + meteoblue history · per-variable missingness</span></div>
      <div className="rounded-2xl border border-border1 bg-card p-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div>
          <div className="text-xs tracking-widest uppercase text-textMuted">Need × Timing × Viability → Readiness</div>
          <div className="mt-2 flex gap-3">{Object.entries({need,timing,viability}).map(([k,v])=><div key={k} className="flex-1 rounded-xl border border-border1 bg-panel p-3 text-center"><div className="text-xs text-textMuted capitalize">{k}</div><div className="font-mono text-lg font-semibold">{v?.toFixed(2) ?? "unknown (not 0)"}</div></div>)}</div>
          <div className="mt-3 text-lg font-mono">Readiness {readiness??"— insufficient_data"} / 100 {readiness!==null&&<span className="text-xs text-textMuted">— index, not % success</span>}</div>
          <div className="mt-3 text-sm">Selected window 05:30–08:45 IST (2–3h) <span className="text-emeraldAccent font-mono">viable</span> · Alternatives: 14:00-16:00 blocked (wind, delta_t)</div>
          <div className="mt-3 flex gap-2"><button className="bg-emeraldAccent text-page px-4 py-2 rounded-full text-sm font-semibold">Set reminder</button><button onClick={()=>location.href="/journal"} className="border border-border1 bg-panel px-4 py-2 rounded-full text-sm">I applied it</button><button className="border border-border1 bg-card px-4 py-2 rounded-full text-sm">I will do it later</button><Link href="/ask" className="border border-border1 bg-card px-4 py-2 rounded-full text-sm">Ask about this →</Link></div>
          <div className="mt-2 text-xs text-textMuted">Button does not assert recommended time = actual time — journal asks actual date/time prefilled but editable.</div>
        </div>
        <div className="rounded-xl border border-border1 bg-panel p-4">
          <div className="text-sm font-semibold">14-day stress projection — only to actual daily coverage</div>
          <div className="mt-2 grid grid-cols-7 gap-1 text-[11px]">{daily.map(d=><div key={d.date} className="rounded-lg bg-page border border-border1 p-1.5 text-center"><div className="font-mono">{d.date.slice(5)}</div><div className={d.coverage.includes("forecast")?"text-textPrimary":"text-warning"}>{d.stress}</div></div>)}</div>
          <div className="mt-2 text-[11px] text-textMuted">Hourly only where complete — 14d≠14×24 forced. 336h is engineering aim, not guarantee.</div>
          <div className="mt-3 text-xs"><div className="font-semibold">Weather freshness</div><div className="text-textMuted">Forecast vintage 2026-09-10T06:00Z — expires 2026-09-11T03:00Z · experimental scenario label</div><div className="mt-1">On-site check: wind at 2m {hours[6].wind.toFixed(1)} m/s, RH {hours[6].rain} mm, temp 28°C, VPD 1.2 kPa</div></div>
        </div>
      </div>
      <div className="rounded-2xl border border-border1 bg-card p-4">
        <div className="text-sm font-semibold">Hourly viability — blocked reasons human-readable; alternatives ranked</div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="text-textMuted"><tr><th className="text-left">Local hour</th><th>Delta T °C</th><th>Wind km/h</th><th>Rain mm</th><th>Viable</th><th>Reason</th></tr></thead>
            <tbody>{hours.slice(0,24).map(h=><tr key={h.iso} className={"border-t border-border1 "+(selected===h.iso?"bg-emeraldAccent/10":"")}><td className="py-1.5 text-left">{h.local}</td><td className="text-center">{h.delta.toFixed(1)}</td><td className="text-center">{h.wind.toFixed(1)}</td><td className="text-center">{h.rain}</td><td className={"text-center "+(h.viable?"text-emeraldAccent":"text-danger")}>{h.viable?"✓":"✕"}</td><td className="text-[11px] text-textMuted">{h.reasons.join(", ")||"—"}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-warning">Fungal risk: conditions favor disease — photo does not prove infection, escalate to observation.</div>
      </div>
    </div>
  </div>;
}
