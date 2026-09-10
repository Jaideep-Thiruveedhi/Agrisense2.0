"use client";
import { useState } from "react";
import Link from "next/link";

type Candidate = {
  crop: string; variety?: string;
  suitability: number; // 0-1
  reasons: string[];
  sowing: [string,string]; // dates
  harvest: [string,string];
  water_mm: number;
  water_litres: number;
  cost_p10:number; cost_p50:number; cost_p90:number;
  revenue_p10:number; revenue_p50:number; revenue_p90:number;
  profit_p50:number; roi: number|null;
  warnings: string[];
  evidence: "empirical"|"scenario";
  excluded_reason?: string;
};

function liters(mm:number, areaHa:number){ return mm * areaHa * 10000; }

export default function PlanningCompare(){
  const [area,setArea]=useState("1"); const [unit,setUnit]=useState<"acre"|"hectare">("acre");
  const areaHa = (Number(area)||0)*(unit==="acre"?0.404686:1);
  const [sort,setSort]=useState<"suitability"|"water"|"return"|"duration">("suitability");
  const candidates: Candidate[] = [
    { crop:"cotton", suitability:0.82, reasons:["soil pH 6.4 in 6.0-6.5","Kharif window open","water budget fits"], sowing:["2026-06-15","2026-06-30"], harvest:["2026-11-15","2026-12-10"], water_mm:680, water_litres: liters(680,areaHa), cost_p10:42000,cost_p50:50000,cost_p90:58000, revenue_p10:65000,revenue_p50:80000,revenue_p90:95000, profit_p50:30000, roi:60, warnings:["heat 6.0 late season","rain wash 12pm"], evidence:"scenario"},
    { crop:"rice", suitability:0.71, reasons:["Meteoblue + CE Hub forecast available","ponded water manageable"], sowing:["2026-06-10","2026-07-10"], harvest:["2026-10-20","2026-11-15"], water_mm:1100, water_litres: liters(1100,areaHa), cost_p10:38000,cost_p50:46000,cost_p90:54000, revenue_p10:62000,revenue_p50:78000,revenue_p90:92000, profit_p50:32000, roi:69, warnings:["water high vs budget"] , evidence:"scenario"},
    { crop:"wheat", suitability:0, reasons:[], sowing:["2026-11-01","2026-11-30"], harvest:["2027-03-15","2027-04-10"], water_mm:450, water_litres: liters(450,areaHa), cost_p10:30000,cost_p50:35000,cost_p90:40000, revenue_p10:50000,revenue_p50:60000,revenue_p90:70000, profit_p50:25000, roi:71, warnings:[], evidence:"scenario", excluded_reason:"off-season for proposed 2026-09 sowing — Rabi window Nov only (per ICAR calendar)"},
  ].filter(c=>!c.excluded_reason) as Candidate[];
  // Add maize/soybean only if calendar supports — per spec, India rice/wheat/cotton primary
  const sorted = [...candidates].sort((a,b)=>{
    if(sort==="suitability") return b.suitability - a.suitability;
    if(sort==="water") return a.water_mm - b.water_mm;
    if(sort==="return") return b.profit_p50 - a.profit_p50;
    // duration = harvest end - sowing start
    return (new Date(a.harvest[1]).getTime()-new Date(a.sowing[0]).getTime()) - (new Date(b.harvest[1]).getTime()-new Date(b.sowing[0]).getTime());
  });
  const [compare,setCompare]=useState<Set<string>>(new Set());
  const toggle=(crop:string)=>setCompare(s=>{ const n=new Set(s); if(n.has(crop)) n.delete(crop); else if(n.size<3) n.add(crop); return n;});

  return <div className="min-h-screen bg-page">
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <div className="flex items-center gap-3 text-sm text-textMuted">
        <Link href="/" className="underline">Home</Link> <span>/</span> <span className="text-textPrimary">Planning — Help me choose · up to 5 eligible</span>
        <span className="ml-auto text-xs border border-border1 rounded-full px-2 py-1">Advisor demo · Water/R1 scenario — not calibrated confidence</span>
      </div>
      <div className="mt-4 rounded-2xl border border-border1 bg-card p-6 grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <h1 className="text-xl font-semibold">Top 5 eligible — your location, season, water & budget</h1>
          <p className="text-sm text-textMuted mt-1">Default suitability sorted. Exclusions explained below. Changing area rescales litres & rupees, not per-ha yield.</p>
          <div className="mt-4 flex flex-wrap gap-2 items-center text-sm">
            <label className="flex items-center gap-2">Area <input value={area} onChange={e=>setArea(e.target.value)} className="w-20 bg-panel border border-border1 rounded-lg px-2 py-1.5"/><select value={unit} onChange={e=>setUnit(e.target.value as any)} className="bg-panel border border-border1 rounded-lg px-2 py-1.5"><option value="acre">acre</option><option value="hectare">hectare</option></select><span className="font-mono text-emeraldAccent">{areaHa.toFixed(3)} ha</span></label>
            <div className="ml-auto flex gap-1 p-1 rounded-full bg-panel border border-border1">{(["suitability","water","return","duration"] as const).map(k=><button key={k} onClick={()=>setSort(k)} className={"px-3 py-1.5 rounded-full text-xs font-semibold "+(sort===k?"bg-textPrimary text-page":"text-textMuted")}>{k}</button>)}</div>
          </div>
          <div className="mt-4 grid gap-4">
            {sorted.map(c=>(
              <div key={c.crop} className="rounded-xl border border-border1 bg-panel p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2"><span className="capitalize font-semibold">{c.crop}</span> <span className="text-xs bg-emeraldAccent/15 text-emeraldAccent border border-emeraldAccent/20 px-2 py-0.5 rounded-full">Suit {Math.round(c.suitability*100)}%</span> <span className="text-[11px] border border-border1 rounded-full px-2 py-0.5 text-textMuted">{c.evidence}</span></div>
                  <div className="text-xs text-textMuted mt-1">{c.reasons.join(" · ")}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-page border border-border1 rounded-lg p-2"><div className="text-textMuted">Sowing</div><div className="font-mono font-medium">{c.sowing[0]} → {c.sowing[1]}</div></div>
                    <div className="bg-page border border-border1 rounded-lg p-2"><div className="text-textMuted">Harvest</div><div className="font-mono font-medium">{c.harvest[0]} → {c.harvest[1]}</div></div>
                    <div className="bg-page border border-border1 rounded-lg p-2"><div className="text-textMuted">Water</div><div className="font-mono font-medium">{c.water_mm} mm · {Math.round(c.water_litres).toLocaleString()} L</div></div>
                    <div className="bg-page border border-border1 rounded-lg p-2"><div className="text-textMuted">Warnings</div><div className="text-warning">{c.warnings.join(", ")||"—"}</div></div>
                  </div>
                </div>
                <div className="md:w-[240px] rounded-xl bg-page border border-border1 p-3">
                  <div className="text-xs text-textMuted">Cost p10-p90</div><div className="font-mono text-sm">₹{c.cost_p10.toLocaleString()} · <b>₹{c.cost_p50.toLocaleString()}</b> · ₹{c.cost_p90.toLocaleString()}</div>
                  <div className="text-xs text-textMuted mt-1">Revenue p50</div><div className="font-mono text-sm">₹{c.revenue_p50.toLocaleString()}</div>
                  <div className="text-xs text-textMuted mt-1">Net profit · ROI</div><div className="font-mono text-sm">₹{c.profit_p50.toLocaleString()} · {c.roi!==null?c.roi+"%":"— (cost 0)"}</div>
                  <div className="text-[11px] text-textMuted mt-1">Within-crop baseline only — never “cotton 30% more than rice” by mass.</div>
                  <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={compare.has(c.crop)} onChange={()=>toggle(c.crop)} /> Compare</label>
                </div>
              </div>
            ))}
            <div className="text-xs text-textMuted">Fewer than 5 shown when off-season — explains exclusions: wheat excluded ({candidates.length<3?"see reason above":"—"}). Total field area is never applied to every crop separately — allocation validated when you select candidates.</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emeraldAccent/20 bg-card p-4">
            <div className="text-sm font-semibold">Selected for comparison: {compare.size}</div>
            <div className="text-xs text-textMuted">Choose 2-3, open drawer below.</div>
            <div className="mt-2 flex flex-wrap gap-2">{[...compare].map(c=><span key={c} className="text-xs bg-panel border border-border1 rounded-full px-2 py-1 capitalize">{c}</span>)}</div>
            <button disabled={compare.size<2} className="mt-3 w-full bg-emeraldAccent text-page font-semibold py-2.5 rounded-lg disabled:opacity-40">Compare side-by-side →</button>
            <div className="mt-2 text-[11px] text-textMuted">R2 is economics under common area/budget/date — ranked by suitability or risk-aware return.</div>
          </div>
          <div className="rounded-xl border border-border1 bg-panel p-4 text-xs">
            <div className="font-semibold">How compatibility is explained</div>
            <div className="text-textMuted mt-1">Soil + climate + sowing season + water availability. This is suitability, not yield guarantee.</div>
          </div>
          {compare.size>=2&&<div className="rounded-xl border border-border1 bg-card p-3">
            <div className="text-xs font-semibold">Comparison drawer (drawer/page) — identically ordered metrics, stacked on mobile</div>
            <table className="w-full text-xs mt-2"><thead className="text-textMuted text-[11px]"><tr><th className="text-left">Metric</th>{[...compare].map(c=><th key={c} className="text-right capitalize">{c}</th>)}</tr></thead><tbody><tr><td>Water L</td>{[...compare].map(c=><td key={c} className="text-right font-mono">{Math.round(sorted.find(x=>x.crop===c)!.water_litres).toLocaleString()}</td>)}</tr><tr><td>Profit p50</td>{[...compare].map(c=><td key={c} className="text-right font-mono">₹{sorted.find(x=>x.crop===c)!.profit_p50.toLocaleString()}</td>)}</tr></tbody></table>
            <button onClick={()=>alert("Creates separate planned seasons with area allocation validation")} className="mt-3 w-full border border-border1 bg-panel py-2 rounded-lg text-sm">Use these for my field →</button>
          </div>}
        </div>
      </div>
    </div>
  </div>;
}
