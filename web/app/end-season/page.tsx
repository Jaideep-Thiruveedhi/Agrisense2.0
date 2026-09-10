"use client";
import { useState } from "react";
export default function EndSeason(){
  const [form,setForm]=useState({area:"0.404",yield:"4000",unit:"kg",price:"20",cost:"50000",yieldForm:"grain",moisture:"12%"});
  const harvestedKg = Number(form.yield);
  const revenue = harvestedKg * Number(form.price);
  const cost = Number(form.cost);
  const net = revenue - cost;
  const roi = cost>0? (net/cost*100).toFixed(1): "— (cost 0)";
  const predicted = 3800; // from immutable snapshot 2026-08-20
  const error = predicted? ((harvestedKg-predicted)/predicted*100).toFixed(1)+"% (predicted_yield 3800)" : "absolute 200 kg — zero-denominator guard";
  return <div className="min-h-screen bg-page">
    <div className="mx-auto max-w-[720px] px-6 py-6">
      <div className="rounded-2xl border border-border1 bg-card p-6">
        <h1 className="text-xl font-semibold">End season — s_active_cotton → closed</h1>
        <p className="text-sm text-textMuted">Zero yield is valid, not missing. Corrections are revisions, not overwrites. Closing cancels pending spray reminders and freezes timeline.</p>
        <div className="mt-4 grid gap-3">
          <label className="block text-sm">Harvested area (ha)<input value={form.area} onChange={e=>setForm({...form,area:e.target.value})} className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2.5"/></label>
          <label className="block text-sm">Total yield + unit + form + moisture<input value={form.yield} onChange={e=>setForm({...form,yield:e.target.value})} className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2.5"/><div className="flex gap-2 mt-1"><select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} className="bg-panel border border-border1 rounded-lg px-2 py-1.5 text-sm"><option value="kg">kg</option><option value="quintal">quintal</option></select><input value={form.yieldForm} onChange={e=>setForm({...form,yieldForm:e.target.value})} placeholder="grain/lint" className="flex-1 bg-panel border border-border1 rounded-lg px-2 py-1.5 text-sm"/><input value={form.moisture} onChange={e=>setForm({...form,moisture:e.target.value})} placeholder="12%" className="flex-1 bg-panel border border-border1 rounded-lg px-2 py-1.5 text-sm"/></div></label>
          <label className="block text-sm">Sales received + unsold + price<input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="₹/kg farmgate" className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2.5"/></label>
          <label className="block text-sm">Actual costs<input value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2.5"/></label>
        </div>
        <div className="mt-4 rounded-xl bg-panel border border-border1 p-4 font-mono text-sm">
          <div>Revenue {revenue} = {harvestedKg} kg × ₹{form.price}</div><div>Cost {cost}</div><div>Net {net} · ROI {roi}%</div><div className="text-xs text-textMuted mt-1">vs forecast 2026-08-20 snapshot: error {error} — no single “AI accuracy %” invented. n=1, interval coverage 1 season.</div>
        </div>
        <button onClick={()=>alert("POST /seasons/s_active_cotton/close idempotent — immutable snapshots preserved")} className="mt-4 w-full bg-emeraldAccent text-page font-semibold py-3 rounded-xl">Close season — confirm</button>
      </div>
    </div>
  </div>;
}
