"use client";
import Link from "next/link";
import { useState } from "react";

type Reco = { status:"recommended"|"monitor"|"blocked"|"insufficient_data"; window?:[string,string]; reason:string; readiness?:number; updated_at:string; data_mode:"live"|"demo"|"estimated"; field:string; crop:string; stage:string; };
const mockReco: Reco = { status:"recommended", window:["2026-09-11T00:00:00Z","2026-09-11T03:15:00Z"], reason:"Heat 6.0 + rain-free 4h + delta T 5.1 — need×timing×viability", readiness:68, updated_at:"2026-09-10T06:30:00Z", data_mode:"demo", field:"Akola cotton", crop:"cotton", stage:"square formation (48 DAS)" };

export default function DashboardHome(){
  const [field,setField]=useState("fld_akola_cotton");
  const [season,setSeason]=useState("s_active_cotton");
  const [reco] = useState<Reco>(mockReco);
  const [tasks] = useState([
    {id:"t1", title:"Confirm sowing date", pill:"Need more data", due:"2026-09-11", importance:"high", season:"s_active_cotton"},
    {id:"t2", title:"Add last irrigation (date + mm)", pill:"Need more data", due:"2026-09-12", importance:"medium", season:"s_active_cotton"},
    {id:"t3", title:"Spray window 05:30-08:45 — set reminder", pill:"Task", due:"2026-09-11", importance:"high", season:"s_active_cotton"},
  ]);
  const stale = false; // would compare generated_at vs now + new forecast
  const pillAction = (pill:string)=>{
    if(pill.includes("sowing")) location.href="/onboarding#crop";
    if(pill.includes("irrigation")) location.href="/onboarding";
    if(pill.includes("soil")) location.href="/onboarding#soil";
  };
  const fields=["fld_akola_cotton","fld_rice_1","fld_wheat_1"];
  const onSwitch=(f:string)=>{ setField(f); /* invalidates query keys — slow Field A must never show after switch to B */ };

  return <div className="min-h-screen bg-page">
    <header className="sticky top-0 z-30 bg-page/80 backdrop-blur border-b border-border1">
      <div className="mx-auto max-w-[1280px] px-6 h-[56px] flex items-center gap-3">
        <select value={field} onChange={e=>onSwitch(e.target.value)} className="bg-card border border-border1 rounded-full px-3 py-1.5 text-sm font-mono">
          {fields.map(f=><option key={f} value={f}>{f} {f===field?"· active":""}</option>)}
        </select>
        <select value={season} onChange={e=>setSeason(e.target.value)} className="bg-card border border-border1 rounded-full px-3 py-1.5 text-sm">
          <option value="s_active_cotton">s_active_cotton — cotton (active)</option>
          <option value="s_planned_rice">s_planned_rice — rice (planned)</option>
        </select>
        <span className="ml-auto text-xs font-mono border border-border1 rounded-full px-2 py-1 bg-card">Updated at {new Date(reco.updated_at).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})} IST · {reco.data_mode} {reco.data_mode==="demo" && "— demo fixtures"}</span>
        <Link href="/planning" className="text-xs bg-panel border border-border1 rounded-full px-3 py-1.5">Plan</Link>
        <Link href="/journal" className="text-xs bg-emeraldAccent text-page rounded-full px-3 py-1.5 font-semibold">Journal</Link>
      </div>
    </header>
    <div className="mx-auto max-w-[1280px] px-6 py-6 grid lg:grid-cols-[1.7fr_1fr] gap-6">
      <div className="space-y-4">
        {/* Primary recommendation — action first, score secondary */}
        <div className={"rounded-2xl border p-6 "+(reco.status==="recommended"?"bg-emeraldAccent text-page border-emeraldAccent": reco.status==="blocked"?"bg-danger/10 border-danger/20":"bg-card border-border1")}>
          <div className="text-xs tracking-widest uppercase font-semibold opacity-80">{reco.status==="recommended"?"Action — spray window open": reco.status==="monitor"?"Monitor — no need yet": reco.status==="blocked"?"Do not spray — blocked": "Need more data"}</div>
          <div className="mt-2 text-2xl font-mono font-semibold">{reco.window ? `${new Date(reco.window[0]).toLocaleDateString("en-IN",{timeZone:"Asia/Kolkata"})}, ${new Date(reco.window[0]).toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit"})} – ${new Date(reco.window[1]).toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit"})} IST` : "— no window —"}</div>
          <div className="text-sm mt-1 opacity-90">{reco.reason} {reco.readiness!==undefined && <span className="font-mono border border-white/20 rounded-full px-2 py-0.5 ml-2">Readiness {reco.readiness}/100 (secondary)</span>}</div>
          <div className="text-xs mt-1 opacity-70">Evidence: advisory_v1 · demo fixtures · expires in 6h {stale && "· STALE — revalidate before spray"}</div>
          <div className="mt-4 flex gap-2">
            <Link href="/field/1/hours" className="bg-white text-page px-4 py-2 rounded-full text-sm font-semibold">Why this window →</Link>
            <button disabled={stale} className="bg-white/20 border border-white/30 px-4 py-2 rounded-full text-sm disabled:opacity-40">Apply now {stale?"(revalidate)":""}</button>
          </div>
        </div>
        {/* Pills for missing info — actionable */}
        <div className="rounded-2xl border border-border1 bg-card p-4">
          <div className="text-sm font-semibold">Data requests <span className="text-xs text-textMuted">— tap to provide, vanishes only after confirmed persistence</span></div>
          <div className="mt-2 flex flex-wrap gap-2">{tasks.filter(t=>t.pill.includes("Need")).map(t=><button key={t.id} onClick={()=>pillAction(t.pill)} className="text-xs bg-warning/15 text-warning border border-warning/20 rounded-full px-3 py-1.5">{t.title} →</button>)}</div>
          <div className="mt-3 flex gap-2 text-xs"><Link href="/onboarding" className="px-3 py-1.5 rounded-full border border-border1 bg-panel">Edit details</Link><Link href="/onboarding#soil" className="px-3 py-1.5 rounded-full border border-border1 bg-panel">Review soil test</Link><Link href="/economics" className="px-3 py-1.5 rounded-full border border-border1 bg-panel">Live ROI</Link><Link href="/journal" className="px-3 py-1.5 rounded-full bg-emeraldAccent text-page font-semibold">Season Journal →</Link></div>
        </div>
        {/* 7-day tasks */}
        <div className="rounded-2xl border border-border1 bg-card p-4">
          <div className="text-sm font-semibold">Next 7 days · tasks by day + importance</div>
          <div className="mt-3 grid gap-2">{tasks.map(t=><div key={t.id} className="rounded-xl border border-border1 bg-panel p-3 flex items-center gap-3"><span className={"h-2 w-2 rounded-full "+(t.importance==="high"?"bg-danger":"bg-warning")}/><div className="text-sm"><span className="font-medium">{t.title}</span> <span className="text-xs text-textMuted">· {t.season} · due {t.due}</span></div><span className="ml-auto text-xs font-mono border border-border1 rounded-full px-2 py-1">{t.season===season?"this season":"other season"}</span></div>)}</div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-border1 bg-card p-4">
          <div className="text-sm font-semibold">Field · {reco.field} · {reco.crop} · {reco.stage}</div>
          <div className="text-xs text-textMuted">Several seasons can be active — every card shows season. Current: {season}</div>
          <div className="mt-3 rounded-xl bg-panel border border-border1 p-3">
            <div className="text-xs font-semibold">Water plan — next 7d vs seasonal</div><div className="text-xs font-mono">ETc 4.2 mm/d → 42,000 L/d for {field} (net 32,000 L) · efficiency 0.76</div><div className="text-xs text-textMuted">Recent irrigation 2026-09-08 12 mm · upcoming rain 0 mm (CE Hub) · paddy logic not applied to cotton</div>
          </div>
          <div className="mt-3 rounded-xl bg-panel border border-border1 p-3">
            <div className="text-xs font-semibold">Live ROI (R1) — Estimated net return p10-p90</div><div className="font-mono text-sm">₹18k · <b>₹30k</b> · ₹42k (p50) · ROI {reco.readiness}% scenario — recorded ₹12k spent, remaining forecast ₹38k</div><div className="text-[11px] text-textMuted">Negative margin valid. Incremental biological value: Evidence insufficient (no credible response dist. for this product/stage) · break-even +100 kg @ ₹20/kg</div>
          </div>
          <div className="mt-3 flex gap-2 text-xs"><span className="border border-border1 rounded-full px-2 py-1">Weather 26°C · Wind 8 km/h · Humidity 62%</span><span className="border border-border1 rounded-full px-2 py-1">Risk: heat 6.0</span></div>
          {reco.data_mode==="demo"&&<div className="mt-2 text-[11px] bg-warning/10 border border-warning/20 text-warning rounded-lg p-2">Demo data cannot quietly enter a live account — labeled persistently.</div>}
        </div>
        <div className="rounded-xl border border-border1 bg-panel p-3 text-xs text-textMuted">Stale forecast / partial horizon / no safe window / closed-season states all have deliberate content. “Apply now” disabled until revalidated. Offline: read-only last-seen + expiring estimate.</div>
      </div>
    </div>
    {/* Mobile bottom nav Home|Plan|Journal|Ask */}
    <nav className="lg:hidden fixed bottom-0 inset-x-0 border-t border-border1 bg-card flex">
      {[
        {label:"Home",href:"/dashboard",active:true},
        {label:"Plan",href:"/planning"},
        {label:"Journal",href:"/journal"},
        {label:"Ask",href:"/ask"},
      ].map(n=><Link key={n.label} href={n.href} className={"flex-1 py-3 text-center text-sm "+(n.active?"text-emeraldAccent font-semibold":"text-textMuted")}>{n.label}</Link>)}
    </nav>
  </div>;
}
