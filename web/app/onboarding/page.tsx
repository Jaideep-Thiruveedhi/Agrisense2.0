"use client";
import { useState } from "react";
import Link from "next/link";
export default function Onboarding(){
  const [step,setStep]=useState(1);
  const [location,setLocation]=useState({label:"Akola 20.70,77.00",lat:20.70,lon:77.00,precision:"approx"});
  const [area,setArea]=useState("1"); const [unit,setUnit]=useState<"acre"|"hectare">("acre");
  const [crop,setCrop]=useState("cotton"); const [sowing,setSowing]=useState("2026-06-15"); const [stage,setStage]=useState("sowing");
  const [soilFile,setSoilFile]=useState<string|null>(null);
  const areaHa = (Number(area)||0)*(unit==="acre"?0.404686:1);
  return <div className="min-h-screen bg-page">
    <div className="mx-auto max-w-[720px] px-6 py-6">
      <div className="rounded-2xl border border-border1 bg-card p-6">
        <div className="flex gap-2 text-xs font-mono text-textMuted">{[1,2,3,4,5,6,7].map(n=><span key={n} className={"h-2 flex-1 rounded-full "+(n<=step?"bg-emeraldAccent":"bg-border1")}/> )}</div>
        <h1 className="mt-4 text-xl font-semibold">Onboarding — {step}/7 · {["Language","Location","Land","Crop choice","Crop details","Soil Health Card","Review"][step-1]}</h1>
        {step===2&&<div className="mt-4 space-y-3">
          <button onClick={()=>navigator.geolocation?.getCurrentPosition(p=>setLocation({label:`${p.coords.latitude.toFixed(4)},${p.coords.longitude.toFixed(4)}`,lat:p.coords.latitude,lon:p.coords.longitude,precision:"gps"}),()=>{})} className="w-full bg-emeraldAccent text-page py-3 rounded-xl font-semibold">Use my location (tap)</button>
          <div className="text-xs text-warning border border-warning/20 bg-warning/10 rounded-lg p-3">If denied, search village/pincode or place pin — pincode centroid is NOT precise GPS. <span className="font-mono">{location.label} · {location.precision}</span></div>
          <input placeholder="Village / pincode" className="w-full bg-panel border border-border1 rounded-lg px-3 py-2.5"/>
        </div>}
        {step===3&&<div className="mt-4 space-y-3">
          <label className="block text-sm">Field name<input placeholder="Akola cotton" className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2.5"/></label>
          <label className="block text-sm">Area + unit (Idempotency: same key ≠ duplicate field)<div className="flex gap-2 mt-1"><input value={area} onChange={e=>setArea(e.target.value)} className="flex-1 bg-panel border border-border1 rounded-lg px-3 py-2.5"/><select value={unit} onChange={e=>setUnit(e.target.value as any)} className="bg-panel border border-border1 rounded-lg px-3"><option value="acre">acre</option><option value="hectare">hectare</option></select></div><span className="text-xs text-emeraldAccent font-mono">Normalized: {areaHa.toFixed(3)} ha — check unit errors!</span></label>
        </div>}
        {step===5&&<div className="mt-4 grid gap-3">
          <select value={crop} onChange={e=>setCrop(e.target.value)} className="bg-panel border border-border1 rounded-lg px-3 py-2.5"><option value="cotton">Cotton</option><option value="rice">Rice</option><option value="wheat">Wheat</option><option value="maize">Maize (planning only)</option><option value="soybean">Soybean</option></select>
          <label className="block text-sm">Sowing date<input type="date" value={sowing} onChange={e=>setSowing(e.target.value)} className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2.5"/></label>
          <label className="block text-sm">Stage / Variety<input value={stage} onChange={e=>setStage(e.target.value)} placeholder="sowing / tillering — confirm stage beats GDD estimate" className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2.5"/></label>
        </div>}
        {step===6&&<div className="mt-4 space-y-3">
          <div className="flex gap-2"><button onClick={()=>setSoilFile("sample.jpg")} className="flex-1 bg-panel border border-border1 py-2.5 rounded-lg">Yes — Upload</button><button className="flex-1 bg-panel border border-border1 py-2.5 rounded-lg">Upload Later</button></div>
          {soilFile&&<div className="rounded-xl border border-emeraldAccent/30 bg-emeraldAccent/10 p-4 text-sm"><div className="font-semibold text-emeraldAccent">OCR draft — REVIEW REQUIRED before authoritative</div><div className="font-mono text-xs mt-1">pH 6.4 · OM 1.2% (not OC) · N 0.051 g/kg · P 12 ppm · K 180 ppm · texture clay-loam · moisture 22% · Sample 2026-08-15 0-15cm</div><div className="text-xs text-warning mt-1">Unreadable stays empty. Estimated = distinctly labeled, never auto-filled from unknown method.</div></div>}
          {!soilFile&&<div className="text-xs text-textMuted">Estimated soil will be labeled distinctly. Never auto-fill N/P from pH.</div>}
        </div>}
        {step===7&&<div className="mt-4 rounded-xl border border-border1 bg-panel p-4 text-sm space-y-2">
          <div>Language: English · Consent: service + learning/opt-in separated</div>
          <div>Location: {location.label} ({location.precision})</div>
          <div>Land: {area} {unit} → {areaHa.toFixed(3)} ha</div>
          <div>Crop: {crop}, sowing {sowing}, stage {stage}</div>
          <div className="text-xs text-textMuted">Save once with Idempotency-Key — second tap does not create duplicate field.</div>
        </div>}
        <div className="mt-6 flex gap-2">
          {step>1&&<button onClick={()=>setStep(s=>s-1)} className="px-4 py-2.5 rounded-lg border border-border1">Back</button>}
          {step<7&&<button onClick={()=>setStep(s=>s+1)} className="ml-auto bg-emeraldAccent text-page px-6 py-2.5 rounded-lg font-semibold">Continue →</button>}
          {step===7&&<button onClick={()=>alert("Idempotent POST /fields with field+season+soil draft → /dashboard")} className="ml-auto bg-emeraldAccent text-page px-6 py-2.5 rounded-lg font-semibold">Save field & season</button>}
        </div>
        <div className="mt-3 text-xs text-textMuted">Draft saved locally (privacy-aware) — refresh restores. <Link href="/dashboard" className="underline text-emeraldAccent">Skip to dashboard →</Link></div>
      </div>
    </div>
  </div>;
}
