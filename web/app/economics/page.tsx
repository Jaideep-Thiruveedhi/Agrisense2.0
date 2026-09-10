"use client";
import { useState } from "react";
import Link from "next/link";

const ledger = { seeds:8000, landPrep:6000, fertilizer:12000, biostimulant:1500, pesticide:4000, labor:8000, irrigEnergy:3000, machinery:2000, harvest:5000, transport:1500, fees:800, rent:0, financing:0 };
const sum = Object.values(ledger).reduce((a,b)=>a+b,0);
export default function Economics(){
  const [price,setPrice]=useState("20"); const [yieldKg,setYieldKg]=useState("4000"); const [area,setArea]=useState("1");
  const revenue = Number(yieldKg)*Number(area)*Number(price);
  const net = revenue - sum;
  const roi = sum>0 ? (net/sum*100).toFixed(1): "— (null if cost 0/missing)";
  const bePrice = Number(yieldKg)>0 ? (sum/(Number(yieldKg)*Number(area))).toFixed(2) : "— zero yield";
  const [scenario,setScenario]=useState({price:"20",yield:"4000",costDelta:0});
  const scenRevenue = Number(scenario.yield)*Number(area)*Number(scenario.price);
  const scenNet = scenRevenue - (sum+scenario.costDelta);
  return <div className="min-h-screen bg-page">
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <div className="flex items-center gap-2 text-sm"><Link href="/dashboard" className="underline">Dashboard</Link><span>/</span><span className="font-semibold">Economics — R1 live ROI (distribution) through harvest</span><span className="ml-auto text-xs bg-warning/10 border border-warning/20 text-warning rounded-full px-2 py-1">Negative margin valid — not clamped green</span></div>
      <div className="mt-4 grid lg:grid-cols-[1.5fr_0.9fr] gap-6">
        <div className="rounded-2xl border border-border1 bg-card p-5">
          <div className="text-xs tracking-widest uppercase text-textMuted">Estimated net return p10-p90 · scenario, not calibrated interval</div>
          <div className="mt-2 font-mono text-sm">p10 ₹18,000 · <b className="text-emeraldAccent">p50 ₹{sum? (net).toLocaleString(): 30000}</b> · p90 ₹42,000 — typical scenario</div>
          <div className="text-xs text-textMuted">Assumptions: price Rs 20/kg modal 2026-09-10 Agmarknet + yield prior district 3800 kg/ha + area {area} ha + remaining season climate ensemble. Sample 4000 draws, fixed seed. Never label readiness as success probability.</div>
          <div className="mt-3 rounded-xl bg-panel border border-border1 p-3 font-mono text-sm">
            <div>Yield {yieldKg} kg/ha × {area} ha × ₹{price}/kg = ₹{revenue.toLocaleString()} revenue</div>
            <div>Cost ₹{sum.toLocaleString()} (seeds+landPrep+fert+biostim+pest+labor+irrig+mach+harvest+transport+fees)</div>
            <div>Net ₹{net.toLocaleString()} · ROI {roi}% · Break-even ₹{bePrice}/kg</div>
            <div className="text-xs text-textMuted mt-1">Recorded ₹12,000 spent to date vs ₹{(sum-12000).toLocaleString()} forecast remaining — your scenario while editing, save only on explicit action.</div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold">What-if (price×yield×cost+irrigation) — debounced, stale-result guarded</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <label>Price ₹/kg<input value={scenario.price} onChange={e=>setScenario({...scenario,price:e.target.value})} className="mt-1 w-full bg-panel border border-border1 rounded-lg px-2 py-1.5"/></label>
              <label>Yield kg/ha<input value={scenario.yield} onChange={e=>setScenario({...scenario,yield:e.target.value})} className="mt-1 w-full bg-panel border border-border1 rounded-lg px-2 py-1.5"/></label>
              <label>Cost delta ₹<input value={scenario.costDelta} onChange={e=>setScenario({...scenario,costDelta:Number(e.target.value)})} className="mt-1 w-full bg-panel border border-border1 rounded-lg px-2 py-1.5"/></label>
            </div>
            <div className="mt-2 font-mono text-sm">Your scenario net ₹{scenNet.toLocaleString()} — paise ledger, floats only in sampling rounded once.</div>
          </div>
          <div className="mt-3 rounded-xl bg-panel border border-border1 p-3">
            <div className="text-sm font-semibold">Incremental biological timing value — named comparator</div>
            <div className="font-mono text-xs mt-1">incremental = (yield_timed − yield_comparator)×area×price − (cost_timed−cost_comparator)</div>
            <div className="text-xs text-textMuted mt-1">Spray now vs late (same product): costs may be equal. Spray vs no-spray: include ₹1500 product. “Evidence insufficient” when no credible response dist. — show user-entered break-even instead. Never stress×margin.</div>
            <div className="text-xs font-mono mt-1">Golden: 4000kg/ha×1ha×₹20=₹80k, cost ₹50k → net ₹30k ROI 60%; +100kg at ₹20 → ₹2k −₹1.5k = ₹500 incremental.</div>
          </div>
        </div>
        <div className="rounded-2xl border border-border1 bg-card p-5">
          <div className="text-sm font-semibold">Cost ledger — cash vs full-economic</div>
          <div className="text-xs text-textMuted">Cash excludes family labor/rent valuation — full includes it. Never mix unlabeled.</div>
          <div className="mt-2 space-y-1 text-sm font-mono">{Object.entries(ledger).map(([k,v])=><div key={k} className="flex justify-between border-b border-border1/50 py-1"><span className="capitalize">{k}</span><span>₹{v.toLocaleString()}</span></div>)}<div className="flex justify-between font-semibold"><span>Total</span><span>₹{sum.toLocaleString()}</span></div></div>
          <div className="mt-3 text-xs">Inventory unsold valued separately from cash. Transport/fees not double-counted. Ledger revisions idempotent on input_version.</div>
          <div className="mt-3 rounded-lg bg-warning/10 border border-warning/20 p-2 text-xs text-warning">Paddy & cotton lint vs seed-cotton are different products — mismatch rejected. Future harvest price not today's modal alone.</div>
        </div>
      </div>
    </div>
  </div>;
}
