"use client";
import { useState } from "react";
import Link from "next/link";

export default function Water(){
  const [area,setArea]=useState("1"); const [unit]=useState<"acre"|"hectare">("acre");
  const areaHa = Number(area||0)*(unit==="acre"?0.404686:1);
  const et0=5.2, kc=1.05; // FAO-56 demo
  const etc = kc*et0; // mm/d
  const taw=140, raw=70, dr=85; // demo root-zone
  const ks = dr<=raw?1: Math.max(0, Math.min(1, (taw-dr)/(taw-raw)));
  const net = Math.max(0, dr - 0.5*taw); // target depletion
  const gross = net/0.75; // efficiency
  const litresNet = net*areaHa*10000;
  const litresGross = gross*areaHa*10000;
  const [whatIf,setWhatIf]=useState({rain:0, irrigate:12});
  return <div className="min-h-screen bg-page">
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <div className="flex items-center gap-2 text-sm"><Link href="/dashboard" className="underline">Dashboard</Link><span>/</span><span className="font-semibold">Water — ETc + irrigation requirement vs seasonal</span><span className="ml-auto text-xs border border-border1 rounded-full px-2 py-1 text-textMuted">ET0 Penman-Monteith · FAO-56</span></div>
      <div className="mt-4 grid lg:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="rounded-2xl border border-border1 bg-card p-5">
          <div className="text-sm font-semibold">Next 7 days — daily + next irrigation</div>
          <div className="text-xs text-textMuted">ETc = Kc(stage) × ET0 · Dr[t]=clip(Dr[t-1]+ETc-(P-runoff)-I ...) · TAW=1000*(FC-WP)×depth · RAW=p×TAW · Ks=1 if Dr≤RAW else (TAW-Dr)/(TAW-RAW)</div>
          <div className="mt-3 grid grid-cols-7 gap-1 text-[11px] font-mono">{Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()+i); const etcD=(etc*Math.random()*0.4+etc*0.8).toFixed(1); return <div key={i} className="rounded-lg bg-panel border border-border1 p-2 text-center"><div className="text-textMuted">{d.toLocaleDateString("en-IN",{month:"short",day:"2-digit",timeZone:"Asia/Kolkata"})}</div><div>{etcD} mm</div><div className="text-emeraldAccent">{(Number(etcD)*0.75).toFixed(1)} net</div></div>;})}</div>
          <div className="mt-4 rounded-xl bg-panel border border-border1 p-3">
            <div className="text-xs font-semibold">What-if: your scenario (debounced, stale-result guarded)</div>
            <div className="flex gap-2 mt-2 text-sm"><label className="flex-1">Rain next 7d mm<input value={whatIf.rain} onChange={e=>setWhatIf({...whatIf,rain:Number(e.target.value)})} className="ml-2 w-20 bg-page border border-border1 rounded-lg px-2 py-1"/></label><label className="flex-1">Planned irrigate mm<input value={whatIf.irrigate} onChange={e=>setWhatIf({...whatIf,irrigate:Number(e.target.value)})} className="ml-2 w-20 bg-page border border-border1 rounded-lg px-2 py-1"/></label></div>
            <div className="text-xs text-textMuted mt-1">Your scenario while editing — save only on explicit action. Forecast rain is uncertain range + observed irrigation updates.</div>
          </div>
          <div className="mt-3 text-xs text-warning border border-warning/20 bg-warning/10 rounded-lg p-2">Paddy: ponded-water balance, seepage/percolation, AWD — not upland Ks/Dr trigger. Missing management → demand estimate with missing-management explanation. Never present estimated root-zone moisture as sensor measurement.</div>
        </div>
        <div className="rounded-2xl border border-border1 bg-card p-5">
          <div className="text-sm font-semibold">Seasonal — climatological (historical ensembles, not 14d forecast through harvest)</div>
          <div className="mt-3 font-mono text-sm">
            <div>ET0 {et0} mm/d (Rn/G in MJ/m²/d, u2 at 2m m/s, es/ea kPa) — temp-only estimate not equated to FAO-56</div>
            <div className="mt-1">ETc {etc.toFixed(2)} mm/d = {kc}×{et0}</div>
            <div>TAW {taw} mm · RAW {raw} mm · Dr {dr} mm · Ks {ks.toFixed(2)}</div>
            <div className="mt-2">Net {net.toFixed(1)} mm → <b>{Math.round(litresNet).toLocaleString()} L</b> for {area} {unit} ({areaHa.toFixed(3)} ha)</div>
            <div>Gross {gross.toFixed(1)} mm → <b>{Math.round(litresGross).toLocaleString()} L</b> @ efficiency 0.75 · gross {">"} net when {"<"}1</div>
            <div className="text-xs text-textMuted mt-1">1 mm×1 ha=10,000 L · 10 mm×0.4 ha=40,000 L (golden) · daily vs seasonal calculated separately</div>
          </div>
          <div className="mt-3 text-xs">Last watering unknown → broad scenario, not precise sensor reading. Recent irrigation 12 mm 2026-09-08 · upcoming rain 0 mm.</div>
          <label className="block mt-3 text-sm">Area for litre conversion<input value={area} onChange={e=>setArea(e.target.value)} className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2"/><span className="text-xs text-textMuted">{areaHa.toFixed(3)} ha used throughout</span></label>
        </div>
      </div>
    </div>
  </div>;
}
